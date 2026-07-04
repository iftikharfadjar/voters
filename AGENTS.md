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
