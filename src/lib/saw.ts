import { Kriteria, Penilaian, Alternatif, RankingItem, SAWResults } from '@/types';

export const calculateSAW = (
  kriteria: Kriteria[],
  alternatif: Alternatif[],
  penilaian: Penilaian[],
  bobot: number[]
): SAWResults | null => {
  if (kriteria.length === 0 || alternatif.length === 0) return null;

  // 1. Create Decision Matrix
  const matrix: number[][] = Array(alternatif.length).fill(null).map(() => Array(kriteria.length).fill(0));
  const kriteriaIds = kriteria.map(k => k.id);
  const alternatifIds = alternatif.map(a => a.id);

  penilaian.forEach(p => {
    const i = alternatifIds.indexOf(p.alternatif_id);
    const j = kriteriaIds.indexOf(p.kriteria_id);
    if (i !== -1 && j !== -1) {
      matrix[i][j] = p.nilai;
    }
  });

  // 2. Normalization
  const normalizedMatrix: number[][] = Array(alternatif.length).fill(null).map(() => Array(kriteria.length).fill(0));

  for (let j = 0; j < kriteria.length; j++) {
    const values = matrix.map(row => row[j]);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const type = kriteria[j].tipe;

    for (let i = 0; i < alternatif.length; i++) {
      if (type === 'benefit') {
        normalizedMatrix[i][j] = max === 0 ? 0 : matrix[i][j] / max;
      } else {
        normalizedMatrix[i][j] = matrix[i][j] === 0 ? 0 : min / matrix[i][j];
      }
    }
  }

  // 3. Calculation of Preference Value
  const weightedMatrix: number[][] = Array(alternatif.length).fill(null).map(() => Array(kriteria.length).fill(0));
  
  const ranking: RankingItem[] = alternatif.map((alt, i) => {
    let score = 0;
    let maxContribution = -1;
    let minContribution = Infinity;
    let strongestKriteria = "";
    let weakestKriteria = "";
    const currentScores: { kriteria: string; score: number }[] = [];

    for (let j = 0; j < kriteria.length; j++) {
      const contribution = normalizedMatrix[i][j] * bobot[j];
      weightedMatrix[i][j] = contribution;
      score += contribution;

      currentScores.push({
        kriteria: kriteria[j].nama,
        score: contribution
      });

      if (contribution > maxContribution) {
        maxContribution = contribution;
        strongestKriteria = kriteria[j].nama;
      }
      if (contribution < minContribution) {
        minContribution = contribution;
        weakestKriteria = kriteria[j].nama;
      }
    }
    
    return {
      alternatif_id: alt.id,
      nama: alt.nama,
      skor: score,
      rank: 0,
      insights: {
        strongest_kriteria: strongestKriteria,
        strongest_score: maxContribution,
        weakest_kriteria: weakestKriteria,
        weakest_score: minContribution,
        scores: currentScores.sort((a, b) => b.score - a.score),
      }
    };
  });

  // 4. Ranking (Competition/Joint Ranking)
  const sortedRanking = [...ranking].sort((a, b) => b.skor - a.skor);
  const topScore = sortedRanking[0]?.skor || 0;

  let currentRank = 1;
  sortedRanking.forEach((item, index) => {
    if (index > 0 && item.skor < sortedRanking[index - 1].skor) {
      currentRank = index + 1;
    }
    item.rank = currentRank;
    
    if (item.insights) {
      item.insights.gap_to_top = topScore - item.skor;
    }
  });

  return {
    ranking: sortedRanking,
    matrix,
    normalizedMatrix,
    weightedMatrix
  };
};
