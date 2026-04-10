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

## Branch: imb-xitoy — China Logistics

### What's been done

- **Sidebar cleanup:** Removed Investor, Moliya, Rollar nav items — not needed for this project
- **Locations page (`/locations`):** Rebuilt from countries/regions/districts CRUD into a map-based location system
  - DataTable listing locations with Name and Type (Yuklash/Tushirish) columns
  - Uses hardcoded mock data (`mock-data.ts`) — no backend yet
  - `/locations/$id` — Edit page with Google Maps polygon drawing (adapted from hr-shadcn)
  - `/locations/create` — New location page, same map UI
  - POST/PATCH disabled, logs to console with toast until backend is ready
- **Managers trips (`/managers`):**
  - "Aylanma statusi" changed to Faol / Faol emas (was Band/Bo'sh/Ta'mirda)
  - Removed columns: Tushum (uzs), Tushum (usd), Kutilayotgan reyslar
- **Bug fix:** Fixed broken import in `driver-cols.tsx` (`formatPhoneNumber` path)

### Agenda / TODO

- Backend API for `common/locations` — once ready, swap mock data for `useGet`/`usePost`/`usePatch`
- Location types from backend — confirm if `loading`/`unloading` matches API enum
- Polygon data format — confirm GeoJSON Polygon structure matches backend expectations
- Aylanma logic — daily rotation, needs backend field to determine Faol/Faol emas based on today's aylanma
- Moliya & Investor pages — removed from nav but code still exists, can be cleaned up later if not needed
