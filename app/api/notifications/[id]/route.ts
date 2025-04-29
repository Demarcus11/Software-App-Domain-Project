import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming you're using Prisma ORM

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Extract the notification ID from URL parameter

    // Update the notification to mark it as read
    const updatedNotification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isRead: true },
    });

    if (!updatedNotification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    console.log("Hello");

    return NextResponse.json(
      { message: "Notification marked as read" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred, please try again later" },
      { status: 500 }
    );
  }
}
