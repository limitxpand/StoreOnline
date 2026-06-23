-- STORE ONLINE - Database Schema for Supabase PostgreSQL
-- Run this in your Supabase SQL Editor

-- 1. USERS
-- Supabase handles Auth in the auth.users table, but we need a public profile table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'contributor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contributor_id UUID REFERENCES public.users(id),
  category_id UUID REFERENCES public.categories(id),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  is_free BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  type TEXT, -- e.g., 'MT4', 'MT5', 'APK', etc.
  file_url TEXT, -- Link to Appwrite or Supabase Storage for the compiled file
  source_code_url TEXT, -- Link to the uploaded source code (Admin only)
  image_url TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. ORDERS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  product_id UUID REFERENCES public.products(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_method TEXT, -- e.g., 'Cryptomus', 'Stripe'
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. LICENSES
CREATE TABLE public.licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id),
  user_id UUID REFERENCES public.users(id),
  product_id UUID REFERENCES public.products(id),
  license_key TEXT UNIQUE NOT NULL,
  hardware_lock_id TEXT, -- Hardware ID of the user's machine/account
  activation_limit INTEGER DEFAULT 1,
  activations_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. ROYALTIES (Ledger for Contributor Earnings)
CREATE TABLE public.royalties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id),
  contributor_id UUID REFERENCES public.users(id),
  product_id UUID REFERENCES public.products(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  admin_fee_percentage DECIMAL(5, 2) DEFAULT 30.00,
  contributor_amount DECIMAL(10, 2) NOT NULL,
  admin_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. WITHDRAWALS
CREATE TABLE public.withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contributor_id UUID REFERENCES public.users(id),
  amount DECIMAL(10, 2) NOT NULL,
  wallet_address TEXT NOT NULL, -- Crypto wallet
  currency TEXT DEFAULT 'USDT',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- 8. REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  product_id UUID REFERENCES public.products(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Row Level Security (RLS) policies (Examples)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Everyone can read approved products
CREATE POLICY "Public products are viewable by everyone." 
  ON public.products FOR SELECT 
  USING (status = 'approved');

-- Contributors can read their own pending/all products
CREATE POLICY "Contributors can view own products." 
  ON public.products FOR SELECT 
  USING (auth.uid() = contributor_id);
