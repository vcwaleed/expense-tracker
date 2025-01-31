'use client'
import { useState } from "react";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            setErrorMessage("");
            if (!email || !password) {
                setErrorMessage("Please enter both email and password.");
                return;
            }
            const res = await signInWithEmailAndPassword(email, password);

            if (!res) {
                setErrorMessage("Your login Email or Password is incorrect. Please try again.");
                return;
            }
            setEmail("");
            setPassword("");
            router.push("/");
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("An error occurred during login. Please try again.");
        }
    };

    return (
        <main className="flex justify-center items-center min-h-screen">
            <div className="w-full">
                <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                    <div
                        className="hidden lg:block lg:w-1/2 bg-cover"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')",
                        }}
                    ></div>
                    <div className="w-full p-8 lg:w-1/2">
                        <h2 className="text-2xl font-semibold text-gray-700 text-center font-mono">
                            Expense Tracker
                        </h2>
                        <p className="text-xl text-gray-600 text-center mt-2">Welcome back!</p>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="border-b w-1/5 lg:w-1/4"></span>
                            <p className="text-xs text-center text-gray-500 uppercase">
                                login with email
                            </p>
                            <span className="border-b w-1/5 lg:w-1/4"></span>
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email Address
                            </label>
                            <input
                                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrorMessage("");
                                }}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password
                                </label>
                            </div>
                            <input
                                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrorMessage("");
                                }}
                                required
                            />
                        </div>
                        {errorMessage && (
                            <div className="mt-4 p-2 text-red-600 text-sm text-center border border-red-200 bg-red-50 rounded">
                                {errorMessage}
                            </div>
                        )}
                        <div className="mt-6">
                            <button
                                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600 transition-colors"
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <span className="border-b w-1/5 md:w-1/4"></span>
                            <a
                                href="/signup"
                                className="text-xs text-gray-500 uppercase hover:text-gray-700"
                            >
                                or sign up
                            </a>
                            <span className="border-b w-1/5 md:w-1/4"></span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}