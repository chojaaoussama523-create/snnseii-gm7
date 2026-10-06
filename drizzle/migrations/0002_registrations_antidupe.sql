ALTER TABLE public.tournament_registrations ADD COLUMN IF NOT EXISTS ip text NOT NULL DEFAULT '';
ALTER TABLE public.tournament_registrations ADD COLUMN IF NOT EXISTS device_id text NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS gm7_reg_game_whatsapp_idx ON public.tournament_registrations (game_id, whatsapp);
CREATE INDEX IF NOT EXISTS gm7_reg_game_platform_id_idx ON public.tournament_registrations (game_id, platform_id);
CREATE INDEX IF NOT EXISTS gm7_reg_game_ip_idx ON public.tournament_registrations (game_id, ip);
CREATE INDEX IF NOT EXISTS gm7_reg_game_device_idx ON public.tournament_registrations (game_id, device_id);
