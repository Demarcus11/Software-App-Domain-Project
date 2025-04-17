"use client";

import { JournalDataTable } from "@/components/journal-data-table";
import { useColumns } from "@/components/journal-columns";
import { useEffect, useState } from "react";
import { ExtendedJournalEntry } from "@/types/journal";
import { Loader } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function JournalPage() {
  const [journalEntries, setJournalEntries] = useState<ExtendedJournalEntry[]>(
    []
  );
  const [adjustingEntries, setAdjustingEntries] = useState<
    ExtendedJournalEntry[]
  >([]);
  const [loading, setLoading] = useState(true);
  const columns = useColumns();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/journal-entries");
        const result = await response.json();

        const adjustingEntries = result.filter(
          (entry: ExtendedJournalEntry) => entry.isAdjusting
        );

        setJournalEntries(result);
        setAdjustingEntries(adjustingEntries);
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
      <Tabs defaultValue="journal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="adjusting">Adjusting Entries</TabsTrigger>
        </TabsList>

        <TabsContent value="journal">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">General Journal Entries</h2>
            <JournalDataTable columns={columns} data={journalEntries} />
          </div>
        </TabsContent>

        <TabsContent value="adjusting">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Adjusting Journal Entries</h2>
            <JournalDataTable columns={columns} data={adjustingEntries} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
