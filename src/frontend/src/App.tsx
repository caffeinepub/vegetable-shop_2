import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/contexts/CartContext";
import { AdminPage } from "@/pages/AdminPage";
import { ShopPage } from "@/pages/ShopPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root layout
function RootLayout() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <Outlet />
        <Footer />
        <CartDrawer />
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast: "font-sans",
              title: "font-heading font-semibold",
            },
          }}
        />
      </div>
    </CartProvider>
  );
}

// Route definitions
const rootRoute = createRootRoute({ component: RootLayout });

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ShopPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([shopRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
