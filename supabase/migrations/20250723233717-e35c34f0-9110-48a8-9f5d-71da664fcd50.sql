-- Create profiles table for user authentication
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  health INTEGER NOT NULL DEFAULT 100,
  max_health INTEGER NOT NULL DEFAULT 100,
  energy INTEGER NOT NULL DEFAULT 100,
  max_energy INTEGER NOT NULL DEFAULT 100,
  currency INTEGER NOT NULL DEFAULT 1000,
  is_kidnapped BOOLEAN NOT NULL DEFAULT false,
  kidnap_release_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create game items table
CREATE TABLE public.game_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('weapon', 'armor', 'utility', 'consumable', 'special')),
  effect JSONB NOT NULL DEFAULT '{}',
  price INTEGER NOT NULL DEFAULT 0,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user items table (inventory)
CREATE TABLE public.user_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.game_items(id) ON DELETE CASCADE,
  equipped BOOLEAN NOT NULL DEFAULT false,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create battles table
CREATE TABLE public.battles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attacker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  defender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  winner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attacker_snapshot JSONB NOT NULL,
  defender_snapshot JSONB NOT NULL,
  reward_currency INTEGER NOT NULL DEFAULT 0,
  reward_item_id UUID REFERENCES public.game_items(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create marketplace listings table
CREATE TABLE public.marketplace_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.game_items(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for game_items (public read access)
CREATE POLICY "Anyone can view game items" ON public.game_items FOR SELECT USING (true);

-- RLS Policies for user_items
CREATE POLICY "Users can view their own items" ON public.user_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own items" ON public.user_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own items" ON public.user_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own items" ON public.user_items FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for battles
CREATE POLICY "Users can view battles they participated in" ON public.battles FOR SELECT 
  USING (auth.uid() = attacker_id OR auth.uid() = defender_id);
CREATE POLICY "Users can create battles as attacker" ON public.battles FOR INSERT 
  WITH CHECK (auth.uid() = attacker_id);

-- RLS Policies for marketplace
CREATE POLICY "Anyone can view active marketplace listings" ON public.marketplace_listings FOR SELECT 
  USING (active = true);
CREATE POLICY "Users can create their own listings" ON public.marketplace_listings FOR INSERT 
  WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update their own listings" ON public.marketplace_listings FOR UPDATE 
  USING (auth.uid() = seller_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'Player_' || substr(NEW.id::text, 1, 8)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample game items
INSERT INTO public.game_items (name, description, category, effect, price, rarity) VALUES
('Brass Knuckles', 'Increases attack power in close combat', 'weapon', '{"attack_power": 15}', 500, 'common'),
('Steel Katana', 'Sharp blade from the east', 'weapon', '{"attack_power": 35}', 2000, 'rare'),
('Dragon Blade', 'Legendary weapon of ancient warriors', 'weapon', '{"attack_power": 75, "xp_multiplier": 1.2}', 10000, 'legendary'),
('Kevlar Vest', 'Basic protection against bullets', 'armor', '{"defense_boost": 20}', 800, 'common'),
('Titanium Armor', 'Military-grade protection', 'armor', '{"defense_boost": 50, "max_health": 25}', 5000, 'epic'),
('Energy Drink', 'Restores energy quickly', 'consumable', '{"energy_boost": 50}', 100, 'common'),
('Steroid Injection', 'Dangerous but effective enhancement', 'consumable', '{"health_boost": 30, "attack_power": 10}', 300, 'rare'),
('Lucky Charm', 'Increases your chances in combat', 'utility', '{"steal_chance": 0.15}', 1500, 'rare');