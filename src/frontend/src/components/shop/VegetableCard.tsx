import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { CATEGORY_COLORS, VEGETABLE_IMAGES } from "@/data/sampleVegetables";
import { CheckCircle, ShoppingCart, XCircle } from "lucide-react";
import { motion } from "motion/react";
import type { Vegetable } from "../../backend";
import { VegetablePlaceholder } from "./VegetablePlaceholder";

interface VegetableCardProps {
  vegetable: Vegetable;
  index: number;
}

export function VegetableCard({ vegetable, index }: VegetableCardProps) {
  const { addToCart, setIsOpen } = useCart();

  const imageUrl =
    vegetable.image?.getDirectURL() ?? VEGETABLE_IMAGES[vegetable.name];
  const categoryColor =
    CATEGORY_COLORS[vegetable.category] ??
    "bg-secondary text-secondary-foreground";

  const handleAddToCart = () => {
    addToCart(vegetable);
    setIsOpen(true);
  };

  return (
    <motion.article
      className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      data-ocid={`shop.vegetable_card.${index + 1}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={vegetable.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <VegetablePlaceholder name={vegetable.name} />
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor}`}
          >
            {vegetable.category}
          </span>
        </div>
        {/* Stock indicator */}
        <div className="absolute top-3 right-3">
          {vegetable.stockAvailable ? (
            <span className="flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle className="w-3 h-3" />
              In Stock
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-200">
              <XCircle className="w-3 h-3" />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-bold text-base text-foreground leading-tight">
            {vegetable.name}
          </h3>
          <span className="font-heading font-bold text-lg text-primary whitespace-nowrap flex-shrink-0">
            £{vegetable.price.toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {vegetable.description}
        </p>

        <Button
          className={`w-full mt-2 gap-2 font-semibold ${
            vegetable.stockAvailable
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-green hover:shadow-card transition-all"
              : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!vegetable.stockAvailable}
          onClick={handleAddToCart}
          data-ocid={`shop.add_to_cart_button.${index + 1}`}
        >
          <ShoppingCart className="w-4 h-4" />
          {vegetable.stockAvailable ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </motion.article>
  );
}
