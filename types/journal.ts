// types/journal.ts
import { JournalEntry, Transaction, User } from "@prisma/client";

export interface ExtendedJournalEntry extends JournalEntry {
  transactions: (Transaction & {
    account: {
      name: string;
      number: string;
    };
  })[];
  user: Pick<User, "id">; // Changed from 'name' to 'username'
}
