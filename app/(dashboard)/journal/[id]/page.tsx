import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { BackButton } from "@/components/back-button";

interface JournalEntryDetailPageProps {
  params: { id: string };
}

export default async function JournalEntryDetailPage({
  params,
}: JournalEntryDetailPageProps) {
  const journalEntryId = parseInt(params.id);

  if (isNaN(journalEntryId)) {
    return notFound();
  }

  const journalEntry = await prisma.journalEntry.findUnique({
    where: { id: journalEntryId },
    include: {
      transactions: {
        include: {
          account: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!journalEntry) {
    return notFound();
  }

  // Calculate totals
  const totalDebits = journalEntry.transactions
    .filter((t) => t.type === "DEBIT")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCredits = journalEntry.transactions
    .filter((t) => t.type === "CREDIT")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <>
      <BackButton>Back</BackButton>

      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-5">Journal Entry Details</h1>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>PR#: {journalEntry.pr}</CardTitle>
              <Badge variant="default">{journalEntry.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{journalEntry.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p>{format(journalEntry.date, "MMM dd, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <p>
                  {journalEntry.user.firstName} {journalEntry.user.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p>{format(journalEntry.createdAt, "MMM dd, yyyy HH:mm")}</p>
              </div>
            </div>

            {journalEntry.status === "REJECTED" && journalEntry.comment && (
              <div className="mb-4 p-4 bg-red-50 rounded-md">
                <p className="text-sm font-medium text-red-800">
                  Rejection Reason
                </p>
                <p className="text-red-700">{journalEntry.comment}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {journalEntry.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-5 gap-4"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">Account</p>
                    <p>
                      {transaction.account.number} - {transaction.account.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <Badge
                      variant={
                        transaction.type === "DEBIT" ? "default" : "outline"
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p>${transaction.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p>{transaction.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entered By</p>
                    <p>
                      {transaction.user.firstName} {transaction.user.lastName}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex justify-between mt-6 pt-4 border-t">
                <div className="text-lg font-medium">
                  Total Debits: ${totalDebits.toFixed(2)}
                </div>
                <div className="text-lg font-medium">
                  Total Credits: ${totalCredits.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
