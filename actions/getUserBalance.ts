"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

async function getUserBalance(): Promise<{
  balance?: number;
  error?: string;
}> {
  const { userId } = auth();
  if (!userId) {
    return { error: "User Not Founc" };
  }

  try {
    const transactions = await db.transaction.findMany({
      where: { userId },
    });

    const balance = transactions.reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0);
    return { balance };
  } catch (error) {
    return { error: "Database Error" };
  }
}
export default getUserBalance;
