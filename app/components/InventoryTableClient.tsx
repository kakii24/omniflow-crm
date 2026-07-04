"use client";

import { useState } from "react";
import AddInventoryModal from "./AddInventoryModal";

interface OperationsMetric {
  id: string;
  item_name: string;
  market_value: string;
  status: string;
  identification_number: string;
  card_registration_field: string;
  created_at?: string;
}

interface InventoryTableClientProps {
  rows: OperationsMetric[];
}

export default function InventoryTableClient({ rows }: InventoryTableClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    "Identification Number",
    "Item Name",
    "Market Value",
    "Status",
    "Card Registration Field"
  ];

  function ConditionBadge({ condition }: { condition: string }) {
    const map: Record<string, { bg: string; color: string }> = {
      Excellent: { bg: "rgba(16,185,129,0.1)",   color: "#059669" },
      Good:      { bg: "rgba(37,99,235,0.08)",   color: "#2563EB" },
      Fair:      { bg: "rgba(245,158,11,0.1)",   color: "#D97706" },
      Pending:   { bg: "rgba(156,163,175,0.15)", color: "#6B7280" },
    };
    const s = map[condition] || map.Pending;
    return (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        style={{ background: s.bg, color: s.color }}
      >
        {condition}
      </span>
    );
  }

  return (
    <>
      <section
        className="rounded-2xl bg-white overflow-hidden"
        style={{
          border:    "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
        aria-label="Inventory table"
      >
        {/* Table header bar */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div>
            <h2
              className="text-base font-semibold"
              style={{ color: "#111827", letterSpacing: "-0.012em" }}
            >
              Inventory Register
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
              {rows.length} items · Sorted by latest added
            </p>
          </div>

          {/* Table controls */}
          <div className="flex items-center gap-2">
            {/* Add item */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium text-white"
              style={{ background: "linear-gradient(135deg, #2563EB, #4F46E5)" }}
              aria-label="Add inventory item"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5" aria-hidden="true">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline">Add Item</span>
            </button>
          </div>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" role="table">
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {columns.map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="px-5 py-3 text-left text-xs font-semibold tracking-wider uppercase select-none whitespace-nowrap"
                    style={{ color: "#9CA3AF" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500 text-sm">
                    No items found. Click "Add Item" to add hardware.
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr
                    key={row.id}
                    className="group transition-colors duration-100"
                    style={{
                      background:   i % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                      borderBottom: "1px solid rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* Identification Number */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className="text-xs font-mono font-medium px-2 py-0.5 rounded"
                        style={{ background: "rgba(37,99,235,0.06)", color: "#2563EB" }}
                      >
                        {row.identification_number || "-"}
                      </span>
                    </td>
                    {/* Item Name */}
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-sm" style={{ color: "#111827" }}>
                        {row.item_name || "-"}
                      </span>
                    </td>
                    {/* Market Value */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-semibold text-sm" style={{ color: "#059669" }}>
                        ${row.market_value || "0.00"}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <ConditionBadge condition={row.status || "Pending"} />
                    </td>
                    {/* Card Registration Field */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-xs" style={{ color: "#6B7280" }}>
                        {row.card_registration_field || "-"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Render Modal */}
      <AddInventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
