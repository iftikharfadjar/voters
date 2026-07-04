Server Actions (lib/actions/<name>.ts)

'use server' file. 

Example pattern:

export interface Item {  
 id: string  
 // ... fields  
 created_at: string  
}

// Create — accepts client-generated id (inserted by hook)  
export async function createItem(data: { id: string; ...; created_at: string }) {  
  const supabase = await createClient()  
  const { error } = await supabase.from('<table>').insert({ ...data })  
  if (error) throw new Error(error.message)  
}

// Update — returns the row (not used by hook, but available for server use)  
export async function updateItem(id: string, data: { ... }) {  
  const supabase = await createClient()  
  const { data: item, error } = await supabase.from('<table>').update(data).eq('id', id).select().single()  
  if (error) throw new Error(error.message)  
  return item as Item
}

// Delete  
export async function deleteItem(id: string) {  
  const supabase = await createClient()  
  const { error } = await supabase.from('<table>').delete().eq('id', id)    
  if (error) throw new Error(error.message)  
}
