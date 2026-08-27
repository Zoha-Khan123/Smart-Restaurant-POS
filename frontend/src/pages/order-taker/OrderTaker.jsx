import React, { useState, useMemo } from "react";
import { Search, CheckCircle2, AlertCircle } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "../../data/products";
import CategorySidebar from "./CategorySidebar";
import ProductGrid from "./ProductGrid";
import CurrentOrder from "./CurrentOrder";
import ModifierModal from "./ModifierModal";

/**
 * Smart POS - Order Taker Screen (Screen 3 from Blueprint)
 */
export default function OrderTaker() {
  // State: Filters & Search
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTable, setSelectedTable] = useState("Table: 05");
  const [orderType, setOrderType] = useState("Dine In"); // 'Dine In' | 'Takeaway' | 'Delivery'
  const [orderNote, setOrderNote] = useState("");

  // State: Cart Items
  const [cart, setCart] = useState([
    {
      id: "cart-1",
      productId: "p1",
      name: "Zinger Burger",
      price: 450,
      quantity: 2,
      selectedSize: "Single Patty",
      addOns: [],
      note: "",
    },
    {
      id: "cart-2",
      productId: "p3",
      name: "Chicken Pizza",
      price: 900,
      quantity: 1,
      selectedSize: "Medium (11-inch)",
      addOns: [],
      note: "",
    },
    {
      id: "cart-3",
      productId: "p7",
      name: "Coke (500ml)",
      price: 120,
      quantity: 2,
      selectedSize: null,
      addOns: [],
      note: "",
    },
  ]);

  // State: Modifier Modal
  const [activeProductForModifier, setActiveProductForModifier] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [modifierNote, setModifierNote] = useState("");

  // State: Feedback Notification Toast
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const showNotification = (msg, type = "success") => {
    setFeedbackMessage({ text: msg, type });
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Filter Products by Category and Search
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // -------------------------------------------------------------
  // CART OPERATIONS
  // -------------------------------------------------------------

  const handleProductClick = (product) => {
    if (product.hasModifiers && (product.sizes?.length || product.addOns?.length)) {
      setActiveProductForModifier(product);
      setSelectedSize(product.sizes?.[0] || null);
      setSelectedAddOns([]);
      setModifierNote("");
    } else {
      addItemToCart(product, null, [], "");
    }
  };

  const addItemToCart = (product, size, addOns, note) => {
    const sizeDelta = size?.priceDelta || 0;
    const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = product.price + sizeDelta + addOnsTotal;

    const addOnIds = addOns.map((a) => a.id).sort().join("-");
    const customizationKey = `${product.id}-${size?.name || "def"}-${addOnIds}-${note.trim()}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.customizationKey === customizationKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          customizationKey,
          productId: product.id,
          name: product.name,
          price: unitPrice,
          basePrice: product.price,
          quantity: 1,
          selectedSize: size?.name || null,
          addOns: addOns,
          note: note.trim(),
        },
      ];
    });

    showNotification(`Added "${product.name}" to cart`);
  };

  const handleConfirmModifier = () => {
    if (!activeProductForModifier) return;
    addItemToCart(
      activeProductForModifier,
      selectedSize,
      selectedAddOns,
      modifierNote
    );
    setActiveProductForModifier(null);
  };

  const handleToggleAddOn = (addon) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  const updateQuantity = (cartId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (cartId) => {
    setCart((prev) => prev.filter((item) => item.id !== cartId));
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    if (window.confirm("Are you sure you want to clear the current order?")) {
      setCart([]);
      setOrderNote("");
      showNotification("Order cleared", "info");
    }
  };

  const handleHoldOrder = () => {
    if (cart.length === 0) {
      showNotification("Cannot hold an empty order", "error");
      return;
    }
    showNotification(`Order held successfully for ${selectedTable}`, "info");
    setCart([]);
    setOrderNote("");
  };

  const handleSendToKitchen = () => {
    if (cart.length === 0) {
      showNotification("Please add items to send to kitchen", "error");
      return;
    }
    showNotification(`KOT Ticket sent to Kitchen for ${selectedTable}!`, "success");
  };

  const handlePayAndPrint = () => {
    if (cart.length === 0) {
      showNotification("Cart is empty", "error");
      return;
    }
    showNotification("Proceeding to Billing & Receipt generation...", "success");
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const discount = subtotal > 0 ? 150 : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxRate = 0.05;
  const taxAmount = Math.round(taxableAmount * taxRate);
  const grandTotal = taxableAmount + taxAmount;

  const modifierCurrentPrice = useMemo(() => {
    if (!activeProductForModifier) return 0;
    const base = activeProductForModifier.price;
    const sizeDelta = selectedSize?.priceDelta || 0;
    const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    return base + sizeDelta + addOnsTotal;
  }, [activeProductForModifier, selectedSize, selectedAddOns]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start h-full">
      {/* LEFT SECTION: MENU BROWSING & CATEGORIES */}
      <div className="w-full lg:w-[65%] xl:w-[68%] flex flex-col space-y-5">
        {/* Top Control Bar: Search & Dining Selector */}
        <div className="bg-bg-card rounded-2xl p-4 border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu item..."
              className="w-full pl-10 pr-4 py-2.5 bg-bg-main border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Dining Options & Table Selector */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
            <div className="bg-bg-main p-1 rounded-xl border border-border flex items-center gap-1 shrink-0">
              {["Dine In", "Takeaway", "Delivery"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                    orderType === type
                      ? "bg-bg-card text-primary shadow-xs font-bold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {orderType === "Dine In" && (
              <div className="relative shrink-0">
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="appearance-none pl-3.5 pr-8 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 whitespace-nowrap"
                >
                  {[
                    "Table: 01",
                    "Table: 02",
                    "Table: 03",
                    "Table: 04",
                    "Table: 05",
                    "Table: 06",
                    "Table: 07",
                    "Table: 08",
                    "Table: 09",
                    "Table: 10",
                    "Table: 11",
                    "Table: 12",
                  ].map((tbl) => (
                    <option
                      key={tbl}
                      value={tbl}
                      className="text-text-primary bg-bg-card font-medium"
                    >
                      {tbl}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-700 text-[10px]">
                  ▼
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Filter Bar */}
        <CategorySidebar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          onProductClick={handleProductClick}
        />
      </div>

      {/* RIGHT SECTION: CURRENT ORDER / CART PANEL */}
      <div className="w-full lg:w-[35%] xl:w-[32%] sticky top-20">
        <CurrentOrder
          cart={cart}
          orderNumber="#1024"
          orderType={orderType}
          selectedTable={selectedTable}
          orderNote={orderNote}
          setOrderNote={setOrderNote}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
          onHoldOrder={handleHoldOrder}
          onSendToKitchen={handleSendToKitchen}
          onPayAndPrint={handlePayAndPrint}
          subtotal={subtotal}
          discount={discount}
          taxAmount={taxAmount}
          grandTotal={grandTotal}
        />
      </div>

      {/* MODAL: PRODUCT MODIFIER */}
      <ModifierModal
        product={activeProductForModifier}
        isOpen={Boolean(activeProductForModifier)}
        onClose={() => setActiveProductForModifier(null)}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedAddOns={selectedAddOns}
        onToggleAddOn={handleToggleAddOn}
        modifierNote={modifierNote}
        setModifierNote={setModifierNote}
        onConfirm={handleConfirmModifier}
        currentPrice={modifierCurrentPrice}
      />

      {/* FEEDBACK TOAST */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl text-white text-xs font-semibold flex items-center gap-2 ${
              feedbackMessage.type === "error"
                ? "bg-danger"
                : feedbackMessage.type === "info"
                ? "bg-amber-600"
                : "bg-emerald-600"
            }`}
          >
            {feedbackMessage.type === "error" ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}
