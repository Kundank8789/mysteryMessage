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
        console.log("failed to update accpectMessage:")
        return Response.json({
            success: false,
        message: "Failed to update accpectMessage"
    }, { status: 500}) 
    }
}
