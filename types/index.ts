import { User } from "@prisma/client";

export type Employee = User & {
  hiredBy?: {
    email: string;
  } | null;
  securityQuestions: string[];
};

export type ExpiredPasswords = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
  passwordExpiresAt: string;
};

export interface SecurityQuestion {
  securityQuestion?: {
    id: number;
    question: string;
  };
  id: number;
  question: string;
}

export interface Roles {
  id: number;
  role: string;
}

export interface ExtendedTransaction {
  id: string;
  date: Date;
  debit: number;
  credit: number;
  balance: number;
  JournalEntry: {
    id: string;
    pr: string;
    description: string;
  };
}
