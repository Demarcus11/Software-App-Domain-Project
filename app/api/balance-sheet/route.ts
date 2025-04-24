import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const isValidDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return !isNaN(d.getTime());
  };

  try {
    const { startDate, endDate } = await req.json();

    const dateFilter =
      isValidDate(startDate) && isValidDate(endDate)
        ? {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {}; // don't apply filter if dates are invalid

    // First get all the categories we need
    const categories = await prisma.category.findMany({
      where: {
        name: {
          in: [
            "Current Asset",
            "Non-Current Asset",
            "Current Liability",
            "Non-Current Liability",
            "Owner's Equity",
          ],
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Then get all subcategories for these categories
    const subcategories = await prisma.subcategory.findMany({
      where: {
        categoryId: {
          in: categories.map((c) => c.id),
        },
      },
      select: {
        id: true,
        name: true,
        categoryId: true,
      },
    });

    // Now get all accounts with their transactions
    const accounts = await prisma.account.findMany({
      where: {
        subcategoryId: {
          in: subcategories.map((s) => s.id),
        },
      },
      include: {
        transactions: {
          where: dateFilter,
          select: {
            type: true,
            amount: true,
          },
        },
        order: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
            categoryId: true, // Include categoryId instead of category
          },
        },
      },
      orderBy: {
        orderId: "asc",
      },
    });

    // Organize data into the required structure
    const balanceSheet = {
      assets: {
        currentAssets: {
          accounts: [] as any[],
          total: 0,
        },
        nonCurrentAssets: {
          accounts: [] as any[],
          total: 0,
        },
        total: 0,
      },
      liabilities: {
        currentLiabilities: {
          accounts: [] as any[],
          total: 0,
        },
        nonCurrentLiabilities: {
          accounts: [] as any[],
          total: 0,
        },
        total: 0,
      },
      equity: {
        accounts: [] as any[],
        total: 0,
      },
      grandTotal: 0,
    };

    // Process each account and populate the balance sheet structure
    for (const account of accounts) {
      // Calculate account balance from transactions
      const balance = account.transactions.reduce((sum, tx) => {
        const categoryName =
          categories.find((c) => c.id === account.subcategory.categoryId)
            ?.name || "Unknown";
        const isAsset = categoryName.includes("Asset");
        const isLiability = categoryName.includes("Liability");

        const isIncrease =
          (isAsset && tx.type === "DEBIT") ||
          ((isLiability || categoryName === "Owner's Equity") &&
            tx.type === "CREDIT");

        const isDecrease =
          (isAsset && tx.type === "CREDIT") ||
          ((isLiability || categoryName === "Owner's Equity") &&
            tx.type === "DEBIT");

        if (isIncrease) return sum + tx.amount;
        if (isDecrease) return sum - tx.amount;
        return sum;
      }, 0);

      const accountData = {
        id: account.id,
        name: account.name,
        number: account.number,
        balance: Math.abs(balance),
        normalSide: account.normalSide,
        order: account.order.name,
        subcategory: account.subcategory.name,
      };

      const categoryName =
        categories.find((c) => c.id === account.subcategory.categoryId)?.name ||
        "Unknown";

      // Categorize the account
      if (categoryName === "Current Asset") {
        balanceSheet.assets.currentAssets.accounts.push(accountData);
        balanceSheet.assets.currentAssets.total += balance;
      } else if (categoryName === "Non-Current Asset") {
        balanceSheet.assets.nonCurrentAssets.accounts.push(accountData);
        balanceSheet.assets.nonCurrentAssets.total += balance;
      } else if (categoryName === "Current Liability") {
        balanceSheet.liabilities.currentLiabilities.accounts.push(accountData);
        balanceSheet.liabilities.currentLiabilities.total += balance;
      } else if (categoryName === "Non-Current Liability") {
        balanceSheet.liabilities.nonCurrentLiabilities.accounts.push(
          accountData
        );
        balanceSheet.liabilities.nonCurrentLiabilities.total += balance;
      } else if (categoryName === "Owner's Equity") {
        balanceSheet.equity.accounts.push(accountData);
        balanceSheet.equity.total += balance;
      }
    }

    // Calculate totals
    balanceSheet.assets.total =
      balanceSheet.assets.currentAssets.total +
      balanceSheet.assets.nonCurrentAssets.total;

    balanceSheet.liabilities.total =
      balanceSheet.liabilities.currentLiabilities.total +
      balanceSheet.liabilities.nonCurrentLiabilities.total;

    balanceSheet.grandTotal =
      balanceSheet.assets.total -
      (balanceSheet.liabilities.total + balanceSheet.equity.total);

    // Check if all balances are zero
    const allEmpty = [
      balanceSheet.assets.total,
      balanceSheet.liabilities.total,
      balanceSheet.equity.total,
    ].every((total) => total === 0);

    if (allEmpty) {
      return NextResponse.json({ message: "No results" }, { status: 404 });
    }

    return NextResponse.json(balanceSheet, { status: 200 });
  } catch (error) {
    console.error("Error generating balance sheet:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
