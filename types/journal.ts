import { EntryStatus, JournalEntry, Transaction, User } from "@prisma/client";

export interface ExtendedJournalEntry {
  id: string;
  pr: string;
  description: string;
  comment: string | null;
  status: EntryStatus;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  isAdjusting: boolean;
  user: {
    id: number;
    username: string;
  };
  document: string;
  transactions: {
    id: string;
    amount: number;
    type: "DEBIT" | "CREDIT";
    description: string | null;
    date: Date;
    journalEntryId: string;
    userId: number;
    accountId: number;
    isApproved: boolean;
    balance: number;
    account: {
      id: number;
      name: string;
      number: string;
    };
  }[];
}
