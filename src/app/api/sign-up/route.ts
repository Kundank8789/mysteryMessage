import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";

export async function POST(request: Request){
    await dbConnect();
    try {
        const {username, email, password} = await request.json();
        const existingUserverifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
         });
        if (existingUserverifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken",
            }, {status: 400});
        }
        const existingUserverifiedByEmail = await UserModel.findOne({email});

        const verifycode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) { 
                return Response.json({
                    success: false,
                    message: "user already exists with this email",
                }, {status: 400});
            }else{
                const hasdedPassword =await bcrypt.hash(password,10)
                existingUserByEmail.password = hasdedPassword;
                existingUserByEmail.verifycode = verifycode;
                existingUserByEmail.verifycodeExpiry= new Date(Date.now()+360000)
                await existingUserByEmail.save();
                
            }
        }else{
            const hasdedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

           const newUser = new UserModel({
                username,
                email,
                password:hasdedPassword,
                verifycode,
                verifycodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            })
            await newUser.save();
        }
        const  emailResponse = await sendVerificationEmail(
            email,
            username,
            verifycode
        );
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: "User registration sucessful. please verify your email",
            }, {status: 201});
        }
    } catch (error) {
        console.error("Error register user", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            {status: 500}
        )
    }
}