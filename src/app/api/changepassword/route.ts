import bcrypt from "bcryptjs";
import User from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { password, otp, email } = await request.json();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No user",
        },
        { status: 500 }
      );
    }
    const goodOTP = user.verifyCode === otp;
    if (!goodOTP) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect OTP",
        },
        { status: 400 }
      );
    }

    if (goodOTP) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.verifyCode = "";
      await user.save();

      return NextResponse.json(
        {
          success: true,
          message: "Password changed  sucessfully",
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
