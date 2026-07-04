"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function addInventoryItem(formData: FormData) {
  // Ensure cookies are parsed properly (unused directly here, but ensures Next.js dynamic rendering)
  await cookies();
  
  const supabase = await createSupabaseServerClient();
  
  // Securely validate the session using getUser()
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Extract form fields
  const marketValueRaw = formData.get("market_value")?.toString() || "0";
  const marketValueNum = parseFloat(marketValueRaw);

  const payload = {
    tenant_id: user.id,
    metric_name: 'hardware_assessment',
    value: Number(marketValueNum) || 0,
    item_name: formData.get("item_name")?.toString() || "",
    market_value: marketValueNum,
    status: formData.get("status")?.toString() || "Pending",
    identification_number: formData.get("identification_number")?.toString() || "",
    card_registration_field: formData.get("card_registration_field")?.toString() || "",
  };

  // Silently ensure the tenant exists using insert (to avoid RLS update blocks on upsert)
  const { error: tenantError } = await supabase
    .from("tenants")
    .insert({ id: user.id });

  if (tenantError && tenantError.code !== '23505') { // 23505 is unique_violation (already exists)
    console.error("Supabase tenant insert error:", tenantError);
    // Ignore RLS errors just in case, but if it fails we might hit the foreign key error anyway.
  }

  const { error } = await supabase
    .from("operations_metrics")
    .insert(payload);

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(error.message);
  }

  // Invalidate the dashboard so the new item appears instantly
  revalidatePath("/dashboard");
}
