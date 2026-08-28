import {
  BoltIcon,
  BrushIcon,
  CableIcon,
  ConstructionIcon,
  Cylinder01Icon,
  DropletIcon,
  EraserIcon,
  FenceIcon,
  GridViewIcon,
  HammerIcon,
  House01Icon,
  Layers01Icon,
  LockIcon,
  LockKeyIcon,
  Package01Icon,
  PaintBucketIcon,
  PinIcon,
  PipelineIcon,
  ToolsIcon,
  Tree01Icon,
  WaterPumpIcon,
  Wrench01Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons"

const DEFAULT_IMAGE = "/images/categories/hardware.jpg"
const DEFAULT_ICON = ToolsIcon

type CategoryMeta = {
  image: string
  blurb: string
  icon: typeof ToolsIcon
}

const META: Record<string, CategoryMeta> = {
  boards: { image: "/images/categories/building-materials.jpg", blurb: "Boards, gypsum and sheet materials", icon: Layers01Icon },
  bolt: { image: "/images/categories/hardware.jpg", blurb: "Bolts and fixing hardware", icon: BoltIcon },
  brush: { image: "/images/categories/paint.jpg", blurb: "Brushes and applicators", icon: BrushIcon },
  building: { image: "/images/categories/building-materials.jpg", blurb: "Cement, steel, masonry and site materials", icon: ConstructionIcon },
  cement: { image: "/images/categories/building-materials.jpg", blurb: "Cement and related products", icon: Package01Icon },
  electricity: { image: "/images/categories/electrical.jpg", blurb: "Cables, fittings and electrical supplies", icon: ZapIcon },
  fencing: { image: "/images/categories/hardware.jpg", blurb: "Wire, mesh and fencing supplies", icon: FenceIcon },
  locks: { image: "/images/categories/hardware.jpg", blurb: "Locks and security hardware", icon: LockKeyIcon },
  mabati: { image: "/images/categories/building-materials.jpg", blurb: "Roofing sheets and accessories", icon: House01Icon },
  nails: { image: "/images/categories/hardware.jpg", blurb: "Nails and fasteners", icon: PinIcon },
  pvc: { image: "/images/categories/plumbing.jpg", blurb: "PVC fittings and accessories", icon: PipelineIcon },
  padlocks: { image: "/images/categories/hardware.jpg", blurb: "Padlocks and security", icon: LockIcon },
  paints: { image: "/images/categories/paint.jpg", blurb: "Paints, fillers and finishing", icon: PaintBucketIcon },
  pipes: { image: "/images/categories/plumbing.jpg", blurb: "Pipes for plumbing and site work", icon: PipelineIcon },
  plumbing: { image: "/images/categories/plumbing.jpg", blurb: "Pipes, fittings and sanitaryware", icon: DropletIcon },
  sandpaper: { image: "/images/categories/paint.jpg", blurb: "Abrasives and finishing", icon: EraserIcon },
  screws: { image: "/images/categories/hardware.jpg", blurb: "Screws and fixings", icon: Wrench01Icon },
  tanks: { image: "/images/categories/plumbing.jpg", blurb: "Water tanks and storage", icon: WaterPumpIcon },
  tiling: { image: "/images/categories/tiles.jpg", blurb: "Tiles, grout and tiling supplies", icon: GridViewIcon },
  timber: { image: "/images/categories/building-materials.jpg", blurb: "Timber and wood products", icon: Tree01Icon },
  tools: { image: "/images/categories/hand-tools.jpg", blurb: "Hand tools for site and workshop", icon: HammerIcon },
  tubes: { image: "/images/categories/hardware.jpg", blurb: "Tubes and steel sections", icon: Cylinder01Icon },
  wire: { image: "/images/categories/electrical.jpg", blurb: "Wire and cabling", icon: CableIcon },
}

export function getCategoryMeta(slug: string): CategoryMeta {
  return META[slug] ?? { image: DEFAULT_IMAGE, blurb: "Hardware and construction supplies", icon: DEFAULT_ICON }
}

export const HIDDEN_CATEGORY_SLUGS = new Set(["service", "system"])
