export type ProductSection = "gear" | "consoles" | "accounts" | "merch";

export const SECTION_LABELS: Record<ProductSection, string> = {
  gear: "عتاد الاحتراف",
  consoles: "أجهزة وألعاب",
  accounts: "شدات وحسابات",
  merch: "ملابس GM7",
};

export type Product = {
  id: string;
  name: string;
  section: ProductSection;
  price: number;
  oldPrice?: number;
  flash?: boolean;
  emoji: string;
  spec: string;
};

export const PRODUCTS: Product[] = [
  { id: "p1", name: "ماوس Gaming 16000 DPI", section: "gear", price: 249, oldPrice: 349, flash: true, emoji: "🖱️", spec: "RGB · 7 أزرار · سلك مضفر" },
  { id: "p2", name: "كلافي ميكانيكي RGB", section: "gear", price: 419, emoji: "⌨️", spec: "Blue Switch · عربي/إنجليزي" },
  { id: "p3", name: "هيدست 7.1 مع مايك", section: "gear", price: 329, oldPrice: 399, flash: true, emoji: "🎧", spec: "عزل ضجيج · USB + Jack" },
  { id: "p4", name: "كرسي Gaming مريح", section: "gear", price: 1490, emoji: "🪑", spec: "مسند قطني · ميلان 155°" },
  { id: "p5", name: "يد تحكم PS5 DualSense", section: "consoles", price: 690, emoji: "🎮", spec: "أصلية · ضمان 6 أشهر" },
  { id: "p6", name: "لعبة EA FC بنسخة السنة", section: "consoles", price: 549, oldPrice: 649, emoji: "⚽", spec: "PS5 / Xbox · نسخة أصلية" },
  { id: "p7", name: "ذاكرة SSD 1TB للـ PS5", section: "consoles", price: 1190, emoji: "💾", spec: "NVMe · مع مبرد" },
  { id: "p8", name: "شدات PUBG Mobile 660 UC", section: "accounts", price: 110, emoji: "💎", spec: "تعبئة فورية بالـ ID" },
  { id: "p9", name: "FC Points 1050", section: "accounts", price: 140, emoji: "🪙", spec: "تسليم في 15 دقيقة" },
  { id: "p10", name: "بطاقة PSN 20$", section: "accounts", price: 230, emoji: "🎟️", spec: "الحساب المغربي/الأمريكي" },
  { id: "p11", name: "تيشيرت GM7 الرسمي", section: "merch", price: 149, oldPrice: 199, flash: true, emoji: "👕", spec: "قطن 100% · S-XXL" },
  { id: "p12", name: "هودي L'GAMERS LMLA7", section: "merch", price: 299, emoji: "🧥", spec: "مبطن · طباعة مقاومة" },
  { id: "p13", name: "ماوس باد XL", section: "merch", price: 99, emoji: "🧩", spec: "90×40 سم · حواف مخيطة" },
  { id: "p14", name: "كاسكيط SNNSEI", section: "merch", price: 89, emoji: "🧢", spec: "مقاس قابل للتعديل" },
];

export const SECTIONS = Object.keys(SECTION_LABELS) as ProductSection[];
