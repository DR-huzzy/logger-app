import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';
import util from "util";
import crypto from "crypto";
import { prisma } from '../lib/prisma';


const signToken = (id, role) => {
    return jwt.sign(
        {id , role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.LOGIN_EXPIRES}
    )
}

const createSendResponse = async (user, statusCode, res) => {

    const accessToken = signToken(user.id, user.role);
    const refreshToken = crypto.randomUUID();

    // Save refresh token in DB
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
    })

    res.status(statusCode).json({
        status: 'success',
        accessToken,
        refreshToken
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

        const isPasswordCorrect = await bcrypt.compare(password, user.password);


        if(!user || !isPasswordCorrect){
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect password'
            });
        }

        createSendResponse(user, 200, res);

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

            res.status(403).json({
                message: 'You do not permission to perform this action'
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

        const { refreshToken } = req.body;
        
        if (!refreshToken) {

            return res.status(403).json({
                status: "fail",
                message: "Refresh token required"
            })

        }

        // Find in DB
        const storedToken = await prisma.refreshToken.findUnique({
            where : { token : refreshToken},
            include: { user : true}
        })

        if (!storedToken){

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
                where: { token: refreshToken}
            })

            return res.status(403).json({
                status: "fail",
                message: "refresh token expired"
            })
            
        }


        // Rotation [delete old token]

        await prisma.refreshToken.delete({
            where: { token: refreshToken}
        });


        // generate new access token
        // generate new refresh token
        // Save new tokens in db

        createSendResponse(storedToken.user, 200, res);

        console.log(storedToken.user);

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "something went wrong"
        });
    }

} ;