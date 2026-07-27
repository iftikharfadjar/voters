# Graph Report - .  (2026-07-27)

## Corpus Check
- 198 files · ~86,953 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 462 nodes · 801 edges · 40 communities (23 shown, 17 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.82)
- Token cost: 9,800 input · 4,200 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38

## God Nodes (most connected - your core abstractions)
1. `cn()` - 32 edges
2. `createClient()` - 27 edges
3. `createClient()` - 27 edges
4. `Next.js Best Practices Skill` - 19 edges
5. `compilerOptions` - 17 edges
6. `Button` - 16 edges
7. `CLI Reference` - 11 edges
8. `Registry Authoring` - 11 edges
9. `Card` - 10 edges
10. `CardContent` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Project Folder Structure` --semantically_similar_to--> `App Router File Conventions`  [INFERRED] [semantically similar]
  AGENTS.md → .agents/skills/next-best-practices/file-conventions.md
- `DropdownMenuShortcut()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts
- `Next.js + Supabase Starter Kit` --conceptually_related_to--> `pnpm`  [INFERRED]
  README.md → AGENTS.md
- `GET()` --calls--> `createClient()`  [EXTRACTED]
  app/auth/confirm/route.ts → lib/supabase/server.ts
- `ChatPage()` --calls--> `createClient()`  [EXTRACTED]
  app/chat/page.tsx → lib/supabase/client.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Next.js Best Practices Skill Collection** — _agents_skills_next_best_practices_skill_md_nextjs_best_practices, _agents_skills_next_best_practices_file_conventions_md_file_conventions, _agents_skills_next_best_practices_rsc_boundaries_md_rsc_boundaries, _agents_skills_next_best_practices_async_patterns_md_async_apis, _agents_skills_next_best_practices_runtime_selection_md_runtime_selection, _agents_skills_next_best_practices_directives_md_directives, _agents_skills_next_best_practices_functions_md_functions, _agents_skills_next_best_practices_error_handling_md_error_handling, _agents_skills_next_best_practices_data_patterns_md_data_patterns, _agents_skills_next_best_practices_route_handlers_md_route_handlers, _agents_skills_next_best_practices_metadata_md_metadata_api, _agents_skills_next_best_practices_image_md_image_optimization, _agents_skills_next_best_practices_font_md_font_optimization, _agents_skills_next_best_practices_bundling_md_bundling, _agents_skills_next_best_practices_scripts_md_scripts, _agents_skills_next_best_practices_hydration_error_md_hydration_errors, _agents_skills_next_best_practices_suspense_boundaries_md_suspense_boundaries, _agents_skills_next_best_practices_parallel_routes_md_parallel_routes, _agents_skills_next_best_practices_self_hosting_md_self_hosting, _agents_skills_next_best_practices_debug_tricks_md_debug_tricks [EXTRACTED 1.00]
- **MCP Server Tool Set** — agents_skills_shadcn_mcp_get_project_registries, agents_skills_shadcn_mcp_list_items, agents_skills_shadcn_mcp_search_items, agents_skills_shadcn_mcp_view_items, agents_skills_shadcn_mcp_get_item_examples, agents_skills_shadcn_mcp_get_add_command, agents_skills_shadcn_mcp_get_audit_checklist [EXTRACTED 1.00]
- **CLI Command Set** — agents_skills_shadcn_cli_init_command, agents_skills_shadcn_cli_apply_command, agents_skills_shadcn_cli_add_command, agents_skills_shadcn_cli_search_command, agents_skills_shadcn_cli_view_command, agents_skills_shadcn_cli_docs_command, agents_skills_shadcn_cli_info_command, agents_skills_shadcn_cli_build_command [EXTRACTED 1.00]
- **Registry Address Schemes** — agents_skills_shadcn_registry_address_schemes, agents_skills_shadcn_registry_registry_dependencies, agents_skills_shadcn_registry_github_registries [EXTRACTED 1.00]
- **Eliminating Waterfalls Rule Group** — agents_skills_vercel_react_best_practices_rules_async_api_routes, agents_skills_vercel_react_best_practices_rules_async_cheap_condition_before_await, agents_skills_vercel_react_best_practices_rules_async_defer_await, agents_skills_vercel_react_best_practices_rules_async_dependencies, agents_skills_vercel_react_best_practices_rules_async_parallel, agents_skills_vercel_react_best_practices_rules_async_suspense_boundaries [EXTRACTED 1.00]
- **Bundle Size Optimization Rule Group** — agents_skills_vercel_react_best_practices_rules_bundle_analyzable_paths, agents_skills_vercel_react_best_practices_rules_bundle_barrel_imports, agents_skills_vercel_react_best_practices_rules_bundle_conditional, agents_skills_vercel_react_best_practices_rules_bundle_defer_third_party, agents_skills_vercel_react_best_practices_rules_bundle_dynamic_imports, agents_skills_vercel_react_best_practices_rules_bundle_preload [EXTRACTED 1.00]
- **useEffectEvent-based Stable Callback Patterns** — agents_skills_vercel_react_best_practices_rules_advanced_effect_event_deps, agents_skills_vercel_react_best_practices_rules_advanced_event_handler_refs, agents_skills_vercel_react_best_practices_rules_advanced_use_latest, useeffectevent [EXTRACTED 1.00]
- **Server CRUD Operations** — lib_actions_agents_md_createitem, lib_actions_agents_md_updateitem, lib_actions_agents_md_deleteitem [EXTRACTED 1.00]

## Communities (40 total, 17 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (23): ForgotPasswordForm(), LoginForm(), SignUpForm(), Badge(), BadgeProps, badgeVariants, Button, ButtonProps (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (31): GET(), UserDetails(), FetchDataSteps(), Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), BatchItem() (+23 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (46): add Command, apply Command, build Command, CLI Reference, docs Command, info Command, init Command, search Command (+38 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (21): AuthButton(), DeployButton(), EnvVarWarning(), Hero(), LogoutButton(), NextLogo(), SupabaseLogo(), ThemeSwitcher() (+13 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (31): autoprefixer, eslint, eslint-config-next, @eslint/eslintrc, devDependencies, autoprefixer, eslint, eslint-config-next (+23 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (21): ChatPage(), Page(), VotersPage(), ChatMessageItem(), ChatMessageItemProps, RealtimeChat(), RealtimeChatProps, ProjectItem() (+13 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (31): class-variance-authority, clsx, lucide-react, next, next-themes, dependencies, class-variance-authority, clsx (+23 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+20 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (22): Async API Patterns, Bundling Solutions, Data Fetching Patterns, Debug Tricks and MCP Endpoint, React and Next.js Directives, Error Handling Patterns, App Router File Conventions, Font Optimization (next/font) (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (11): Prevent Waterfall Chains in API Routes, Check Cheap Conditions Before Async Flags, Defer Await Until Needed, Dependency-Based Parallelization, Promise.all() for Independent Operations, Strategic Suspense Boundaries, Eliminating Waterfalls, better-all (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.20
Nodes (9): mcp, shadcn, $schema, command, enabled, type, mcp, npx (+1 more)

### Community 12 - "Community 12"
Cohesion: 0.31
Nodes (7): CheckIcon(), CodeBlock(), CopyIcon(), client, create, rls, server

### Community 13 - "Community 13"
Cohesion: 0.28
Nodes (9): Broadcast-based Channel Pattern, CRUD Broadcast Events, Optimistic Update Pattern, createClient, createItem, deleteItem, Item Interface, Server Action Pattern (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.25
Nodes (8): pnpm, shadcn/ui, Supabase, Tailwind CSS, Password-based Authentication, Next.js + Supabase Starter Kit, supabase-ssr, Vercel Deployment Integration

### Community 15 - "Community 15"
Cohesion: 0.36
Nodes (8): Prefer Statically Analyzable Paths, Avoid Barrel File Imports, Conditional Module Loading, Defer Non-Critical Third-Party Libraries, Dynamic Imports for Heavy Components, Preload Based on User Intent, Bundle Size Optimization, next/dynamic

### Community 16 - "Community 16"
Cohesion: 0.38
Nodes (5): IMPORTANT: If you remove getClaims() and you use server-side rendering, IMPORTANT: You *must* return the supabaseResponse object as it is., updateSession(), config, proxy()

### Community 17 - "Community 17"
Cohesion: 0.60
Nodes (6): Do Not Put Effect Events in Dependency Arrays, Store Event Handlers in Refs, Initialize App Once, Not Per Mount, useEffectEvent for Stable Callback Refs, Advanced Patterns, useEffectEvent

### Community 18 - "Community 18"
Cohesion: 0.40
Nodes (6): Deduplicate Global Event Listeners, Version and Minimize localStorage Data, Use Passive Event Listeners for Scrolling Performance, Use SWR for Automatic Deduplication, Client-Side Data Fetching, SWR

### Community 19 - "Community 19"
Cohesion: 0.50
Nodes (5): Avoid Layout Thrashing, Cache Repeated Function Calls, Cache Property Access in Loops, JavaScript Performance, Module-Level Cache Pattern

### Community 20 - "Community 20"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 23 - "Community 23"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

## Knowledge Gaps
- **156 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `metadata`, `geistSans`, `$schema` (+151 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 0` to `Community 1`, `Community 3`, `Community 5`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 5` to `Community 0`, `Community 1`, `Community 3`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 1` to `Community 3`, `Community 5`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `metadata` to the rest of the system?**
  _156 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1273469387755102 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10730804810360776 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05893719806763285 - nodes in this community are weakly interconnected._