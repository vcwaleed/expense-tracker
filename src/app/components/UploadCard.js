'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { db } from "../firebase/config";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function Uploadcard() {
    const { user } = useAuth();
    const [showCashModal, setShowCashModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [availableBalance, setAvailableBalance] = useState(0);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user) return;
            try {
                const querySnapshot = await getDocs(collection(db, "users", user.uid, "transactions"));
                let balance = 0;
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.type === "cash") {
                        balance += Number(data.amount);
                    } else if (data.type === "expense") {
                        balance -= Number(data.amount);
                    }
                });
                setAvailableBalance(balance);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };
        fetchTransactions();
    }, [user]);
    const handleCashSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert("You must be logged in to add cash.");
        try {
            await addDoc(collection(db, "users", user.uid, "transactions"), {
                type: "cash",
                amount: Number(amount),
                date: serverTimestamp(),
            });
            setAvailableBalance(prev => prev + Number(amount));
            console.log("Cash added:", amount);
        } catch (error) {
            console.error("Error adding cash:", error);
        }
        setShowCashModal(false);
        setAmount("");
    };
    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert("You must be logged in to add an expense.");
        const expenseValue = Number(expenseAmount);
        if (availableBalance === 0) {
            return alert("Your balance is zero. Please add cash first.");
        }
        if (expenseValue > availableBalance) {
            return alert("Insufficient balance. Please add more cash.");
        }
        try {
            await addDoc(collection(db, "users", user.uid, "transactions"), {
                type: "expense",
                title: title,
                amount: expenseValue,
                date: serverTimestamp(),
            });
            setAvailableBalance(prev => prev - expenseValue);  // Update balance locally
            console.log("Expense added:", { title, amount: expenseValue });
        } catch (error) {
            console.error("Error adding expense:", error);
        }
        setShowExpenseModal(false);
        setTitle("");
        setExpenseAmount("");
    };
    return (
        <main>
            <section className="block max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow-sm  hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-700">
                <div className='flex flex-row space-x-4 py-1 '>
                    <div
                        className="bg-white border border-gray-300 h-24 w-24 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex items-center justify-center cursor-pointer"
                        onClick={() => setShowCashModal(true)}
                    >
                        <div className='grid grid-flow-row place-items-center hover:text-green-700'>
                            <Image
                                src="/money.svg"
                                alt="Money Icon"
                                width={35}
                                height={35}
                            />
                            <span className="text-xs p-2">ADD CASH</span>
                        </div>
                    </div>
                    <div
                        className="bg-white border border-gray-300 h-24 w-24 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex items-center justify-center  cursor-pointer"
                        onClick={() => setShowExpenseModal(true)}
                    >
                        <div className='grid grid-flow-row place-items-center hover:text-green-700'>
                            <Image
                                src="/budget.svg"
                                alt="Money Icon"
                                width={35}
                                height={35}
                            />
                            <span className="text-xs">ADD</span>
                            <span className="text-xs ">EXPENSE</span>
                        </div>
                    </div>
                </div>
                {showCashModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-80">
                            <h2 className="text-xl font-bold mb-4">Add Cash</h2>
                            <form onSubmit={handleCashSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                                        onClick={() => setShowCashModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Add Cash
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showExpenseModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-80">
                            <h2 className="text-xl font-bold mb-4">Add Expense</h2>
                            <form onSubmit={handleExpenseSubmit}>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Title
                                    </label>
                                    <select
                                        className="w-full p-2 border rounded"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    >
                                        <option value="">Select a category</option>
                                        <option value="Food">Food</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Shopping">Shopping</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded"
                                        value={expenseAmount}
                                        onChange={(e) => setExpenseAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                                        onClick={() => setShowExpenseModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Add Expense
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                <div className="max-w-lg flex items-center my-3">
                    <div className='flex pl-4 py-2 space-x-6'>
                        <div className=' lg:py-7'>
                            <span className='font-semibold '>Welcome To Expenses Tracker </span>
                            <span><br />We Help You To Track your Expenses</span>
                        </div>
                        <div>
                            <Image
                                src="/images/welcome.png"
                                alt="Welcome Icon"
                                width={95}
                                height={35}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>)
        }
        