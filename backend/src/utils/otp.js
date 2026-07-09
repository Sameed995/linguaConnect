import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.SMTP_EMAIL,
		pass: process.env.SMTP_PASSWORD,
	},
});

export function generateOtp() {
	return `${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function sendOtpEmail({ email, otp, fullName }) {
	const appName = process.env.APP_NAME || "LinguaConnect";
	const mailOptions = {
		from: process.env.SMTP_EMAIL,
		to: email,
		subject: `${appName} verification code`,
		text: `Hi ${fullName || "there"},\n\nYour ${appName} verification code is ${otp}. It expires in 10 minutes.\n\nIf you did not request this code, you can ignore this email.`,
		html: `
			<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
				<h2 style="margin: 0 0 12px;">${appName} verification code</h2>
				<p>Hi ${fullName || "there"},</p>
				<p>Your verification code is:</p>
				<div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; padding: 12px 16px; background: #f3f4f6; display: inline-block; border-radius: 10px;">${otp}</div>
				<p style="margin-top: 16px;">This code expires in 10 minutes.</p>
				<p>If you did not request this code, you can ignore this email.</p>
			</div>
		`,
	};

	return transporter.sendMail(mailOptions);
}

export default transporter;