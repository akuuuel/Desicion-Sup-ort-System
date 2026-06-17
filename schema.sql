-- Create kriteria table
CREATE TABLE IF NOT EXISTS kriteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    tipe TEXT NOT NULL CHECK (tipe IN ('benefit', 'cost')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alternatif table
CREATE TABLE IF NOT EXISTS alternatif (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    alamat TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matriks_ahp table
CREATE TABLE IF NOT EXISTS matriks_ahp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kriteria_1_id UUID REFERENCES kriteria(id) ON DELETE CASCADE,
    kriteria_2_id UUID REFERENCES kriteria(id) ON DELETE CASCADE,
    nilai NUMERIC NOT NULL,
    UNIQUE(kriteria_1_id, kriteria_2_id)
);

-- Create penilaian table
CREATE TABLE IF NOT EXISTS penilaian (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alternatif_id UUID REFERENCES alternatif(id) ON DELETE CASCADE,
    kriteria_id UUID REFERENCES kriteria(id) ON DELETE CASCADE,
    nilai NUMERIC NOT NULL,
    UNIQUE(alternatif_id, kriteria_id)
);

-- Basic RLS (Row Level Security) - adjust as needed
ALTER TABLE kriteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternatif ENABLE ROW LEVEL SECURITY;
ALTER TABLE matriks_ahp ENABLE ROW LEVEL SECURITY;
ALTER TABLE penilaian ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for development (adjust for production)
CREATE POLICY "Allow all access to kriteria" ON kriteria FOR ALL USING (true);
CREATE POLICY "Allow all access to alternatif" ON alternatif FOR ALL USING (true);
CREATE POLICY "Allow all access to matriks_ahp" ON matriks_ahp FOR ALL USING (true);
CREATE POLICY "Allow all access to penilaian" ON penilaian FOR ALL USING (true);
