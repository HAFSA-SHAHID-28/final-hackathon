import { createBrowserRouter } from "react-router-dom";

import App from "../App";

import AuthPage from "../pages/AuthPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";

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