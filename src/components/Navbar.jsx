// src/components/Navbar.jsx   (or Sidebar.jsx)
"use client"
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Shuffle, 
  ClipboardList, 
  History, 
  Settings, 
  Warehouse,
  User, 
  LogOut 
} from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path) => pathname.startsWith(path);

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#1f2529] text-white flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <h1 className="text-2xl font-bold">
          <span className="text-purple-400">Stock</span>Master
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {/* Dashboard */}
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            isActive("/dashboard")
              ? "bg-purple-600 text-white shadow-lg"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>

        {/* Products */}
        <Link
          href="/products"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            isActive("/products")
              ? "bg-purple-600 text-white shadow-lg"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <Package className="w-5 h-5" />
          Products
        </Link>

        {/* Operations Group */}
        <div className="pt-4">
          <div className="px-4 py-2 text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Warehouse className="w-4 h-4" />
            Operations
          </div>

          <Link
            href="/receipts"
            className={`flex items-center gap-3 px-10 py-2.5 rounded-lg text-sm transition-all ${
              isActive("/receipts")
                ? "bg-purple-600 text-white font-medium shadow-lg"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <ArrowDownToLine className="w-4 h-4" />
            Receipts
          </Link>

          <Link
            href="/deliveries"
            className={`flex items-center gap-3 px-10 py-2.5 rounded-lg text-sm transition-all ${
              isActive("/deliveries")
                ? "bg-purple-600 text-white font-medium shadow-lg"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <ArrowUpFromLine className="w-4 h-4" />
            Delivery Orders
          </Link>

          <Link
            href="/transfers"
            className={`flex items-center gap-3 px-10 py-2.5 rounded-lg text-sm transition-all ${
              isActive("/transfers")
                ? "bg-purple-600 text-white font-medium shadow-lg"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Shuffle className="w-4 h-4" />
            Internal Transfers
          </Link>

          <Link
            href="/adjustments"
            className={`flex items-center gap-3 px-10 py-2.5 rounded-lg text-sm transition-all ${
              isActive("/adjustments")
                ? "bg-purple-600 text-white font-medium shadow-lg"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Inventory Adjustment
          </Link>
        </div>

        {/* Move History */}
        <Link
          href="/moves"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            isActive("/moves")
              ? "bg-purple-600 text-white shadow-lg"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <History className="w-5 h-5" />
          Move History
        </Link>

        {/* Settings */}
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            isActive("/settings")
              ? "bg-purple-600 text-white shadow-lg"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 p-4 space-y-2">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
        >
          <User className="w-5 h-5" />
          My Profile
        </Link>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-red-900/40 hover:text-red-400 transition-all">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;