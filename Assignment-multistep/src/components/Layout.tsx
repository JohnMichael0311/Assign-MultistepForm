import React from "react";
import DarkModeToggle from "@/components/DarkModeToggle";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Multi-Step Form</h1>
          <DarkModeToggle />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <footer className="mt-10 bg-white dark:bg-gray-800 shadow p-4 text-center">
        &copy; {new Date().getFullYear()} Multi-Step Form
      </footer>
    </div>
  );
};

export default Layout;
