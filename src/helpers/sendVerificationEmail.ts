import { verifySchema } from "./../schemas/verifySchema";
import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string | "",
  verifyCode: string,
  type?: "forget password" | "verification"
): Promise<ApiResponse> {
  //console.log(type);

  if (type === "verification") {
    //console.log("Under processing");

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Email Verification",
        react: VerificationEmail({ username, otp: verifyCode, type, email }),
      });

      return { success: true, message: "Verification email send sucessfully" };
    } catch (error) {
      console.error("Error sending verification email", error);
      return { success: false, message: "Failed to send verification email" };
    }
  } else if (type === "forget password") {
    //console.log("Under processing");
    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Change Your Password",
        react: VerificationEmail({ username, otp: verifyCode, type, email }),
      });

      return { success: true, message: "Verification email send sucessfully" };
    } catch (error) {
      console.error("Error sending verification email", error);
      return { success: false, message: "Failed to send verification email" };
    }
  } else {
    return {
      success: false,
      message: "Error sending email during sending email ",
    };
  }
}
