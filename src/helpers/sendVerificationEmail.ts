import { resend } from "@/lib/resend";
import VerificationEmail from "@/components/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@fundrr",
      to: email,
      subject: "fundrr | verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error in sending verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
