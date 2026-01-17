import { resend } from "../config/resend.js";

export const sendVerificationEmail = async (email, verificationToken) => {
	const verifyUrl = `${process.env.CLIENT_URL}/auth/verify-email?token=${verificationToken}`;

	try {
		await resend.emails.send({
			from: "Acme <onboarding@resend.dev>",
			to: [email],
			subject: "Verify your email address",
			html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 8px;">
            
            <h2 style="margin-top: 0; color: #111827;">
              Verify your email address
            </h2>

            <p style="color: #374151; font-size: 16px;">
              Thanks for signing up. Please confirm your email address by clicking the button below.
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a
                href="${verifyUrl}"
                style="
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #2563eb;
                  color: #ffffff;
                  text-decoration: none;
                  font-weight: 600;
                  border-radius: 6px;
                "
              >
                Verify Email
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              This link will expire in 24 hours.
            </p>

            <p style="color: #6b7280; font-size: 14px;">
              If you did not create an account, you can safely ignore this email.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

            <p style="color: #9ca3af; font-size: 12px;">
              If the button doesn’t work, copy and paste this link into your browser:
            </p>

            <p style="color: #2563eb; font-size: 12px; word-break: break-all;">
              ${verifyUrl}
            </p>

          </div>
        </div>
      `,
		});
	} catch (error) {
		console.error(error);
		throw new Error("Error sending verification email");
	}
};
