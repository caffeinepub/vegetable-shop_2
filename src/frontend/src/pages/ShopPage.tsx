import { VegetableCard } from "@/components/shop/VegetableCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CATEGORIES,
  SAMPLE_VEGETABLES,
  VEGETABLE_IMAGES,
} from "@/data/sampleVegetables";
import { useGetAllVegetables } from "@/hooks/useQueries";
import { Leaf, Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Vegetable } from "../backend";

// Build sample vegetables for display when backend hasn't returned yet
const sampleVegsForDisplay: Vegetable[] = SAMPLE_VEGETABLES.map((v, i) => ({
  id: BigInt(i + 1),
  name: v.name,
  description: v.description,
  category: v.category,
  price: v.price,
  stockAvailable: v.stockAvailable,
  image: undefined,
}));

export function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: backendVegetables, isLoading } = useGetAllVegetables();

  // Use backend data when available, fall back to sample data
  const allVegetables =
    backendVegetables && backendVegetables.length > 0
      ? backendVegetables
      : sampleVegsForDisplay;

  const filteredVegetables = useMemo(() => {
    return allVegetables.filter((veg) => {
      const matchesCategory =
        activeCategory === "All" || veg.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        veg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        veg.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allVegetables, activeCategory, searchQuery]);

  return (
    <main className="flex-1">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/20 py-14 px-4">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-green-bright/10 blur-2xl" />
        </div>

        <div className="container mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">
                Farm Fresh
              </span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-4">
              The Freshest Vegetables,{" "}
              <span className="text-primary">Delivered to Your Door</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hand-picked daily from local farms. No pesticides, no shortcuts —
              just pure, seasonal goodness for your family.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shop section */}
      <section className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search vegetables…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-border focus:border-primary/50"
            />
          </div>

          {/* Category tabs */}
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full sm:w-auto"
          >
            <TabsList className="bg-muted w-full sm:w-auto flex-wrap h-auto gap-1 p-1">
              {CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
                  data-ocid="shop.category_tab"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            data-ocid="shop.loading_state"
          >
            {Array.from({ length: 8 }, (_, i) => `skel-${i}`).map((key) => (
              <div
                key={key}
                className="rounded-xl overflow-hidden bg-card shadow-card"
              >
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-9 w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredVegetables.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 gap-4"
            data-ocid="shop.empty_state"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
              <Leaf className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-heading font-bold text-xl text-foreground">
                No vegetables found
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or category filter.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            data-ocid="shop.vegetable_list"
          >
            {filteredVegetables.map((vegetable, index) => (
              <VegetableCard
                key={vegetable.id.toString()}
                vegetable={vegetable}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
