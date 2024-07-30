import User from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { date } from "zod";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No user",
        },
        { status: 500 }
      );
    }
    const goodOTP = user.verifyCode === code;
    const goodTiming =
      new Date(user.verifyCodeExpiry as Date) > new Date() || true;
    if (!goodOTP) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect OTP",
        },
        { status: 400 }
      );
    }

    if (!goodTiming) {
      return NextResponse.json(
        {
          success: false,
          message: "Please signup again",
        },
        { status: 400 }
      );
    }
    if (goodOTP && goodTiming) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json(
        {
          success: true,
          message: "Account verified sucessfully",
          newUser: user,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error during verifying code",
      },
      { status: 500 }
    );
  }
}
