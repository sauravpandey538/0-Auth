import dbConnect from "@/lib/dbConnect";
import User from "@/model/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const { email, password } = await request.json();
        const user = await User.findOne({
            email,

        });
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email is incorrect",
                },
                { status: 400 }
            );
        }
        if (user?.isVerified) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            //console.log(isPasswordCorrect)
            if (!isPasswordCorrect) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Password is incorrect",
                    },
                    { status: 400 }
                );
            }


            return NextResponse.json(
                {
                    success: true,
                    message: "SignIn sucessfully",
                },
                { status: 200 }
            );
        }
        else {
            return NextResponse.json(
                {
                    success: false,
                    message: "User is not verified yet",
                },
                { status: 400 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Error during signin  user",
            },
            { status: 500 }
        );
    }
}
