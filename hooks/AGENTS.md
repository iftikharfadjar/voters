Hook (hooks/use-realtime-<name>.tsx) 

'use client' — broadcast-based channel (NOT postgres_changes).

Structure:
- CHANNEL_NAME constant (unique per table)
- State: [items, setItems], [channel, setChannel], [isConnected, setIsConnected], [isLoading, setIsLoading]
- useEffect 1 — fetch initial data via supabase.from('<table>').select('*'), set isLoading
- useEffect 2 — create supabase.channel(CHANNEL_NAME), listen for 3 broadcast events (INSERT, UPDATE, DELETE), subscribe with setIsConnected, store channel, cleanup with removeChannel
- create* — guard (!channel || !isConnected), build object with { id: crypto.randomUUID(), ..., created_at: new Date().toISOString() }, optimistic setItems, await channel.send({ type: 'broadcast', event: 'INSERT', payload }), void action(data)
- update* — guard, optimistic setItems, broadcast full patched object, void action(id, data)
- delete* — guard, optimistic setItems filter, broadcast id, void action(id)
Return: { items, create*, update*, delete*, isConnected, isLoading }
