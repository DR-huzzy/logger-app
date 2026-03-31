import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';
import util from "util";
import crypto from "crypto";
import { prisma } from '../lib/prisma';


const signToken = (id, role, name) => {
    return jwt.sign(
        {id , role, name},
        process.env.JWT_SECRET,
        {expiresIn: process.env.LOGIN_EXPIRES}
    )
}

const createSendResponse = async (user, statusCode, res) => {

    const accessToken = signToken(user.id, user.role);
    const refreshToken = crypto.randomUUID();
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    // Save refresh token in DB
    await prisma.refreshToken.create({
        data: {
            token: hashedToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
    })
    
    //storing refresh token in a cookie

    res.cookie("refreshToken", 
                refreshToken,
                {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                    maxAge: 24 * 60 * 60 * 1000
                }
            
            );


    res.status(statusCode).json({
        status: 'success',
        accessToken
    })
}

export const loginUser =  async (req, res) => {

    try {
        
        const { email, password} = req.body;

        if(!email || !password){

            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password'
            })

        };

        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        //check if the user exists before trying to compare the password.

        //const isPasswordCorrect = await bcrypt.compare(password, user.password);


        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect password'
            });
        }

        await createSendResponse(user, 200, res);

    } catch(error){
        res.status(500).json({ 
            status: 'error',
            message: 'An error occurred while logging in'
        });
    }
}


// To authenticate users

export const protect = async (req, res, next) => {

    try {
        
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")){

            return res.status(401).json({
                status: 'failed',
                message: 'Not authorized'
            });
        } 

        const token = authHeader.split(" ")[1];

        const decodedToken = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
        console.log(decodedToken);

        req.user = decodedToken;
        next();

    } catch (error) {
        res.status(401).json({ 
            message: "Invalid or expired token" 
        });
    }

}


// To authorize user

export const restrict = (role) => {

    return (req, res, next) => {
        if (req.user.role !== role){

            return res.status(403).json({
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    }
}



export const requirePasscode = (req, res , next ) => {

    const passcode = req.headers["x-admin-passcode"];

    if (!passcode || passcode !== process.env.ADMIN_PASSCODE){

        return res.status(401).json({
            status: 'fail',
            message: 'Invalid admin passcode'
        });
    }

    next();
    
}



// Refresh token logic

export const refreshToken = async (req, res, next) => {


    try {
        // Check if token exist

        const { refreshToken } = req.cookies;
        
        
        if (!refreshToken) {

            return res.status(401).json({
                status: "fail",
                message: "Refresh token required"
            })

        }

        // Find in DB
        /* const storedToken = await prisma.refreshToken.findUnique({
            where : { token : refreshToken},
            include: { user : true}
        }) */


        // Fetch all non-expired tokens from the DB

        const storedTokens = await prisma.refreshToken.findMany({
            where: { expiresAt: { gt: new Date() } },
            include: { user: true }
        });
        
    

        //Loop through each token and compare

        const storedToken = await Promise.all(

            storedTokens.map( async (dbToken) => {
                const isMatch = await bcrypt.compare(refreshToken, dbToken.token);
                return isMatch ? dbToken : null;
            })

        ).then(results => results.find(Boolean));


        if (!storedToken){

             res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            });

            return res.status(403).json({
                status: "fail",
                message: "Invalid refresh token"
            })

        }

        // check expiry
        // for token

        const isExpired = storedToken.expiresAt < new Date();

        if (isExpired){

            await prisma.refreshToken.delete({
                where: { id: storedToken.id }  // ← use the id from the found record
            })

            return res.status(403).json({
                status: "fail",
                message: "refresh token expired"
            })
            
        }


        // Rotation [delete old token]

        await prisma.refreshToken.delete({
            where: { id: storedToken.id }  // ← use the id from the found record
        });

        
        // generate new access token
        // generate new refresh token
        // Save new tokens in db

        await createSendResponse(storedToken.user, 200, res);

        //console.log(storedToken.user);

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "something went wrong"
        });
    }

} ; 



export const logOut = async (req, res, next) => {

    try {

        // Verify refresh token exist in cookie

        const { refreshToken } = req.cookies;
        
        if (!refreshToken){

            return res.status(200).json({
                status: "Success",
                message: "Logged out successfully"
            })

        }

        // check if refresh token exist in database

        /* const existingToken = await prisma.refreshToken.findUnique({
            where : { token: refreshToken }
        })  */


        // Fetch all non-expired tokens from the DB

        const existingTokens = await prisma.refreshToken.findMany({
            where: { expiresAt: { gt: new Date() } },
            include: { user: true }
        });


        //Loop through each token and compare

        const existingToken = await Promise.all(

            existingTokens.map( async (dbToken) => {
                const isMatch = await bcrypt.compare(refreshToken, dbToken.token);
                return isMatch ? dbToken : null;
            })

        ).then(results => results.find(Boolean));

        // Delete token from database

        if (existingToken){

            await prisma.refreshToken.delete({
                where : { id: existingToken.id }  // ← use the id from the found record
            })
        } 

        // Clear Http only cookie

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })


        return res.status(204).json({
            message: "logged out"
        })

        
        
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Could not log out"
        })
    }
}