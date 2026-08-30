import { createBrowserRouter } from "react-router-dom";

import App from "../App";

import AuthPage from "../pages/AuthPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import AboutPage from "../pages/AboutPage";
import ServicesPage from "../pages/ServicesPage";
import ProtectedRoutes from "../components/ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: "/auth",
        element: <AuthPage />,
      },

      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },

      {
        path: "/reset-password/:token",
        element: <ResetPasswordPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/services",
        element: <ServicesPage />,
      },

      {
        path: "/dashboard",
        element: (
          <ProtectedRoutes>
            <DashboardPage />
          </ProtectedRoutes>
        ),
      },
    ],
  },
]);

export default router;
