import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

// Fetch notifications for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("jwt")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized, no token" },
        { status: 401 }
      );
    }

    const jwt_secret = process.env.JWT_SECRET;
    if (!jwt_secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(jwt_secret)
    );

    const userId = (payload as { userId: string }).userId;

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    // Fetch notifications for the user
    const notifications = await prisma.notification.findMany({
      where: { userId: user?.id },
      orderBy: { createdAt: "desc" },
    });

    // Count unread notifications
    const unreadCount = await prisma.notification.count({
      where: { userId: user?.id, isRead: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An unexpected error occurred, please try again later" },
      { status: 500 }
    );
  }
}

// Mark a notification as read
export async function PATCH(request: Request, { params }: any) {
  try {
    // Mark the notification as read
    await prisma.notification.update({
      where: { id: parseInt(params.id) },
      data: { isRead: true },
    });

    return NextResponse.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An unexpected error occurred, please try again later" },
      { status: 500 }
    );
  }
}
