import { prisma } from "@/lib/prisma";
import { EventLogTable } from "@/components/event-data-table";
import { columns } from "@/components/event-columns";

export default async function EventLogPage() {
  const eventLogs = await prisma.eventLog.findMany({
    include: { user: true }, // Include user details
    orderBy: { createdAt: "desc" }, // Sort by most recent
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Event Logs</h1>
      <EventLogTable data={eventLogs} columns={columns} />
    </div>
  );
}
