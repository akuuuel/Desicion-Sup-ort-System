export type KriteriaType = 'benefit' | 'cost';

export interface Kriteria {
  id: string;
  kode: string;
  nama: string;
  tipe: KriteriaType;
  bobot?: number;
  created_at: string;
}

export interface Alternatif {
  id: string;
  kode: string;
  nama: string;
  alamat?: string;
  created_at: string;
}

export interface MatriksAHP {
  id: string;
  kriteria_1_id: string;
  kriteria_2_id: string;
  nilai: number;
}

export interface Penilaian {
  id: string;
  alternatif_id: string;
  kriteria_id: string;
  nilai: number;
}

export interface PerhitunganHasil {
  kriteria: Kriteria[];
  alternatif: Alternatif[];
  bobot: Record<string, number>;
  matrix: number[][];
  consistencyRatio: number;
  isConsistent: boolean;
  ranking: RankingItem[];
}

export interface RankingItem {
  alternatif_id: string;
  nama: string;
  skor: number;
  rank: number;
  insights?: {
    strongest_kriteria: string;
    strongest_score: number;
    weakest_kriteria: string;
    weakest_score: number;
    gap_to_top?: number;
    scores: { kriteria: string; score: number }[];
  };
}

export interface SAWResults {
  ranking: RankingItem[];
  matrix: number[][];
  normalizedMatrix: number[][];
  weightedMatrix: number[][];
}
