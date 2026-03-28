import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import UserDashboard from "./userDashboard/Dashboard.jsx";
import AdminDashboard from "./adminDashboard/Dashboard.jsx";
import SignUp from "./auth/SignUp.jsx";
import SignIn from "./auth/SignIn.jsx";

//
import ProtectedRoute from "./routeProtection/ProtectedRoute.jsx";
import AdminProtectedRoute from "./routeProtection/AdminProtectedRoute.jsx";
import DashboardLayout from "./userDashboard/DashboardLayout.jsx";
import Swap from "./userDashboard/Swap.jsx";
import Deposit from "./userDashboard/Deposit.jsx";
import Account from "./userDashboard/Account.jsx";
import Withdraw from "./userDashboard/Withdraw.jsx";
import LinkWallet from "./userDashboard/Link.jsx";
import Kyc from "./userDashboard/Kyc.jsx";
import AdminLayout from "./adminDashboard/AdminLayout.jsx";
import PendingDepositsPage from "./adminDashboard/PendingDepositsPage.jsx";
import LinkedWallets from "./adminDashboard/LinkedWallets.jsx";
import PendingWithdrawal from "./adminDashboard/PendingWithdrawal.jsx";
import AddWallet from "./adminDashboard/AddWallet.jsx";
import AdminKyc from "./adminDashboard/AdminViewKyc.jsx";
import ForgotPassword from "./auth/ForgotPassword.jsx";
import ResetPassword from "./auth/ResetPassword.jsx";
import History from "./userDashboard/History.jsx";
import CardCreation from "./userDashboard/CardCreation.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <UserDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/swap"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Swap />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/card-creation"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CardCreation />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Account />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <History />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/deposit"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Deposit />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/withdraw"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Withdraw />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/link"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <LinkWallet />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/kyc-verify"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Kyc />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindashboard"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/pending-deposits"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <PendingDepositsPage />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/linked-wallets"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <LinkedWallets />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/pending-withdrawals"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <PendingWithdrawal />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/add-wallet"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AddWallet />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminKyc />
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />
        {/*  */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
