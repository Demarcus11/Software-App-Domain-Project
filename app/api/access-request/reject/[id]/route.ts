import { getUserById } from "@/lib/db";
import prisma from "@/lib/prisma";
import sendEmail from "@/lib/send-email";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  try {
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const pendingAccessRequest = await prisma.accessRequest.findFirst({
      where: {
        userId: user.id,
        status: "PENDING",
      },
    });

    if (!pendingAccessRequest) {
      return NextResponse.json(
        { message: "No pending access request found" },
        { status: 400 }
      );
    }

    await prisma.accessRequest.update({
      where: {
        id: pendingAccessRequest.id,
      },
      data: {
        status: "REJECTED",
      },
    });

    await sendEmail({
      to: user.email,
      subject: "Account Rejected",
      text: `Your account has been rejected`,
    });

    return NextResponse.json({
      message: `User rejected, email sent to ${user.email} with their username and password`,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred, please try again later" },
      { status: 500 }
    );
  }
}
