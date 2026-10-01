export type OrderStatus = "pending" | "confirmed" | "in_transit" | "delivered" | "paid" | "cancelled";
export type TournamentStatus = "pending" | "in_progress" | "active" | "completed" | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "in_transit",
  "delivered",
  "paid",
  "cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  in_transit: "في الطريق",
  delivered: "تم التسليم",
  paid: "تم القبض",
  cancelled: "ملغى",
};

export const TOURNAMENT_STATUSES: TournamentStatus[] = [
  "pending",
  "in_progress",
  "active",
  "completed",
  "cancelled",
];

export const TOURNAMENT_STATUS_LABELS: Record<TournamentStatus, string> = {
  pending: "مسودة (غير منشورة)",
  in_progress: "التسجيل مفتوح",
  active: "جارية الآن",
  completed: "انتهت",
  cancelled: "ملغاة",
};

export const PRIZE_DISTRIBUTION = [0.6, 0.3, 0.1] as const;

export const FREE_SHIPPING_THRESHOLD = 500;
export const SHIPPING_FEE = 35;

export function formatMAD(value: number): string {
  return `${new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 2 }).format(value)} د.م.`;
}

export function shippingFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
}

export function prizePayouts(pool: number): number[] {
  return PRIZE_DISTRIBUTION.map((part) => Math.round(pool * part));
}
