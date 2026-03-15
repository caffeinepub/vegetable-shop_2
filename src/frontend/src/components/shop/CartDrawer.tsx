import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { VEGETABLE_IMAGES } from "@/data/sampleVegetables";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { VegetablePlaceholder } from "./VegetablePlaceholder";

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  } = useCart();

  const handleCheckout = () => {
    toast.success("Order placed successfully! 🌿", {
      description: `${totalItems} item${totalItems !== 1 ? "s" : ""} — £${subtotal.toFixed(2)} total. Thank you for shopping fresh!`,
      duration: 5000,
    });
    clearCart();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] p-0 flex flex-col"
        data-ocid="cart.drawer"
      >
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-heading text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Your Cart
              {totalItems > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({totalItems} item{totalItems !== 1 ? "s" : ""})
                </span>
              )}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center"
            data-ocid="cart.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-heading font-bold text-lg text-foreground">
                Your cart is empty
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Browse our fresh selection and add some vegetables!
              </p>
            </div>
            <Button
              variant="default"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setIsOpen(false)}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 px-5 py-4">
              <ul className="space-y-3">
                <AnimatePresence initial={false}>
                  {items.map((item, index) => {
                    const imageUrl =
                      item.vegetable.image?.getDirectURL() ??
                      VEGETABLE_IMAGES[item.vegetable.name];

                    return (
                      <motion.li
                        key={item.vegetable.id.toString()}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 bg-muted/50 rounded-lg p-3"
                        data-ocid={`cart.item.${index + 1}`}
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.vegetable.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <VegetablePlaceholder name={item.vegetable.name} />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-sm text-foreground truncate">
                            {item.vegetable.name}
                          </p>
                          <p className="text-sm font-bold text-primary mt-0.5">
                            £{(item.vegetable.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            £{item.vegetable.price.toFixed(2)} each
                          </p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 border-border hover:border-primary/40"
                            onClick={() =>
                              updateQuantity(
                                item.vegetable.id,
                                item.quantity - 1,
                              )
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 border-border hover:border-primary/40"
                            onClick={() =>
                              updateQuantity(
                                item.vegetable.id,
                                item.quantity + 1,
                              )
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-1"
                            onClick={() => removeFromCart(item.vegetable.id)}
                            data-ocid={`cart.remove_button.${index + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </ScrollArea>

            {/* Order Summary */}
            <div className="border-t border-border px-5 pt-4 pb-5 flex-shrink-0 space-y-4">
              <div>
                <h3 className="font-heading font-bold text-sm text-foreground uppercase tracking-wide mb-3">
                  Order Summary
                </h3>
                <div className="space-y-1.5">
                  {items.map((item) => (
                    <div
                      key={item.vegetable.id.toString()}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground truncate flex-1 mr-2">
                        {item.vegetable.name}{" "}
                        <span className="text-muted-foreground/70">
                          ×{item.quantity}
                        </span>
                      </span>
                      <span className="font-medium text-foreground flex-shrink-0">
                        £{(item.vegetable.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-heading font-bold text-base text-foreground">
                  Grand Total
                </span>
                <span className="font-heading font-bold text-xl text-primary">
                  £{subtotal.toFixed(2)}
                </span>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 shadow-green"
                onClick={handleCheckout}
                data-ocid="cart.checkout_button"
              >
                Checkout — £{subtotal.toFixed(2)}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
