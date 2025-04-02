import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const eventLogs = await prisma.eventLog.findMany({
      include: { user: true }, // Include user details
      orderBy: { createdAt: "desc" }, // Sort by most recent
    });

    if (!eventLogs) {
      return NextResponse.json({ error: "No events found" }, { status: 404 });
    }

    return NextResponse.json(eventLogs);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
