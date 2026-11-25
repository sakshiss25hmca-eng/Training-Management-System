import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://qqqraepthpasbugagrbi.supabase.co",
  "sb_publishable_5NXWZ5C1xYsHlBXB_vucJg_lVNyjokQ"
);

export { supabase };