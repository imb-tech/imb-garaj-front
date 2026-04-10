# Project Guidelines

## Overview

- **Project:** IMB Logistic — China logistics management system (branch: `imb-xitoy`)
- **Stack:** React + TypeScript, Vite, TanStack Router, Tailwind CSS
- **API:** REST backend at `https://api.garage.imbtech.uz/api/v1`
- **State/Data:** TanStack Query for server state, Zustand for client state
- **UI:** shadcn/ui components, Tailwind CSS for styling

## Code Style

- No more than 600 lines of code per file. Split into smaller modules if needed.
- Follow clean code rules for better maintainability

## Project Structure

- `src/pages/` — Page components (file-based routing via TanStack Router)
- `src/components/` — Reusable UI components
- `src/services/` — API service layers
- `src/hooks/` — Custom React hooks
- `src/store/` — Zustand stores
- `src/types/` — TypeScript type definitions
- `src/lib/` — Utility functions
- `src/layouts/` — Layout components
- `src/routes/` — Route definitions (auto-generated `routeTree.gen.ts`)
