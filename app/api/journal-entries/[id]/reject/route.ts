import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: Request, { params }: any) {
  try {
    const journalEntryId = parseInt(params.id);
    const { comment, userId } = await request.json();

    if (isNaN(journalEntryId)) {
      return NextResponse.json(
        { error: "Invalid journal entry ID" },
        { status: 400 }
      );
    }

    if (!comment || typeof comment !== "string" || !comment.trim()) {
      return NextResponse.json(
        { error: "Rejection comment is required" },
        { status: 400 }
      );
    }

    // Update the journal entry status and add the comment
    const updatedEntry = await prisma.journalEntry.update({
      where: { id: journalEntryId },
      data: {
        status: "REJECTED",
        comment: comment.trim(),
      },
    });

    // Create an event log for the rejection
    await prisma.eventLog.create({
      data: {
        eventType: "UPDATE",
        tableName: "JournalEntry",
        recordId: journalEntryId,
        beforeState: { status: "PENDING" },
        afterState: { status: "REJECTED", comment: comment.trim() },
        userId,
      },
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    return NextResponse.json(
      { message: "Error rejecting journal entry" },
      { status: 500 }
    );
  }
}
