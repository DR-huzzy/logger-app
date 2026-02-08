import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';
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