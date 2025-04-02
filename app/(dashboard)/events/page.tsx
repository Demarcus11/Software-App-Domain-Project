"use client";

import { EventLogTable } from "@/components/event-data-table";
import { columns } from "@/components/event-columns";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { EventLog } from "@prisma/client";

export default function EventLogPage() {
  const [events, setEvents] = useState<EventLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions for the account
        const eventResponse = await fetch(`/api/event-logs`);
        if (!eventResponse.ok) {
          throw new Error("Failed to fetch event");
        }
        const eventData = await eventResponse.json();
        setEvents(eventData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <Loader className="animate-spin" />
        <span>Loading events...</span>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Event Logs</h1>
      <EventLogTable data={events} columns={columns} />
    </div>
  );
}
