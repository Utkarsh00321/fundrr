import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import User from "@/models/User";
import bcryptjs from "bcryptjs";
import { NextRequest,NextResponse} from "next/server";

export async function POST(
  request: NextRequest,
){
  // Connect to database first
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // find the user if it already exists and verified
    const existingVerifiedUser = await User.findOne({
      username,
      isVerified: true,
    });

    // User found then return
    if (existingVerifiedUser) {
      return NextResponse.json({
        success: false,
        message: "User already exists.",
        status: 400,
      });
    }

    // find user by email
    const existingEmail = await User.findOne({ email });

    // generate 6 digit verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // User found
    if (existingEmail) {
      // User is verified
      if (existingEmail.isVerified) {
        return NextResponse.json({
          success: true,
          message: "Email already exists.",
          status: 400,
        });
      }
      // User is not verified
      else {
        // update the password and verification code
        const hashedPassword = await bcryptjs.hash(password, 10);
        existingEmail.password = hashedPassword;
        existingEmail.verificationCode = verifyCode;
        existingEmail.verificationCodeExpiry = new Date(Date.now() + 360000);
        await existingEmail.save();
      }
    }
    // User does not exist
    else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const expiryDate = new Date(Date.now() + 360000);
      const newUser = new User({
        username,
        email,
        verificationCode: verifyCode,
        password: hashedPassword,
        verificationCodeExpiry: expiryDate,
        isVerified: false,
      });
      await newUser.save();
    }
    // send verification code through email
    const verificationMailResponse =  await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );
    
    if (verificationMailResponse.success) {
      return NextResponse.json( {
        success: true,
        message: "Verification code sent. Please verify your account.",
        status: 201,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: verificationMailResponse.message,
        status: 500,
      });
    }
  } catch (error) {
    console.log("Error registering the user", error);
    return NextResponse.json({
      success: false,
      message: "Error registering ther user",
      errorCode: 500,
    });
  }
}
