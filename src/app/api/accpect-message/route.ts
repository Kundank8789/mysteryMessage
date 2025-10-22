import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth"

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user
    if (!session || !session.user){
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401
        })

    }
    const userId = user._id;
    const {accpectMessage} = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { accpectMessage: accpectMessage },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404})
        }
        return Response.json({
            success: true,
            message: "accpectMessage updated successfully",
            data: updatedUser
        }, { status: 200})
        
    } catch (error) {
        console.log("failed to update accpectMessage:", error)
        return Response.json({
            success: false,
        message: "Failed to update accpectMessage"
    }, { status: 500}) 
    }
}

export async function GET(request: Request) {
    await dbConnect();
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
        return Response.json({
            success: false,
            message: "User not found"
        }, { status: 404})
    }
    return Response.json({
        success: true,
        message: "User retrieved successfully",
    }, { status: 200})
}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User
    if (!session || !session.user){
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401
        })
    }
    const userId = user._id;
    try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
        return Response.json({
            success: false,
            message: "User not found"
        }, { status: 404})
    }
    return Response.json({
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages
    }, { status: 200})
}   catch (error) {
    console.log("failed to get isAcceptingMessages:", error)
    return Response.json({
        success: false,
        message: "Failed to get isAcceptingMessages"
    }, { status: 500})
}
}
