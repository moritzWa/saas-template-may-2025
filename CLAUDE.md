# Project Instructions

## Before completing any task

Run type checks and linting on both client and server:

```bash
# Client (Next.js)
cd client && npx tsc --noEmit && npx eslint src/

# Server (Deno)
cd server && deno check src/index.ts
```

Fix all errors and warnings before saying the task is done.

## File Naming

- **PascalCase** for custom components: `Navbar.tsx`, `LoginForm.tsx`
- **kebab-case** for shadcn UI components: `components/ui/*.tsx` (generated, leave as-is)
- **lowercase** for pages: `pages/*.tsx` (Next.js convention)

## Code Style & Quality

**Prefer descriptive names and clean code patterns.**

- **Descriptive names over brevity** - even if longer
  - `attachedFilesToRemove`, `getProjectFileIdsInSpecificContext`
  - Not: `filesToRemove`, `getIds`
- **Apply refactoring patterns** - Split Phase, Extract Function, etc.
- **Readability first** - separate filter/map operations, use intermediate variables with clear names
- **No unnecessary comments** - good variable names make code self-explanatory
- **Constants naming** - use `camelCase` for file-scoped constants, `SCREAMING_SNAKE_CASE` only for exported/global constants
- **No barrel re-exports** - avoid `index.ts` files that re-export from sub-paths. Import directly from the source file instead (helps TS performance and code navigation)
- **Prefer utility libraries when native JS is verbose or hacky** - e.g. `format(date, "yyyy-MM-dd")` over `date.toISOString().split("T")[0]`
