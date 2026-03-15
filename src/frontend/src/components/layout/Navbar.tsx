import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useLocation } from "@tanstack/react-router";
import { Leaf, LogIn, LogOut, Settings, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";

export function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-green">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground tracking-tight">
              FreshVeg
            </span>
          </motion.div>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            data-ocid="nav.shop_link"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            Shop
          </Link>
          <Link
            to="/admin"
            data-ocid="nav.admin_link"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive("/admin")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Admin
          </Link>
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              className="relative border-border hover:bg-accent hover:border-primary/30 transition-all"
              onClick={() => setIsOpen(true)}
              data-ocid="nav.cart_button"
              aria-label={`Shopping cart, ${totalItems} items`}
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground border-0"
                  aria-hidden
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
            </Button>
          </motion.div>

          {/* Auth button */}
          {identity ? (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={clear}
              data-ocid="nav.logout_button"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="nav.login_button"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoggingIn ? "Signing in…" : "Sign In"}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
