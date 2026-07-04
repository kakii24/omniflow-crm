const fs = require('fs');
let content = fs.readFileSync('app/dashboard/page.tsx', 'utf8');

// Add import
content = content.replace(
  'import { createSupabaseServerClient } from "@/lib/supabase/server";',
  'import { createSupabaseServerClient } from "@/lib/supabase/server";\nimport InventoryTableClient from "@/app/components/InventoryTableClient";'
);

// Add fetch logic
const fetchLogic = `  const supabase = await createSupabaseServerClient();
  const { data: metrics } = await supabase
    .from("operations_metrics")
    .select("*")
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();`;

// The exact string to replace might use CRLF or LF, so we match both
content = content.replace(
  /  const supabase = await createSupabaseServerClient\(\);\r?\n  const \{\r?\n    data: \{ user \},\r?\n  \} = await supabase\.auth\.getUser\(\);/g,
  fetchLogic
);

// Replace component
content = content.replace('<InventoryTable />', '<InventoryTableClient rows={metrics || []} />');

fs.writeFileSync('app/dashboard/page.tsx', content);
