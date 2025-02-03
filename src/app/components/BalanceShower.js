// BalanceDetails.js
'use client'
import { useEffect, useState } from 'react';
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
export default function BalanceDetails() {
  const { user } = useAuth();
  const [availableBalance, setAvailableBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  useEffect(() => {
    if (!user) return;
    const transactionsUnsubscribe = onSnapshot(
      collection(db, "users", user.uid, "transactions"),
      (querySnapshot) => {
        let balance = 0;
        let expenses = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.type === "cash") {
            balance += Number(data.amount);
          } else {
            balance -= Number(data.amount);
            expenses += Number(data.amount);
          }
        });
        setAvailableBalance(balance);
        setTotalExpenses(expenses);
      }
    );
    return () => {
      transactionsUnsubscribe();
    };
  }, [user]);
  return (
    <main>
      <section className="block max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-100">
        <section className="flex flex-col">
          <span className="font-mono text-2xl font-semibold">Balance Details</span>
          <span className="mt-10 font-mono">Available Balance: ${availableBalance}</span>
          <span className="mt-10 font-mono">Total Expenses: ${totalExpenses}</span>
          <span className="mt-14 font-mono text-blue-700 text-center">
            <Link href='/'>Click For More Details</Link>
          </span>
        </section>
      </section>
    </main>
  );
}