import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        // Check if username is already taken
        const existingUserByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });
        if (existingUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 400 }
            );
        }

        // Check if user exists by email
        const existingUserByEmail = await UserModel.findOne({ email });

        const verifycode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email",
                    },
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifycode = verifycode;
                existingUserByEmail.verifycodeExpiry = new Date(Date.now() + 3600000); // 1 hour
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifycode,
                verifycodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(email, username, verifycode);

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: "User registration successful, but failed to send verification email",
                },
                { status: 201 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please verify your email",
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error registering user", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            { status: 500 }
        );
    }
}
