import BalanceShower from "./components/BalanceShower";
import ExpenseTable from "./components/ExpenseTable";
import MonthlyExpenseChart from "./components/MonthlyExpenseChart";
import Navbar from "./components/Navbar";
import PaymentCard from "./components/PaymentCard";
import ProtectedRoute from "./components/ProtectedRoute";
import Uploadcard from "./components/UploadCard";
export default function Home() {
  return (
    <ProtectedRoute>
      <main>
        <Navbar />
        <section className="container mx-auto p-4 content-center  ">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <PaymentCard />
            <Uploadcard />
            <BalanceShower/>
          </div>
        </section>
        <section className="container mx-auto p-4 content-center ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2    mt-4">
              <ExpenseTable />
            </div>
            <div className="md:col-span-1 flex justify-center ">
              <MonthlyExpenseChart />
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  )
}
