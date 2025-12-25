import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    const DEMO_ADMIN_EMAIL = "admin@demo.com";

    const demoAdmin = await prisma.user.findUnique({
      where: { email: DEMO_ADMIN_EMAIL },
      select: { id: true },
    });

    if (!demoAdmin) return Response.json({ error: "Demo admin account not found" }, { status: 404 });

    const otp = await prisma.$transaction(async (tx) => {
      await tx.verification.deleteMany({
        where: {
          identifier: `sign-in-otp-${DEMO_ADMIN_EMAIL}`,
        },
      });

      await auth.api.sendVerificationOTP({
        body: {
          email: DEMO_ADMIN_EMAIL,
          type: "sign-in",
        },
      });

      const otp = await tx.verification.findFirst({
        where: {
          identifier: `sign-in-otp-${DEMO_ADMIN_EMAIL}`,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          value: true,
        },
      });

      return otp;
    });

    if (!otp?.value) return Response.json({ error: "Failed to retrieve OTP" }, { status: 500 });

    const data = await auth.api.signInEmailOTP({
      body: {
        email: DEMO_ADMIN_EMAIL,
        otp: otp.value.split(":")[0],
      },
      asResponse: true,
    });

    return data;
  } catch (error) {
    console.error("Demo login error:", error);
    return Response.json({ error: "Demo login failed" }, { status: 500 });
  }
}
