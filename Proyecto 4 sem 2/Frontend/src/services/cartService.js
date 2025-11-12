// Servicio de Carrito usando localStorage
// Clave única para el carrito
const CART_KEY = 'cart';

function safeParse(json, fallback) {
  try { return JSON.parse(json); } catch { return fallback; }
}

export function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  const items = safeParse(raw, []);
  // Normaliza estructura por si hay claves antiguas
  return Array.isArray(items) ? items.map((it) => ({
    id: it.id,
    name: it.name || it.nombre,
    price: it.price ?? it.precio ?? 0,
    imageUrl: it.imageUrl || it.imagenUrl || '',
    category: it.category || it.categoria || '',
    quantity: Math.max(1, Number(it.quantity ?? it.cantidad ?? 1)),
  })) : [];
}

export function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  // Notifica a la app (útil para badges en header, etc.)
  window.dispatchEvent(new CustomEvent('cart:update', { detail: { items } }));
}

export function clearCart() {
  setCart([]);
}

export function addItem(product, qty = 1) {
  const items = getCart();
  const index = items.findIndex((i) => String(i.id) === String(product.id));
  if (index >= 0) {
    items[index].quantity = Math.max(1, items[index].quantity + qty);
  } else {
    items.push({
      id: product.id,
      name: product.name || product.nombre,
      price: product.price ?? product.precio ?? 0,
      imageUrl: product.imageUrl || product.imagenUrl || '',
      category: product.category || product.categoria || '',
      quantity: Math.max(1, qty),
    });
  }
  setCart(items);
  return items;
}

export function removeItem(id) {
  const items = getCart().filter((i) => String(i.id) !== String(id));
  setCart(items);
  return items;
}

export function updateQuantity(id, qty) {
  const n = Math.max(1, Number(qty) || 1);
  const items = getCart().map((i) => String(i.id) === String(id) ? { ...i, quantity: n } : i);
  setCart(items);
  return items;
}

export function getCount() {
  return getCart().reduce((acc, it) => acc + (Number(it.quantity) || 0), 0);
}

export function getSubtotal() {
  return getCart().reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
}

export const __internal = { CART_KEY };
