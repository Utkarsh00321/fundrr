import { verifySchema } from "@/schemas/verifyUserSchema";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  // connect to db first
  await dbConnect();

  try {
    const { code, username } = await request.json();

    const parsedResult = verifySchema.safeParse({ code });

    // validation failed
    if (!parsedResult.success) {
      console.log("Code validation failed");
      const verifyCodeErrors = parsedResult.error.format().code?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            verifyCodeErrors?.length > 0
              ? verifyCodeErrors.join(", ")
              : "Invalid request body",
        },
        {
          status: 400,
        },
      );
    }

    const user = await User.findOne({ username });

    // username does not exist
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 400 },
      );
    }

    // user exists
    const verifyCode = parsedResult.data.code;

    // check if code is correct
    const isCodeCorrect = verifyCode === user.verificationCode;

    // check if code is not expired
    const isCodeNotExpired = new Date() < new Date(user.verificationCodeExpiry);

    // code is correct and is not expired
    if (isCodeCorrect && isCodeNotExpired) {
      // verify the user and save to db
      user.isVerified = true;
      await user.save();

      return NextResponse.json(
        {
          message: "User verification successful",
          success: true,
        },
        { status: 201 },
      );
    }
    // code is expired
    if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          message: "Verification code is expired sign up again",
          success: false,
        },
        { status: 402 },
      );
    }
    // Incorrect code
    else {
      return NextResponse.json(
        {
          message: "Incorrect verification code",
          success: false,
        },
        { status: 402 },
      );
    }
  } catch (error) {
    console.log("Error in verifying user");
    return NextResponse.json(
      { message: "Could not verify user" },
      { status: 500 },
    );
  }
}
