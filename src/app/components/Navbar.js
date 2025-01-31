'use client'
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext"
export default function Navbar() {
    const { logout } = useAuth();
    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-800">
            <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-1">
                    <Image
                        src="/images/trlogo.png"
                        height={3}
                        width={80}
                        className="h-16"
                        alt="Blog Logo"
                    />

                </Link>
                <span className="font-sans font-bold">Track Your Daily Expenses</span>


                <div>

                    <button className="px-4 py-2 text-white bg-gray-700 rounded-lg hover:bg-red-600" onClick={logout}>Logout</button>

                </div>
            </div>
        </nav>
    );
}
