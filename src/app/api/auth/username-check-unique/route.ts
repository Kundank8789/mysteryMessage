import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get("username")
        }
        const result = UsernameQuerySchema.safeParse(queryParams);
        
        if (!result.success) {
            const usernameErrors = result.error.formt().username?. _error || [];
            return Response.json(
                {
                    success: false,
                    message: "Invalid username",
                    errors: usernameErrors,
                },
                { status: 400 }
            );
        }
        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                    errors: ["Username is already taken"],
                },
                { status: 400 }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Username is available",
                errors: [],
            },
            { status: 200 }
        );
            
    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return Response.json(
            {
                success: false,
                message: "Server error",
            },
            { status: 500 }
        );
    }
}
