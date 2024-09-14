import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { ApiErrorResponse } from "@/types/ApiErrorResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse | ApiErrorResponse> {
  try {
    const response = await resend.emails.send({
      from: "onboarding@utkarsh.tech",
      to: email,
      subject: "fundrr | verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if(!response.error){
      return {
        success: true,
        message: "Verification email was sent successfully",
        status: 201,
      };
    }else{
      return {
        success: false,
        message: response.error.message,
        status: 401,
      };
    }
  } catch (emailError) {
    console.error("Error in sending verification email", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
      errorCode: 500,
    };
  }
}
