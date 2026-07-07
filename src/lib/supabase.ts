import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || '';

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function archiveToSupabase(companyId: string, record: any) {
  if (!supabase) {
    console.log(`[Supabase] Skipping archival for ${companyId} — no credentials configured. Record:`, record.rollNumber);
    return { ok: true, mock: true };
  }

  const { data, error } = await supabase
    .from('evaluations')
    .insert([{ company_id: companyId, ...record }]);

  if (error) {
    console.error('[Supabase] Insert failed:', error);
    return { ok: false, error };
  }

  return { ok: true, data };
}

export async function getCompanyRecords(companyId: string) {
  if (!supabase) return { ok: true, mock: true, data: [] };

  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('company_id', companyId);

  if (error) return { ok: false, error };
  return { ok: true, data };
}
