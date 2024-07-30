import { emailValidation } from "./../../../schemas/signUpSchema";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/user";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const emailValidationSchema = z.object({ email: emailValidation });

export async function GET(request: NextRequest) {
  if (request.method !== "GET") {
    return NextResponse.json(
      {
        message: "Only GET method is valid till now",
        success: false,
      },
      { status: 405 }
    );
  }
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      email: searchParams.get("email"),
    };
    //validate with zod
    const result = emailValidationSchema.safeParse(queryParams);
    if (!result.success) {
      const usernameError = result.error.format().email?._errors || [];
      return NextResponse.json(
        {
          message: usernameError,
          success: false,
        },
        { status: 500 }
      );
    }
    const { email } = result.data;
    const existingUser = await User.findOne({ email, isVerified: true });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "Please enter your OTP below",
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "This email is not registered",
          success: false,
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("error checking error", error);
    return NextResponse.json(
      {
        message: "Error checking email",
        success: false,
      },
      { status: 500 }
    );
  }
}
