import { ColumnDef } from "@tanstack/react-table";
import { Account } from "@prisma/client";
import { ArrowUpDown, MoreHorizontal, CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExtendedAccount } from "@/app/(dashboard)/chart-of-accounts/page";
import { Checkbox } from "./ui/checkbox";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const DateFilter: React.FC<{ column: any }> = ({ column }) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    if (date?.from && date?.to) {
      column.setFilterValue({
        from: date.from,
        to: date.to,
      });
    } else {
      column.setFilterValue(undefined);
    }
  }, [date, column]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="w-[240px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "MMM dd, yyyy")} -{" "}
                {format(date.to, "MMM dd, yyyy")}
              </>
            ) : (
              format(date.from, "MMM dd, yyyy")
            )
          ) : (
            <span>Filter by date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export const useColumns = () => {
  const [role, setRole] = useState<string | undefined>(undefined);
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

  const columns: ColumnDef<ExtendedAccount>[] = [
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
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          onClick={(e) => e.stopPropagation()}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0"
          >
            Account #
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "categoryName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0"
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "normalSide",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0"
          >
            Normal Side
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "statementName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0"
          >
            Statement
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "balance",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0"
          >
            Balance
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const balance: number = row.getValue("balance");
        return Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(balance);
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <div className="flex flex-col space-y-2">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="pl-0"
            >
              Created At
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            <DateFilter column={column} />
          </div>
        );
      },
      cell: ({ row }) => {
        const createdAt: Date = row.getValue("createdAt");
        return format(new Date(createdAt), "MMM dd, yyyy");
      },
      filterFn: (row, columnId, filterValue) => {
        const date = new Date(row.getValue(columnId));
        const { from, to } = filterValue || {};

        if (!from && !to) return true;

        if (from && !to) {
          return date >= from;
        }

        if (!from && to) {
          return date <= addDays(to, 1);
        }

        if (from && to) {
          return date >= from && date <= addDays(to, 1);
        }

        return true;
      },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0"
          >
            Is Active?
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.getValue("isActive") ? "Yes" : "No";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const account = row.original;

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
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/chart-of-accounts/${account.id}`);
                }}
              >
                View account
              </DropdownMenuItem>
              {role === "ADMIN" && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/chart-of-accounts/${account.id}/edit`);
                  }}
                >
                  Edit account
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/ledger/${account.id}`);
                }}
              >
                View ledger
              </DropdownMenuItem>
              {role === "ADMIN" && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    if (account.isActive) {
                      toast.promise(
                        fetch(`/api/accounts/${account?.id}/edit`, {
                          method: "POST",
                          credentials: "include",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            ...account,
                            isActive: false,
                          }),
                        }).then(async (response) => {
                          if (!response.ok) {
                            const error = await response.json();
                            throw new Error(error.message);
                          }
                          return response.json();
                        }),
                        {
                          loading: "Deactivating account...",
                          success: (result) =>
                            result?.message || "Account deactivated",
                          error: (err) =>
                            err.message || "An unexpected error occurred.",
                          duration: 10000,
                        }
                      );
                    } else {
                      toast.promise(
                        fetch(`/api/accounts/${account?.id}/edit`, {
                          method: "POST",
                          credentials: "include",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            ...account,
                            isActive: true,
                          }),
                        }).then(async (response) => {
                          if (!response.ok) {
                            const error = await response.json();
                            throw new Error(error.message);
                          }
                          return response.json();
                        }),
                        {
                          loading: "Activating account...",
                          success: (result) =>
                            result?.message || "Account activated",
                          error: (err) =>
                            err.message || "An unexpected error occurred.",
                          duration: 10000,
                        }
                      );
                    }
                  }}
                >
                  {account.isActive ? "Deactivate" : "Activate"} Account
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
