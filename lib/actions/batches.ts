"use server";

import { createClient } from "@/lib/supabase/server";

export interface Batch {
  id: string;
  project_id: string;
  name: string;
  status: string;
  created_at: string;
}

export async function createBatch(data: {
  id: string
  project_id: string
  name: string
  status: string
  created_at: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from('voters_batches').insert({
    id: data.id,
    project_id: data.project_id,
    name: data.name,
    status: data.status,
    created_at: data.created_at,
  })

  if (error) throw new Error(error.message)
}

export async function updateBatch(
  id: string,
  data: { name?: string; status?: string },
) {
  const supabase = await createClient();

  const { data: batch, error } = await supabase
    .from("voters_batches")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return batch as Batch;
}

export async function deleteBatch(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("voters_batches").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
