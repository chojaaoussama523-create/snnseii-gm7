import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { shippingFor, type OrderStatus } from "@/lib/gm7-format";

export type OrderItem = { id: string; name: string; price: number; qty: number };

export type Order = {
  orderCode: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

type DbRow = {
  order_code: string;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  items: unknown;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  created_at: string;
};

function toDto(r: DbRow): Order {
  return {
    orderCode: r.order_code,
    customerName: r.customer_name,
    phone: r.phone,
    city: r.city,
    address: r.address,
    notes: r.notes,
    items: Array.isArray(r.items) ? (r.items as OrderItem[]) : [],
    subtotal: Number(r.subtotal),
    shipping: Number(r.shipping),
    total: Number(r.total),
    status: r.status as OrderStatus,
    createdAt: r.created_at,
  };
}

function checkAdmin(code: string) {
  const expected = process.env["GM7_ADMIN_ACCESS_CODE"];
  if (!expected || code.trim() !== expected) throw new Error("Unauthorized");
}

const createSchema = z.object({
  customerName: z.string().trim().min(3).max(60),
  phone: z.string().trim().regex(/^0[67][0-9]{8}$/, "رقم الهاتف غير صالح"),
  city: z.string().trim().min(2).max(40),
  address: z.string().trim().min(5).max(200),
  notes: z.string().trim().max(300).default(""),
  items: z
    .array(
      z.object({
        id: z.string().max(40),
        name: z.string().max(120),
        price: z.number().min(0).max(100_000),
        qty: z.number().int().min(1).max(50),
      }),
    )
    .min(1)
    .max(40),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => createSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const subtotal = data.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = shippingFor(subtotal);
    const orderCode = `GM7-${crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`;
    const { data: row, error } = await supabaseAdmin
      .from("gm7_orders")
      .insert({
        order_code: orderCode,
        customer_name: data.customerName,
        phone: data.phone,
        city: data.city,
        address: data.address,
        notes: data.notes,
        items: data.items,
        subtotal,
        shipping,
        total: subtotal + shipping,
      })
      .select("*")
      .single();
    if (error || !row) throw new Error("تعذر إنشاء الطلب");
    return toDto(row as DbRow);
  });

export const getOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ orderCode: z.string().trim().max(20) }).parse(d))
  .handler(async ({ data }): Promise<Order | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("gm7_orders")
      .select("*")
      .eq("order_code", data.orderCode.toUpperCase())
      .maybeSingle();
    return row ? toDto(row as DbRow) : null;
  });

export const adminListOrders = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ access: z.string().max(64) }).parse(d))
  .handler(async ({ data }) => {
    checkAdmin(data.access);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("gm7_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    return ((rows ?? []) as DbRow[]).map(toDto);
  });

export const adminUpdateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        access: z.string().max(64),
        orderCode: z.string().max(20),
        status: z.enum(["pending", "confirmed", "in_transit", "delivered", "paid", "cancelled"]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    checkAdmin(data.access);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("gm7_orders")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("order_code", data.orderCode);
    return { ok: true };
  });
