"use client";

import { ColumnDef } from "@tanstack/react-table";
import { JournalEntry, EntryStatus } from "@prisma/client";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Checkbox } from "./ui/checkbox";
import { ExtendedJournalEntry } from "@/types/journal";

export const useColumns = () => {
  const [role, setRole] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/user", { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch user role");
        const user = await response.json();
        setRole(user.role);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/user", { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch user id");
        const user = await response.json();
        setUserId(user.id);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserId();
  }, []);

  const columns: ColumnDef<ExtendedJournalEntry>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          onClick={(e) => e.stopPropagation()}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "pr",
      header: "PR #",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => {
        const status = row.getValue("status") as EntryStatus;
        const comment = row.getValue("comment") as string | null;

        if (status !== "REJECTED" || !comment) {
          return null; // Don't show anything if not rejected or no comment
        }

        return (
          <div className="max-w-[200px] truncate" title={comment}>
            {comment}
          </div>
        );
      },
    },
    {
      accessorKey: "transactions",
      header: "Transactions",
      cell: ({ row }) => {
        const transactions = row.getValue(
          "transactions"
        ) as ExtendedJournalEntry["transactions"];
        return (
          <div className="space-y-1">
            {transactions.map((t, i) => (
              <div key={i} className="text-sm">
                {`Account #: ${t.account.number}`} - {t.account.name}: {t.type}{" "}
                {t.amount.toFixed(2)}
              </div>
            ))}
          </div>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const transactions = row.getValue(
          columnId
        ) as ExtendedJournalEntry["transactions"];

        // Amount filter
        if (filterValue?.amount !== undefined) {
          return transactions.some(
            (t) => Math.abs(t.amount - filterValue.amount) < 0.01
          );
        }

        // Account name filter
        if (filterValue?.accountName) {
          return transactions.some((t) =>
            t.account.name
              .toLowerCase()
              .includes(filterValue.accountName.toLowerCase())
          );
        }

        return true;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as EntryStatus;
        const statusColors = {
          PENDING: "bg-yellow-100 text-yellow-800",
          APPROVED: "bg-green-100 text-green-800",
          REJECTED: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}
          >
            {status}
          </span>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("date") as Date;
        return format(new Date(date), "MMM dd, yyyy");
      },
      filterFn: (row, id, value) => {
        const date = new Date(row.getValue(id));
        const from = value?.from ? new Date(value.from) : null;
        const to = value?.to ? new Date(value.to) : null;

        if (from && date < from) return false;
        if (to && date > to) return false;
        return true;
      },
    },
    {
      accessorKey: "user.id",
      header: "User Id",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const journal = row.original;
        const [rejectComment, setRejectComment] = useState("");
        const [isRejecting, setIsRejecting] = useState(false);
        const [isApproving, setIsApproving] = useState(false);

        const handleReject = async () => {
          setIsRejecting(true);
          try {
            if (!rejectComment.trim()) {
              toast.error("Please provide a rejection reason");
              return;
            }

            const response = await fetch(
              `/api/journal-entries/${journal.id}/reject`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  comment: rejectComment,
                  userId,
                }),
              }
            );

            if (!response.ok) throw new Error("Failed to reject journal entry");

            toast.success("Journal entry rejected");
            router.refresh();
          } catch (error) {
            console.error("Rejection error:", error);
            toast.error("Failed to reject journal entry");
          } finally {
            setIsRejecting(false);
          }
        };

        const handleApprove = async () => {
          setIsApproving(true);
          try {
            const response = await fetch(
              `/api/journal-entries/${journal.id}/approve`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok)
              throw new Error("Failed to approve journal entry");

            toast.success("Journal entry approved");
            router.refresh();
          } catch (error) {
            console.error("Approval error:", error);
            toast.error("Failed to approve journal entry");
          } finally {
            setIsApproving(false);
          }
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(journal.pr)}
              >
                Copy PR #
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/journal/${journal.id}`)}
              >
                View details
              </DropdownMenuItem>
              {role === "MANAGER" && journal.status === "PENDING" && (
                <>
                  <DropdownMenuItem
                    onClick={handleApprove}
                    disabled={isApproving}
                  >
                    Approve
                  </DropdownMenuItem>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Reject
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Reject Journal Entry
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Please provide a reason for rejecting this journal
                          entry.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="comment" className="text-right">
                            Reason
                          </Label>
                          <Textarea
                            id="comment"
                            value={rejectComment}
                            onChange={(e) => setRejectComment(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter rejection reason..."
                            required
                          />
                        </div>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleReject}
                          disabled={isRejecting || !rejectComment.trim()}
                        >
                          {isRejecting ? "Rejecting..." : "Confirm Rejection"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
