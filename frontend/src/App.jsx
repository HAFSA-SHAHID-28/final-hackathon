import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-page text-ink">
      <Navbar />

      <main className="min-h-[calc(100vh-140px)]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default App;