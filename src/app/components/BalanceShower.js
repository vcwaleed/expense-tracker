import Link from "next/link"
export default function () {
    return (
        <main>
            <section className="block max-w-lg  p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-100">
                <section className="flex flex-col">
                    <span className="font-mono text-2xl font-semibold ">Balance Details </span>
                    <span className="mt-16 font-mono ">Available Balance </span>
                    <span className="mt-12 font-mono">Total expenses </span>
                    <span className="mt-[25px] font-mono text-blue-700 text-center"><Link href='/'>Click For more Detail</Link></span>
                </section>
            </section>
        </main>
    )
}