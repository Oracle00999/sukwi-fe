import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Link as LinkIcon,
  PlusCircle,
  Users,
  CreditCard,
  Settings,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";

// Main Layout Component
const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Set active nav based on current path
  const getActiveNav = (path) => {
    const paths = {
      "/admindashboard": "dashboard",
      "/admin/pending-deposits": "pending-deposits",
      "/admin/pending-withdrawals": "pending-withdrawals",
      "/admin/linked-wallets": "linked-wallets",
      "/admin/add-wallet": "add-wallet",
      "/admin/users": "users",
      "/admin/transactions": "transactions",
      "/admin/settings": "settings",
    };
    return paths[path] || "dashboard";
  };

  const activeNav = getActiveNav(location.pathname);

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admindashboard",
    },
    {
      id: "pending-deposits",
      label: "Pending Deposits",
      icon: <ArrowDownCircle size={20} />,
      path: "/admin/pending-deposits",
    },
    {
      id: "pending-withdrawals",
      label: "Pending Withdrawals",
      icon: <ArrowUpCircle size={20} />,
      path: "/admin/pending-withdrawals",
    },
    {
      id: "linked-wallets",
      label: "Linked Wallets",
      icon: <LinkIcon size={20} />,
      path: "/admin/linked-wallets",
    },
    {
      id: "add-wallet",
      label: "Add Wallet Addresses",
      icon: <PlusCircle size={20} />,
      path: "/admin/add-wallet",
    },
    {
      id: "users",
      label: "User Management",
      icon: <Users size={20} />,
      path: "/admin/users",
    },
    // {
    //   id: "transactions",
    //   label: "Transactions",
    //   icon: <CreditCard size={20} />,
    //   path: "/admin/transactions",
    // },
    // {
    //   id: "settings",
    //   label: "Settings",
    //   icon: <Settings size={20} />,
    //   path: "/admin/settings",
    // },
  ];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    setUserMenuOpen(false);
  };

  // Close mobile sidebar when clicking a link
  const handleMobileLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar - Desktop */}
        <aside
          className={`
          hidden lg:flex flex-col 
          ${sidebarOpen ? "w-64" : "w-20"} 
          bg-white 
          border-r border-gray-200
          transition-all duration-300
          z-30
          shrink-0
          fixed lg:relative h-full
        `}
        >
          {/* Logo Section */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 min-h-[70px]">
            <Link
              to="/admindashboard"
              className="flex items-center space-x-2"
              onClick={handleMobileLinkClick}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">QFS</span>
              </div>
              {sidebarOpen && (
                <div className="overflow-hidden">
                  <span className="text-xl font-bold text-gray-900">
                    QFS Ledger
                  </span>
                  <p className="text-xs text-gray-500 truncate">
                    Wallet System
                  </p>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={handleMobileLinkClick}
                className={`
                  flex items-center justify-between w-full p-3 rounded-lg transition-colors
                  ${
                    activeNav === item.id
                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                      : "hover:bg-gray-50 hover:border hover:border-gray-100 text-gray-700"
                  }
                  ${!sidebarOpen ? "justify-center" : ""}
                `}
              >
                <div className="flex items-center">
                  <span className="flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="ml-3 font-medium truncate">
                      {item.label}
                    </span>
                  )}
                </div>
                {sidebarOpen && item.badge && (
                  <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-2">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div
              className={`flex items-center ${
                sidebarOpen ? "justify-between" : "justify-center"
              }`}
            >
              {sidebarOpen ? (
                <>
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium">A</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        Admin
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600 flex-shrink-0"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Sidebar - Mobile Overlay */}
        {sidebarOpen && isMobile && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col">
              {/* Mobile sidebar content */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 min-h-[70px]">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">QFS</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-gray-900">
                      QFS Ledger
                    </span>
                    <p className="text-xs text-gray-500">Wallet System</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center justify-between w-full p-3 rounded-lg
                      ${
                        activeNav === item.id
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : "hover:bg-gray-50 hover:border hover:border-gray-100 text-gray-700"
                      }
                    `}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-3 font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">A</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Admin</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 lg:ml-0">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-200 shrink-0">
            <div className="flex items-center justify-between px-4 py-3 min-h-[70px]">
              {/* Left: Menu button and page title */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                  aria-label="Toggle sidebar"
                >
                  {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div>
                  <h1 className="text-lg font-semibold text-gray-900 capitalize">
                    {activeNav.replace("-", " ")}
                  </h1>
                  <p className="text-sm text-gray-500">
                    QFS Ledger Admin Panel
                  </p>
                </div>
              </div>

              {/* Right: User Profile */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                  aria-label="User menu"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">A</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="font-medium text-gray-900">Admin</p>
                    {/* <p className="text-xs text-gray-500">admin@qfsledger.com</p> */}
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <p className="font-medium text-gray-900">Admin</p>
                        <p className="text-sm text-gray-500">
                          admin@qfsledger.com
                        </p>
                      </div>
                      <div className="p-2">
                        <button
                          className="flex items-center w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User size={18} className="mr-2" />
                          Profile Settings
                        </button>
                        <button
                          className="flex items-center w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-red-600"
                          onClick={handleLogout}
                        >
                          <LogOut size={18} className="mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {/* Page Content */}
            <div className="p-4 md:p-6">
              {/* Children components render here */}
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
