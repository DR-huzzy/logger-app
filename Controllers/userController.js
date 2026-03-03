import { prisma } from "../lib/prisma";
import bcrypt from 'bcrypt';



export const createUser = async (req , res , next) => {

    try {
        
        const {name, email, password} = req.body;

        // validate input
        if (!name , !email, !password){
            return res.status(400).json({
                status: "fail",
                message: "Name , email and password are required"
            });
        } 

        // check if email already exist

        const existingUser = await prisma.user.findUnique({
            where : { email }
        });

        if (existingUser){
            return res.status(400).json({
                status: "fail",
                message: "Email already in use"
            });
        }


        // Hash user password

        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user 

        const newUser = await prisma.user.create({

            data : {
                name,
                email,
                password : hashedPassword,
                role :"IT_INTERN"
            }
            
        })


        //Return user data 

        return res.status(201).json({

            status: "success",
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }

        });


    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Failed to create user"
        });
    }
}