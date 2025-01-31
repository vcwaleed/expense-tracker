import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
export default function Home(){
  return (
    <ProtectedRoute>
    <main>
      <Navbar/>
      
    </main>
    </ProtectedRoute>
  )
}
