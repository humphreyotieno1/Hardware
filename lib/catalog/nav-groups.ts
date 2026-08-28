import { getCategoryMeta } from "@/lib/catalog/category-meta"

export type NavGroup = {
  id: string
  label: string
  href: string
  slugs: string[]
  image: string
  blurb: string
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "construction",
    label: "Construction",
    href: "/categories/building",
    slugs: ["building", "cement", "boards", "timber", "mabati", "tiling"],
    image: "/images/categories/building-materials.jpg",
    blurb: "Cement, timber, roofing and site materials",
  },
  {
    id: "tools",
    label: "Tools",
    href: "/categories/tools",
    slugs: ["tools", "brush", "sandpaper"],
    image: "/images/categories/hand-tools.jpg",
    blurb: "Hand tools, brushes and workshop supplies",
  },
  {
    id: "plumbing",
    label: "Plumbing",
    href: "/categories/plumbing",
    slugs: ["plumbing", "pipes", "pvc", "tanks"],
    image: "/images/categories/plumbing.jpg",
    blurb: "Pipes, fittings, tanks and sanitaryware",
  },
  {
    id: "electrical",
    label: "Electrical",
    href: "/categories/electricity",
    slugs: ["electricity", "wire"],
    image: "/images/categories/electrical.jpg",
    blurb: "Cables, fittings and electrical supplies",
  },
  {
    id: "hardware",
    label: "Hardware",
    href: "/shop",
    slugs: ["bolt", "nails", "screws", "locks", "padlocks", "tubes", "fencing"],
    image: "/images/categories/hardware.jpg",
    blurb: "Fixings, locks, fencing and steel sections",
  },
  {
    id: "paints",
    label: "Paints",
    href: "/categories/paints",
    slugs: ["paints"],
    image: "/images/categories/paint.jpg",
    blurb: "Paints, fillers and finishing",
  },
]

export const PRIMARY_NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function groupCategories<T extends { slug: string; name: string }>(categories: T[]) {
  return NAV_GROUPS.map((group) => ({
    ...group,
    image: group.image || getCategoryMeta(group.slugs[0] ?? "").image,
    items: group.slugs
      .map((slug) => categories.find((c) => c.slug === slug))
      .filter(Boolean) as T[],
  })).filter((group) => group.items.length > 0)
}
