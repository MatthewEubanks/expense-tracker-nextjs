'use client'
import { Transaction } from "@prisma/client";
import { addCommas } from "@/lib/utils";
import { toast } from "react-toastify";

import React from "react";
import deleteTransaction from "@/actions/deleteTransaction";

export const TransactionItem = ({
  transaction,
}: {
  transaction: Transaction;
}) => {
  const sign = transaction.amount < 0 ? "-" : "+";
  const handleDeleteTransaction = async (transactionID: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete this transaction?`);
    if (!confirmed) {
        return;
    }
    const {message, error} = await deleteTransaction(transactionID);
    if (error) {
        toast.error(error);
    }

    toast.success(message);
  }
  return (
    <li className={transaction.amount < 0 ? "minus" : "plus"}>
      {transaction.text}
      <span>
        {sign}${addCommas(Math.abs(transaction.amount))}
      </span>
      <button
        onClick={() => handleDeleteTransaction(transaction.id)}
        className="delete-btn"
      >
        x
      </button>
    </li>
  );
};
