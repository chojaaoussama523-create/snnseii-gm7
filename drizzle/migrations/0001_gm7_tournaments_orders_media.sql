CREATE TABLE public.gm7_active_tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'other',
  platform text NOT NULL DEFAULT 'PC',
  game_id text NOT NULL DEFAULT '',
  game_name text NOT NULL DEFAULT '',
  game_logo_url text NOT NULL DEFAULT '',
  banner_url text NOT NULL DEFAULT '',
  thumb_url text NOT NULL DEFAULT '',
  format text NOT NULL DEFAULT 'knockout',
  team_mode integer NOT NULL DEFAULT 1,
  prize_pool numeric NOT NULL DEFAULT 0,
  max_slots integer NOT NULL DEFAULT 8,
  status text NOT NULL DEFAULT 'pending',
  bracket_state jsonb NOT NULL DEFAULT '{}'::jsonb,
  starts_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gm7_tournament_status_check CHECK (status IN ('pending','in_progress','active','completed','cancelled')),
  CONSTRAINT gm7_tournament_format_check CHECK (format IN ('knockout','double','groups')),
  CONSTRAINT gm7_tournament_mode_check CHECK (team_mode BETWEEN 1 AND 5)
);

GRANT SELECT ON public.gm7_active_tournaments TO anon;
GRANT SELECT ON public.gm7_active_tournaments TO authenticated;
GRANT ALL ON public.gm7_active_tournaments TO service_role;
ALTER TABLE public.gm7_active_tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads published tournaments" ON public.gm7_active_tournaments FOR SELECT TO anon, authenticated USING (status <> 'pending');

CREATE TABLE public.gm7_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  notes text NOT NULL DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  shipping numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gm7_order_status_check CHECK (status IN ('pending','confirmed','in_transit','delivered','paid','cancelled'))
);

GRANT ALL ON public.gm7_orders TO service_role;
ALTER TABLE public.gm7_orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.gm7_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  platform text NOT NULL DEFAULT 'youtube',
  kind text NOT NULL DEFAULT 'video',
  url text NOT NULL,
  embed_url text NOT NULL DEFAULT '',
  is_live boolean NOT NULL DEFAULT false,
  sort integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gm7_media_platform_check CHECK (platform IN ('kick','youtube','tiktok','instagram')),
  CONSTRAINT gm7_media_kind_check CHECK (kind IN ('live','video','short','playlist','clip'))
);

GRANT SELECT ON public.gm7_media TO anon;
GRANT SELECT ON public.gm7_media TO authenticated;
GRANT ALL ON public.gm7_media TO service_role;
ALTER TABLE public.gm7_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads media" ON public.gm7_media FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public.tournament_registrations ADD COLUMN IF NOT EXISTS tournament_id uuid REFERENCES public.gm7_active_tournaments(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS gm7_reg_tournament_idx ON public.tournament_registrations (tournament_id);
