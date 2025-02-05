"use client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);
export default function PaymentCard() {
    const { user } = useAuth();
    const [availableBalance, setAvailableBalance] = useState(0);
    const [cashData, setCashData] = useState(Array(30).fill(0));
    const [labels, setLabels] = useState([]);
    useEffect(() => {
        if (!user) return;
        const transactionsRef = collection(db, "users", user.uid, "transactions");
        const unsubscribeBalance = onSnapshot(transactionsRef, (querySnapshot) => {
            let balance = 0;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                balance += data.type === "cash" ? Number(data.amount) : -Number(data.amount);
            });
            setAvailableBalance(balance);
        });
        return () => unsubscribeBalance();
    }, [user]);
    useEffect(() => {
        if (!user) return;
        const transactionsRef = collection(db, "users", user.uid, "transactions");
        const cashQuery = query(transactionsRef, where("type", "==", "cash"));

        const unsubscribeCash = onSnapshot(cashQuery, (querySnapshot) => {
            const transactions = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.date) {
                    transactions.push({
                        amount: Number(data.amount),
                        date: data.date.toDate()
                    });
                }
            });
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();
            const totalDays = new Date(year, month + 1, 0).getDate();
            const dailyData = Array(totalDays).fill(0);
            const dateLabels = Array.from({ length: totalDays }, (_, i) => `Day ${i + 1}`);
            transactions.forEach(({ date, amount }) => {
                if (date.getMonth() === month && date.getFullYear() === year) {
                    const dayIndex = date.getDate() - 1;
                    dailyData[dayIndex] += amount;
                }
            });
            setLabels(dateLabels);
            setCashData(dailyData);
        });
        return () => unsubscribeCash();
    }, [user]);
    const data = {
        labels: labels,
        datasets: [
            {
                label: "Payments ($)",
                data: cashData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                tension: 0.4,
                pointRadius: 3
            }
        ]
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true }
        }
    };
    return (
        <div>
            <section className="block max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 className="mb-2 text-2xl font-semibold font-mono  tracking-tight text-gray-900 dark:text-white">Balance</h5>
                <div className="flex  bg-[#91CDAA] w-28 p-1 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#033101"} fill={"none"}>
                        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M14.7102 10.0611C14.6111 9.29844 13.7354 8.06622 12.1608 8.06619C10.3312 8.06616 9.56136 9.07946 9.40515 9.58611C9.16145 10.2638 9.21019 11.6571 11.3547 11.809C14.0354 11.999 15.1093 12.3154 14.9727 13.956C14.836 15.5965 13.3417 15.951 12.1608 15.9129C10.9798 15.875 9.04764 15.3325 8.97266 13.8733M11.9734 6.99805V8.06982M11.9734 15.9031V16.998" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="font-mono pl-2 font-bold text-green-700">{availableBalance}</span>
                </div>
                <div className="mt-4 h-40">
                    <Line data={data} options={options} />
                </div>
            </section>
        </div>
    );
}
