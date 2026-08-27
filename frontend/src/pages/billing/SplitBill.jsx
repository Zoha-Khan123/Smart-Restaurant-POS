import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Users,
  Layers,
  RotateCcw,
  CheckCircle2,
  Receipt,
  CreditCard,
  Plus,
  Minus,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

/**
 * Smart POS - SplitBill Component
 */
export default function SplitBill({
  order,
  onBack,
  onProceedToPayment,
}) {
  const [splitMode, setSplitMode] = useState("equal"); // 'equal' | 'items'
  const [peopleCount, setPeopleCount] = useState(2);

  // For Itemized Split: mapping of item index -> person index (0 to N-1)
  const [itemAssignments, setItemAssignments] = useState({
    0: 0,
    1: 1,
    2: 0,
  });

  const grandTotal = order?.grandTotal || 1984;
  const items = order?.items || [
    { name: "Zinger Burger (2x)", price: 900, quantity: 2 },
    { name: "Chicken Pizza (1x)", price: 900, quantity: 1 },
    { name: "Coke (500ml) (2x)", price: 240, quantity: 2 },
  ];

  // EQUAL SPLIT CALCULATIONS
  const perPersonEqual = useMemo(() => {
    return Math.round(grandTotal / peopleCount);
  }, [grandTotal, peopleCount]);

  // ITEMIZED SPLIT CALCULATIONS
  const itemizedSplits = useMemo(() => {
    const personBills = Array.from({ length: peopleCount }, (_, idx) => ({
      personNumber: idx + 1,
      items: [],
      subtotal: 0,
    }));

    items.forEach((item, itemIdx) => {
      const assignedPerson = itemAssignments[itemIdx] ?? 0;
      if (personBills[assignedPerson]) {
        personBills[assignedPerson].items.push(item);
        personBills[assignedPerson].subtotal += item.price;
      }
    });

    const totalSub = items.reduce((sum, it) => sum + it.price, 0);

    return personBills.map((p) => {
      const shareRatio = totalSub > 0 ? p.subtotal / totalSub : 1 / peopleCount;
      const finalAmount = Math.round(grandTotal * shareRatio);
      return {
        ...p,
        finalAmount,
      };
    });
  }, [items, itemAssignments, peopleCount, grandTotal]);

  const handleAssignItem = (itemIdx, personIdx) => {
    setItemAssignments((prev) => ({
      ...prev,
      [itemIdx]: personIdx,
    }));
  };

  const handleReset = () => {
    setPeopleCount(2);
    setItemAssignments({ 0: 0, 1: 1, 2: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-bg-card rounded-2xl p-4 border border-border shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary px-3 py-2 rounded-xl hover:bg-bg-hover transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Billing</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge variant="primary">{order?.orderNumber || "Order #1024"}</Badge>
          <Badge variant="success">Total: Rs. {grandTotal.toLocaleString()}</Badge>
        </div>
      </div>

      {/* Mode Selector & Controls */}
      <div className="bg-bg-card rounded-2xl p-6 border border-border shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Split Bill Options
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Choose how you would like to divide this check
            </p>
          </div>

          {/* Split Mode Tabs */}
          <div className="bg-bg-main p-1 rounded-xl border border-border flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSplitMode("equal")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                splitMode === "equal"
                  ? "bg-bg-card text-primary shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Split Equally
            </button>

            <button
              type="button"
              onClick={() => setSplitMode("items")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                splitMode === "items"
                  ? "bg-bg-card text-primary shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Split by Items
            </button>
          </div>
        </div>

        {/* Number of Persons Stepper */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-bg-main border border-border">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs font-bold text-text-primary">
                Number of Guests / Splits
              </p>
              <p className="text-[11px] text-text-muted">
                Divide the total bill between multiple people
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPeopleCount((p) => Math.max(2, p - 1))}
              disabled={peopleCount <= 2}
              className="w-8 h-8 rounded-lg bg-bg-card border border-border flex items-center justify-center text-text-primary hover:border-primary disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-8 text-center text-sm font-bold text-text-primary">
              {peopleCount}
            </span>

            <button
              type="button"
              onClick={() => setPeopleCount((p) => Math.min(8, p + 1))}
              disabled={peopleCount >= 8}
              className="w-8 h-8 rounded-lg bg-bg-card border border-border flex items-center justify-center text-text-primary hover:border-primary disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ====================================================
            MODE 1: SPLIT EQUALLY CARDS
        ===================================================== */}
        {splitMode === "equal" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: peopleCount }, (_, i) => (
                <div
                  key={i}
                  className="bg-bg-main p-5 rounded-2xl border border-border flex flex-col justify-between gap-4"
                >
                  <div className="flex justify-between items-center">
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                      {i + 1}
                    </span>
                    <Badge variant="success">Person {i + 1}</Badge>
                  </div>

                  <div>
                    <span className="text-[11px] text-text-muted">Share to pay</span>
                    <p className="text-xl font-bold text-emerald-600 mt-0.5">
                      Rs. {perPersonEqual.toLocaleString()}
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={() =>
                      onProceedToPayment({
                        ...order,
                        grandTotal: perPersonEqual,
                        orderNumber: `${order?.orderNumber || "Order #1024"} (Person ${i + 1})`,
                      })
                    }
                    className="py-2 text-xs font-semibold"
                  >
                    Pay This Share
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            MODE 2: SPLIT BY ITEMS
        ===================================================== */}
        {splitMode === "items" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Assign Dishes to Guests
              </h4>

              <div className="bg-bg-main rounded-2xl border border-border p-4 divide-y divide-border-light space-y-3">
                {items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-bold text-text-primary text-xs">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        Price: Rs. {item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Person Assignment Selector */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-text-muted mr-1">
                        Assign to:
                      </span>
                      {Array.from({ length: peopleCount }, (_, pIdx) => {
                        const isAssigned = itemAssignments[itemIdx] === pIdx;
                        return (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => handleAssignItem(itemIdx, pIdx)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isAssigned
                                ? "bg-primary text-white shadow-xs"
                                : "bg-bg-card border border-border text-text-secondary hover:text-text-primary"
                            }`}
                          >
                            Person {pIdx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Split Totals Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {itemizedSplits.map((split) => (
                <div
                  key={split.personNumber}
                  className="bg-bg-main p-4 rounded-2xl border border-border flex flex-col justify-between gap-3"
                >
                  <div className="flex justify-between items-center border-b border-border-light pb-2">
                    <span className="font-bold text-text-primary text-xs">
                      Person {split.personNumber}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      {split.items.length} item(s)
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-text-secondary">
                    {split.items.map((it, idx) => (
                      <p key={idx} className="truncate">
                        • {it.name}
                      </p>
                    ))}
                    {split.items.length === 0 && (
                      <p className="italic text-text-muted">No items assigned yet</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border-light flex justify-between items-baseline">
                    <span className="text-xs font-bold text-text-primary">Total:</span>
                    <span className="text-base font-bold text-emerald-600">
                      Rs. {split.finalAmount.toLocaleString()}
                    </span>
                  </div>

                  <Button
                    type="button"
                    disabled={split.finalAmount === 0}
                    onClick={() =>
                      onProceedToPayment({
                        ...order,
                        grandTotal: split.finalAmount,
                        orderNumber: `${order?.orderNumber || "Order #1024"} (Person ${split.personNumber})`,
                      })
                    }
                    className="py-2 text-xs font-semibold"
                  >
                    Pay Person {split.personNumber} Bill
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Split</span>
          </button>

          <Button
            type="button"
            onClick={() => onProceedToPayment(order)}
            className="py-2.5 px-6 text-xs font-bold"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
