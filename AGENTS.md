1. This app relied on supabase, supabase client and supabase ui. This app have realtime feature,Chat Variant (simpler pattern)
Same broadcast approach, but hook accepts roomName and username as props and uses dynamic channel name. Only one broadcast event type ('message'). No isLoading since messages are not pre-fetched from DB by the hook
2. This app use shadcn and tailwind for styling and components creation
3. Follows this structure folder :
  - /app for route and pages
  - /components for reusable UI components
  - /hooks for custom hooks
  - /lib/actions for utility server functions that connected to supabase
  - /lib/supabase for supabase configuration and connection

4. For create realtime, first, setup hooks under /hooks, then server functions under /lib/actions and finally consume these functions in the pages under /app.
5. Use pnpm for package management

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
