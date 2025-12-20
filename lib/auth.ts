import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import { admin } from "better-auth/plugins";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: env.BREVO_SMTP_USER,
    pass: env.BREVO_SMTP_PASSWORD,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await transporter.sendMail({
          from: `HelmyLMS <yousofkamal24@gmail.com>`,
          to: email,
          subject: "HelmyLMS Verify Your Email",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 12px; background: #f9f9f9;">
              <h2 style="color: #4F46E5; text-align: center;">HelmyLMS</h2>
              <p style="font-size: 16px;">Welcome!</p>
              <p style="font-size: 16px;">Your verification code is:</p>
              <h1 style="font-size: 40px; letter-spacing: 8px; text-align: center; color: #4F46E5; background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">${otp}</h1>
              <p style="font-size: 14px; color: #666;">This code is valid for <strong>10 minutes</strong> only.</p>
              <p style="font-size: 14px; color: #666;">If you didn't request this code, please ignore this email.</p>
            </div>
          `,
        });
      },
    }),

    admin(),
  ],
});
