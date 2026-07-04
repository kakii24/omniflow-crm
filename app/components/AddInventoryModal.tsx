"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addInventoryItem } from "@/app/actions/inventory";

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddInventoryModal({ isOpen, onClose }: AddInventoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    try {
      await addInventoryItem(formData);
      onClose(); // Close modal on success
    } catch (err: any) {
      setError(err.message || "Failed to add inventory item.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex justify-end"
            style={{
              background: "rgba(255,255,255,0.4)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col relative"
              style={{
                borderLeft: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Add New Hardware</h2>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label="Close modal"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <form id="add-inventory-form" onSubmit={handleSubmit} className="space-y-5">
                  {/* Item Name */}
                  <div>
                    <label htmlFor="item_name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Item Name
                    </label>
                    <input
                      id="item_name"
                      name="item_name"
                      type="text"
                      required
                      placeholder="e.g. iPhone 15 Pro Max, NVIDIA RTX 4080"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-shadow"
                      style={{
                        background: "#F9FAFB",
                        border: "1px solid rgba(0,0,0,0.1)",
                        color: "#111827",
                      }}
                    />
                  </div>

                  {/* Market Value */}
                  <div>
                    <label htmlFor="market_value" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Estimated Market Value
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-sm text-gray-400 font-medium">$</span>
                      <input
                        id="market_value"
                        name="market_value"
                        type="text"
                        required
                        placeholder="0.00"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl text-sm outline-none transition-shadow"
                        style={{
                          background: "#F9FAFB",
                          border: "1px solid rgba(0,0,0,0.1)",
                          color: "#111827",
                        }}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-shadow appearance-none"
                      style={{
                        background: "#F9FAFB url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\") no-repeat right 0.5rem center/1.5rem 1.5rem",
                        border: "1px solid rgba(0,0,0,0.1)",
                        color: "#111827",
                      }}
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  {/* Identification Number */}
                  <div>
                    <label htmlFor="identification_number" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Identification Number
                    </label>
                    <input
                      id="identification_number"
                      name="identification_number"
                      type="text"
                      required
                      placeholder="Enter Identification Number"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-shadow"
                      style={{
                        background: "#F9FAFB",
                        border: "1px solid rgba(0,0,0,0.1)",
                        color: "#111827",
                      }}
                    />
                  </div>

                  {/* Card Registration Field */}
                  <div>
                    <label htmlFor="card_registration_field" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Card Registration Field
                    </label>
                    <input
                      id="card_registration_field"
                      name="card_registration_field"
                      type="text"
                      required
                      placeholder="Enter Card Registration Field"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-shadow"
                      style={{
                        background: "#F9FAFB",
                        border: "1px solid rgba(0,0,0,0.1)",
                        color: "#111827",
                      }}
                    />
                  </div>
                  
                  {error && (
                    <div className="px-3.5 py-2.5 rounded-xl text-xs font-medium" style={{ background: "rgba(239,68,68,0.08)", color: "#DC2626" }}>
                      {error}
                    </div>
                  )}
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-60"
                  style={{ background: "#E5E7EB" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="add-inventory-form"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #2563EB, #4F46E5)" }}
                >
                  {loading ? "Saving…" : "Save Item"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
