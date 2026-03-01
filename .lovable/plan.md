

## Plan: Mobile Shop Website (Frontend Only)

This is a completely new project direction -- a mobile phone shop e-commerce site replacing the existing habit tracker. I will build the full UI with mock data, role-based routing, and all requested pages.

### Architecture

```text
Routes:
  /                  - Home (offers banner, featured mobiles, shop info)
  /login             - Login page
  /signup            - Signup page
  /mobiles           - Browse all mobiles
  /mobiles/:id       - Mobile detail page
  /cart              - Cart page
  /admin             - Admin dashboard
  /admin/mobiles     - Admin CRUD mobiles
  /admin/offers      - Admin manage offers
  /admin/orders      - Admin view orders
```

### New Files to Create

**Data & State:**
- `src/lib/mock-data.ts` -- Mock mobiles, offers, users, orders
- `src/context/AuthContext.tsx` -- Auth state (user/admin role, login/logout)
- `src/context/CartContext.tsx` -- Cart state (add/remove/clear)

**Layout Components:**
- `src/components/layout/Navbar.tsx` -- Top nav with logo, links, cart icon, auth
- `src/components/layout/Footer.tsx` -- Shop info, timing, map, WhatsApp button
- `src/components/layout/AdminSidebar.tsx` -- Admin nav sidebar

**User Pages:**
- `src/pages/Home.tsx` -- Offers carousel, featured mobiles grid, shop location/timing
- `src/pages/Login.tsx` -- Login form (email + password, role toggle for demo)
- `src/pages/Signup.tsx` -- Signup form
- `src/pages/Mobiles.tsx` -- Grid of mobiles with search/filter
- `src/pages/MobileDetail.tsx` -- Full detail page with images, specs, price, add-to-cart, "few left" badge, WhatsApp button
- `src/pages/Cart.tsx` -- Cart items, quantity, total, place order button

**Admin Pages:**
- `src/pages/admin/Dashboard.tsx` -- Overview stats
- `src/pages/admin/ManageMobiles.tsx` -- Table with add/edit/delete modals
- `src/pages/admin/ManageOffers.tsx` -- CRUD offers
- `src/pages/admin/Orders.tsx` -- View orders, notification badges

**Shared Components:**
- `src/components/MobileCard.tsx` -- Product card used in grids
- `src/components/OfferBanner.tsx` -- Scrollable offers banner
- `src/components/ShopInfo.tsx` -- Google Maps embed + timing
- `src/components/WhatsAppButton.tsx` -- Floating WhatsApp chat button
- `src/components/ProtectedRoute.tsx` -- Route guard for auth/admin

### Files to Modify

- `src/App.tsx` -- Replace routes with new shop routes, wrap with AuthProvider + CartProvider
- `src/index.css` -- Update theme colors (blue/indigo e-commerce theme instead of green productivity theme)
- `tailwind.config.ts` -- Minor color adjustments
- `index.html` -- Update title to "MobileShop"

### Design System Changes

- Primary color: shift from green (productivity) to blue/indigo (e-commerce)
- Keep dark mode support
- Mobile-first responsive design
- Add e-commerce specific utilities (price badge, stock indicator, offer ribbon)

### Key UI Details

- **Stock indicator**: Red "Only X left!" badge when stock < 5
- **WhatsApp button**: Floating button using `https://wa.me/<number>?text=...` with pre-filled cart details
- **Google Maps**: iframe embed with configurable coordinates
- **Shop timing**: Simple display component with open/closed status
- **Cart**: localStorage-persisted, badge count on navbar
- **Admin protection**: ProtectedRoute checks role from AuthContext
- **Notifications**: Toast notifications when order is placed (admin sees them in dashboard)

### Technical Notes

- All data is mock/localStorage for now (backend-ready structure)
- Auth is simulated with localStorage JWT-like tokens
- Image uploads in admin use file input preview (no actual upload without backend)
- Existing habit tracker components (`GrowthRing`, `HabitTracker`, `WorkTimer`, etc.) will no longer be routed to but are kept in the codebase

