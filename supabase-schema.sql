-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  plan TEXT NOT NULL DEFAULT 'Starter',
  category TEXT NOT NULL DEFAULT 'Business',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Requests table
CREATE TABLE IF NOT EXISTS public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hirings table
CREATE TABLE IF NOT EXISTS public.hirings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  category TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (client_id)
);

-- Admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default admin
INSERT INTO public.admins (id, password_hash) VALUES ('hassaan123', '$2a$10$dummy')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hirings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies (service role bypasses on server; anon restricted)
CREATE POLICY "Allow all for service_role" ON public.clients FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow all for service_role" ON public.requests FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow all for service_role" ON public.hirings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow all for service_role" ON public.subscriptions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow all for service_role" ON public.admins FOR ALL USING (auth.role() = 'service_role');
