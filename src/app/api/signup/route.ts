import dbConnect from "@/lib/dbConnect";
import User from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email, username, password } = await request.json();
    const existingVerifiedUser = await User.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "UserName is already taken",
        },
        { status: 400 }
      );
    }
    const existingEmailUser = await User.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingEmailUser) {
      if (existingEmailUser.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already exit with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingEmailUser.password = hashedPassword;
        existingEmailUser.verifyCode = verifyCode;
        existingEmailUser.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingEmailUser.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      // for 1 hour
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // OTP
    const type = "verification";
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
      type
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
        message: "You are registered ",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error during registering new user",
      },
      { status: 500 }
    );
  }
}
