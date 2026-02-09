import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';
import util from "util";
import { prisma } from '../lib/prisma';


const signToken = (id, role) => {
    return jwt.sign(
        {id , role},
        process.env.JWT_SECRET,
        {expiresIn: '2h'}
    )
}

const createSendResponse = (user, statusCode, res) => {

    const token = signToken(user.id, user.role);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
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


        if(!user , !isPasswordCorrect){
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



