'use client'
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function ExpenseTable() {
    const [expenses, setExpenses] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;
        const expensesRef = collection(db, "users", user.uid, "transactions");
        const q = query(expensesRef, where("type", "==", "expense"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const expenseData = querySnapshot.docs
                .map(doc => {
                    const data = doc.data();
                    const date = data.date?.toDate();
                    return {
                        id: doc.id,
                        ...data,
                        date: date,
                    };
                })
                .sort((a, b) => {
                    if (!a.date && !b.date) return 0;
                    if (!a.date) return 1;
                    if (!b.date) return -1;
                    return b.date.getTime() - a.date.getTime();
                })
                .map(item => ({
                    ...item,
                    date: item.date ? item.date.toLocaleDateString() : "N/A"
                }));
            setExpenses(expenseData);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <main>
            <div className="shadow-md sm:rounded-lg">
                <span className="font-semibold font-mono text-2xl p-3">Expenses Table</span>
                
                <div className="overflow-y-auto max-h-[450px]  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="sticky top-0 z-10 bg-gray-300">
                            <tr className="text-xs text-gray-700 uppercase">
                                <th scope="col" className="px-3 py-3">Date</th>
                                <th scope="col" className="px-3 py-3">Title</th>
                                <th scope="col" className="px-3 py-3">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {expenses.length > 0 ? (
                                expenses.map((expense) => (
                                    <tr key={expense.id} className="odd:bg-white even:bg-gray-50 border-b">
                                        <td className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap">{expense.date || "N/A"}</td>
                                        <td className="px-3 py-4">{expense.title || "N/A"}</td>
                                        <td className="px-3 py-4">
                                            <span className="inline-block min-w-[70px] text-center p-2 rounded-lg bg-expensecolor text-red-700">
                                                ${expense.amount || "0"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center">No expenses found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
