import { Link, useLocation } from "react-router-dom";
import { Home, Receipt, Tags, UserPlus, Download, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Layout({ children, user, onLogout }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Transaksi", href: "/transactions", icon: Receipt },
    { name: "Kategori", href: "/categories", icon: Tags },
    ...(user?.role === "superadmin" ? [{ name: "Admin", href: "/admin", icon: UserPlus }] : []),
    //{ name: "Download", href: "/download", icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Receipt className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">MoneyTracker</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`flex items-center gap-2 ${
                        isActive
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                      }`}
                      data-testid={`nav-${item.name.toLowerCase()}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
              <div className="ml-4 flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user?.username}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  data-testid="logout-button"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-button"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium ${
                        isActive
                          ? "bg-indigo-600 text-white"
                          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                      data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="px-3 py-2">
                  <div className="text-base font-medium text-gray-900">{user?.username}</div>
                  <div className="text-sm text-gray-500 capitalize">{user?.role}</div>
                </div>
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
                  data-testid="mobile-logout-button"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()}{" "}
            <a 
              href="https://aryadinata.my.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
            >
              Arya Dinata
            </a>
            . All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}