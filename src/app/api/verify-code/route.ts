import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const {username, code} = await request.json();
    } catch (error) {
        console.error("Error verifying user",error)
        return  Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500
        })
    }
}