"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function deleteTransaction(transactionID: string): Promise<{
  message?: string;
  error?: string;
}> {
  const { userId } = auth();
  if (!userId) {
    return { error: "User Not Found" };
  }

  try {
    await db.transaction.delete({
      where: { id: transactionID },
    });
    revalidatePath("/");
    return { message: 'Transaction deleted' };
  } catch (error) {
    return { error: "Database Error" };
  }
}
export default deleteTransaction;
