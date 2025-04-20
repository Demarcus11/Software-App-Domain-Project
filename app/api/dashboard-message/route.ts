import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { user } = await req.json();

    const [
      pendingJournalEntries,
      pendingAccessRequests,
      unreadNotifications,
      expiredPasswords,
    ] = await Promise.all([
      prisma.journalEntry.count({
        where: {
          status: "PENDING",
        },
      }),
      prisma.accessRequest.count({
        where: {
          status: "PENDING",
        },
      }),
      prisma.notification.count({
        where: {
          userId: user.id,
          isRead: false,
        },
      }),
      prisma.user.count({
        where: {
          passwordExpiresAt: {
            lte: new Date(),
          },
          isActive: true,
        },
      }),
    ]);

    const messages: string[] = [];

    if (user.role === "MANAGER" && pendingJournalEntries > 0) {
      messages.push(
        `You have ${pendingJournalEntries} pending journal entries awaiting approval.`
      );
    }

    if (user.role === "ADMIN" && pendingAccessRequests > 0) {
      messages.push(
        `There are ${pendingAccessRequests} pending access requests.`
      );
    }

    if (unreadNotifications > 0) {
      messages.push(
        `You have ${unreadNotifications} unread notification${
          unreadNotifications > 1 ? "s" : ""
        }.`
      );
    }

    if (user.role === "ADMIN" && expiredPasswords > 0) {
      messages.push(
        `There are ${expiredPasswords} users with expired passwords.`
      );
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Dashboard message error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard messages" },
      { status: 200 }
    );
  }
}
