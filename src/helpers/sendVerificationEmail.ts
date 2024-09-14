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
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "fundrr | verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification email sent successfully",
      status: 201,
    };
  } catch (emailError) {
    console.error("Error in sending verification email", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
      errorCode: 500,
    };
  }
}
