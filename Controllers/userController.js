import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Name , email and password are required",
      });
    }

    // check if email already exist

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email already in use",
      });
    }

    // Hash user password

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "IT_INTERN",
      },
    });

    //Return user data

    return res.status(201).json({
      status: "success",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to create user",
    });
  }
};

export const getAllUsers = async (req, res, next) => {
  try {

    // Find users and exclude passwords

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve users",
    });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        status: "fail",
        message: "New password is required",
      });
    }

    //check if user exist

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    //Hash the new password

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    //Update the user's password in DB

    await prisma.user.update({
      where: { id: Number(id) },
      data: { password: hashedPassword },
    });

    return res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to reset password",
    });
  }
};


export const deleteUser = async (req, res, next ) => {

  try {

    const { id } = req.params;

    // Check if user exists

    const user = await prisma.user.findUnique({
      where: {id : Number(id)}
    })

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "user not found"
      })
    }

    //Prevent admin from deleting him self

    if (user.id === req.user.id){
      return res.status(400).json({
        status: "fail",
        message: "You cannot delete your own account"
      });
    }


    // Delete user from db

    await prisma.user.delete({
      where : { id : Number(id)}
    })


    return res.status(200).json({
      status: "success",
      message: "User deleted successfully"
    });


  } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Failed to delete user"
      });
  }
}
