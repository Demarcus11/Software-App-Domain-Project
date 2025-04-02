"use client";

import { JournalDataTable } from "@/components/journal-data-table";
import { useColumns } from "@/components/journal-columns";
import { useEffect, useState } from "react";
import { ExtendedJournalEntry } from "@/types/journal";
import { Loader } from "lucide-react";

export default function JournalPage() {
  const [data, setData] = useState<ExtendedJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = useColumns();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/journal-entries");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <Loader className="animate-spin" />
        <span>Loading journal entries...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <JournalDataTable columns={columns} data={data} />
    </div>
  );
}
