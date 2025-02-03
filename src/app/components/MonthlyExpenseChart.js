'use client'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
export default function MonthlyExpenseChart() {
    const { user } = useAuth();
    const [totalExpenses, settotalExpenses] = useState(0);
    const [monthlyExpenses, setMonthlyExpenses] = useState([]);
    useEffect(() => {
        if (!user) return;
        const expensesQuery = query(
            collection(db, "users", user.uid, "transactions"),
            where("type", "==", "expense")
        );
        const unsubscribeTotal = onSnapshot(expensesQuery, (querySnapshot) => {
            let total = 0;
            querySnapshot.forEach((doc) => {
                total += Number(doc.data().amount);
            });
            settotalExpenses(total);
        });
        return () => unsubscribeTotal();
    }, [user]);
    useEffect(() => {
        if (!user) return;
        const expensesQuery = query(
            collection(db, "users", user.uid, "transactions"),
            where("type", "==", "expense")
        );
        const unsubscribeMonthly = onSnapshot(expensesQuery, (querySnapshot) => {
            const expensesByMonth = {};
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.date) {
                    const dateObj = data.date.toDate();
                    const month = dateObj.getMonth();
                    const year = dateObj.getFullYear();
                    const key = `${year}-${month}`;
                    expensesByMonth[key] = (expensesByMonth[key] || 0) + Number(data.amount);
                }
            });
            const formattedExpenses = Array(12).fill(0);
            const currentYear = new Date().getFullYear();
            Object.entries(expensesByMonth).forEach(([key, amount]) => {
                const [year, month] = key.split('-').map(Number);
                if (year === currentYear) {
                    formattedExpenses[month] = amount;
                }
            });
            setMonthlyExpenses(formattedExpenses);
        });
        return () => unsubscribeMonthly();
    }, [user]);
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Expenses',
                data: monthlyExpenses,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(199, 199, 199, 0.5)',
                    'rgba(83, 102, 255, 0.5)',
                    'rgba(255, 140, 64, 0.5)',
                    'rgba(199, 199, 132, 0.5)',
                    'rgba(54, 255, 235, 0.5)',
                    'rgba(255, 99, 64, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)',
                    'rgba(255, 140, 64, 1)',
                    'rgba(199, 199, 132, 1)',
                    'rgba(54, 255, 235, 1)',
                    'rgba(255, 99, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: true,
                font: {
                    size: 16
                }
            }
        }
    };
    return (
        <main className="container mx-auto py-4  ">
            <div className=" rounded-lg  p-6 w-full md:w-80 lg:w-96">
                <h2 className="text-2xl font-semibold mb-4 font-mono">Expenses</h2>
                <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#800000"} fill={"none"}>
                        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M14.7102 10.0611C14.6111 9.29844 13.7354 8.06622 12.1608 8.06619C10.3312 8.06616 9.56136 9.07946 9.40515 9.58611C9.16145 10.2638 9.21019 11.6571 11.3547 11.809C14.0354 11.999 15.1093 12.3154 14.9727 13.956C14.836 15.5965 13.3417 15.951 12.1608 15.9129C10.9798 15.875 9.04764 15.3325 8.97266 13.8733M11.9734 6.99805V8.06982M11.9734 15.9031V16.998" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="font-mono pl-2">{totalExpenses}</span>
                </div>
                <div className="h-[300px] w-full md:w-[130%]">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>
        </main>
    );
}