'use client'
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false); 
    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-800 shadow-sm">
            <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/images/expense.png"
                        height={40}
                        width={100}
                        className="max-h-12 w-auto"
                        alt="logo"
                    />
                    <span className="font-serif font-bold  md:text-lg">
                        Track Your Daily Expenses
                    </span>
                </Link>
                <button
                    className="md:hidden p-2 rounded-lg text-gray-700 dark:text-white focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
                <div className={`absolute md:static top-16 right-0 w-48 md:w-auto bg-white dark:bg-gray-800 shadow-md md:shadow-none p-4 md:p-0 rounded-lg md:flex items-center space-x-4 ${isOpen ? "block" : "hidden"}`}>
                    <button 
                        className="w-full md:w-auto px-4 py-2 text-white bg-gray-700 rounded-lg hover:bg-red-600"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
