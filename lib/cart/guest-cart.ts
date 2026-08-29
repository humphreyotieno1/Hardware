import type { Cart, CartItem, Product } from "@/lib/api/types"

const STORAGE_KEY = "grahad-guest-cart"

function emptyCart(): Cart {
  return { ID: "guest", user_id: "", cart_items: [] }
}

function read(): Cart {
  if (typeof window === "undefined") return emptyCart()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyCart()
    const parsed = JSON.parse(raw) as Cart
    return {
      ID: "guest",
      user_id: "",
      cart_items: Array.isArray(parsed.cart_items) ? parsed.cart_items : [],
    }
  } catch {
    return emptyCart()
  }
}

function write(cart: Cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
}

export const guestCart = {
  get(): Cart {
    return read()
  },

  add(product: Product, quantity = 1): Cart {
    const cart = read()
    const existing = cart.cart_items.find((item) => item.product_id === product.ID)
    if (existing) {
      existing.quantity += quantity
      existing.unit_price = product.price
      existing.product = product
    } else {
      const item: CartItem = {
        ID: `guest-${product.ID}`,
        product_id: product.ID,
        quantity,
        unit_price: product.price,
        product,
      }
      cart.cart_items.push(item)
    }
    write(cart)
    return cart
  },

  update(itemId: string, quantity: number): Cart {
    const cart = read()
    cart.cart_items = cart.cart_items
      .map((item) => (item.ID === itemId ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0)
    write(cart)
    return cart
  },

  remove(itemId: string): Cart {
    const cart = read()
    cart.cart_items = cart.cart_items.filter((item) => item.ID !== itemId)
    write(cart)
    return cart
  },

  clear(): Cart {
    const cart = emptyCart()
    write(cart)
    return cart
  },
}
