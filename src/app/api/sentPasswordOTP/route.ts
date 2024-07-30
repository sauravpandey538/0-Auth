import dbConnect from "@/lib/dbConnect";
import User from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email } = await request.json();
    const existingVerifiedUser = await User.findOne({
      email,
      isVerified: true,
    });
    if (!existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Verify your email first",
        },
        { status: 404 }
      );
    }
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    existingVerifiedUser.verifyCode = verifyCode;
    await existingVerifiedUser.save();
    // OTP
    const username = existingVerifiedUser.username;
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
      "forget password"
    );
    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "OTP send sucessfully ",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error during sending OTP for passowrd change",
      },
      { status: 500 }
    );
  }
}
