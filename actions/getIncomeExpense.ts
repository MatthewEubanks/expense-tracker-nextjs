"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

async function getIncomeExpense(): Promise<{
  income?: number;
  expense?: number;
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

    const amounts = await transactions.map((transaction) => transaction.amount);
    const income = amounts
                    .filter((amount) => amount > 0)
                    .reduce((acc, curr) => acc + curr, 0);
    const expense = amounts
                    .filter((amount) => amount < 0)
                    .reduce((acc, curr) => acc + curr, 0);
    
    return { income, expense: Math.abs(expense) };
  } catch (error) {
    return { error: "Database Error" };
  }
}
export default getIncomeExpense;
