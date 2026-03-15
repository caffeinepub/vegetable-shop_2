# Vegetable Shop

## Current State
New project. No existing frontend or backend code.

## Requested Changes (Diff)

### Add
- Product catalog page displaying vegetables with photo, name, price, description, category, and stock status
- Shopping cart (sidebar/drawer) with item list, quantities, subtotal, and checkout summary
- Order summary view with itemized list and total
- Admin management panel (protected by login) for:
  - Listing all vegetables
  - Adding a new vegetable (name, price, description, category, stock availability, image upload)
  - Editing an existing vegetable's details
  - Removing a vegetable
- Sample seed data: 8–10 vegetables across categories (leafy greens, root vegetables, etc.)
- Image support via blob-storage for vegetable photos
- Authorization to protect the admin panel (admin-only access)

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan

### Backend (Motoko)
- `Vegetable` data type: id, name, price (Float), description, category, stockAvailable (Bool), imageUrl (Text)
- CRUD endpoints: createVegetable, updateVegetable, deleteVegetable, getVegetables, getVegetable
- Seed initial vegetables on first deploy
- Authorization: admin role check on create/update/delete
- Blob-storage integration for vegetable images

### Frontend
- **Public pages**:
  - Home/Catalog: grid of vegetable cards with photo, name, price, category badge, stock indicator, "Add to Cart" button
  - Cart drawer: slide-in panel showing cart items, quantities (increment/decrement/remove), subtotal, and order summary with total
- **Admin panel** (login-gated):
  - Vegetable list table with edit and delete actions
  - Add/Edit form: name, price, description, category (select), stock toggle, image upload
  - Confirmation dialog for deletes
- Navigation: logo/brand, Shop link, Cart icon with badge, Admin link
- Design: clean, fresh green-toned UI with white backgrounds, vegetable imagery
