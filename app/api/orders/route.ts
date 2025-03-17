import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany();

    if (!orders) {
      return NextResponse.json({ error: "No orders found" }, { status: 404 });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
