import dbConnect from "@/lib/dbConnect";
import User from "@/model/user";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import { url } from "inspector";

const usernameValidationSchema = z.object({ username: usernameValidation });

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
      username: searchParams.get("username"),
    };
    //validate with zod
    const result = usernameValidationSchema.safeParse(queryParams);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          message: usernameError,
          success: false,
        },
        { status: 500 }
      );
    }
    const { username } = result.data;
    const existingUser = await User.findOne({ username, isVerified: true });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "Username is already taken",
          success: false,
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Username is unique",
          success: true,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("error checking error", error);
    return NextResponse.json(
      {
        message: "Error checking username",
        success: false,
      },
      { status: 500 }
    );
  }
}
