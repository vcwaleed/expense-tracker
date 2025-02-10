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
    <main className="flex justify-center items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-900">
    <section className="w-full max-w-md p-5 dark:bg-gray-800  dark:border-gray-700">
      <section className="flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white ">
          Balance Details
        </h2>
        <p className="mt-6 text-gray-700 dark:text-gray-300 text-sm">
          Available Balance: <span className="font-bold text-green-600 dark:text-green-400">${availableBalance}</span>
        </p>
        <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm">
          Total Expenses: <span className="font-bold text-red-600 dark:text-red-400">${totalExpenses}</span>
        </p>
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            Click For More Details
          </Link>
        </div>
      </section>
    </section>
  </main>
  );
}
