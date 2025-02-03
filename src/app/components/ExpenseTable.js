'use client'
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
export default function ExpenseTable() {
    const [expenses, setExpenses] = useState([]);
    const { user } = useAuth();
    useEffect(() => {
        if (!user) return;
        const fetchExpenses = async () => {
            try {
                const expensesRef = collection(db, "users", user.uid, "transactions");
                const q = query(expensesRef, where("type", "==", "expense"));
                const querySnapshot = await getDocs(q);
                const expenseData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date?.toDate().toLocaleDateString() || "N/A"
                }));

                setExpenses(expenseData);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        };
        fetchExpenses();
    }, [user]);
    return (
        <main>
            <div className="shadow-md sm:rounded-lg max-h-[410px] overflow-y-auto">
                <span className="font-semibold font-mono text-2xl p-3">Expenses Table</span>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className="bg-[#d3d3d3]">
                            <th scope="col" className="px-3 py-3">Date</th>
                            <th scope="col" className="px-3 py-3">Title</th>
                            <th scope="col" className="px-3 py-3">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length > 0 ? (
                            expenses.map((expense) => (
                                <tr key={expense.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                    <td className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {expense.date || "N/A"}
                                    </td>
                                    <td className="px-3 py-4">{expense.title || "N/A"}</td>
                                    <td className="px-3 py-4 "> <span className="bg-expensecolor px-4 py-2 rounded-lg   text-red-700 ">${expense.amount || "0"}</span></td>
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
        </main>
    );
}
