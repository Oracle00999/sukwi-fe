// components/DashboardLayout.jsx
import React from "react";
import UserNav from "./UserNav";
import WalletNav from "./WalletNav";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <UserNav />
      <div className="min-h-screen bg-gray-50">
        <main className="min-h-[calc(100vh-64px)] w-full ">
          <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
      <WalletNav />
    </>
  );
};

export default DashboardLayout;
