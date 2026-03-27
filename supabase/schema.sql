-- Create tables
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE realisations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    stack TEXT[] NOT NULL,
    live_url TEXT,
    github_url TEXT,
    is_confidential BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE avis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_role TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE realisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE avis ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for messages
CREATE POLICY "Allow public insert on messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated select on messages" ON messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on messages" ON messages FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for realisations
CREATE POLICY "Allow public select on realisations" ON realisations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on realisations" ON realisations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on realisations" ON realisations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on realisations" ON realisations FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for avis
CREATE POLICY "Allow public select on avis" ON avis FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on avis" ON avis FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on avis" ON avis FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on avis" ON avis FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for push_subscriptions
CREATE POLICY "Allow public insert on push_subscriptions" ON push_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated select on push_subscriptions" ON push_subscriptions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on push_subscriptions" ON push_subscriptions FOR DELETE USING (auth.role() = 'authenticated');
