import { MatriksAHP, Kriteria } from '@/types';

const RI: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

export const calculateAHP = (kriteria: Kriteria[], matriksInput: MatriksAHP[]) => {
  const n = kriteria.length;
  if (n === 0) return null;

  // 1. Create Pairwise Comparison Matrix
  const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(1));
  const kriteriaIds = kriteria.map(k => k.id);

  matriksInput.forEach(m => {
    const i = kriteriaIds.indexOf(m.kriteria_1_id);
    const j = kriteriaIds.indexOf(m.kriteria_2_id);
    if (i !== -1 && j !== -1) {
      matrix[i][j] = m.nilai;
      matrix[j][i] = 1 / m.nilai;
    }
  });

  // 2. Calculate Column Sums
  const columnSums = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      columnSums[j] += matrix[i][j];
    }
  }

  // 3. Normalize Matrix
  const normalizedMatrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      normalizedMatrix[i][j] = matrix[i][j] / columnSums[j];
    }
  }

  // 4. Calculate Priority Vector (Bobot)
  const priorityVector = normalizedMatrix.map(row => row.reduce((a, b) => a + b, 0) / n);

  // 5. Consistency Check
  // - Consistency Measure (CM)
  const cm = priorityVector.map((w, i) => {
    let sum = 0;
    for (let j = 0; j < n; j++) {
       sum += matrix[i][j] * priorityVector[j];
    }
    return sum / w;
  });

  const lambdaMax = cm.reduce((a, b) => a + b, 0) / n;
  const CI = (lambdaMax - n) / (n - 1 || 1);
  const randomIndex = RI[n] || RI[10];
  const CR = CI / (randomIndex || 1);

  return {
    priorityVector,
    lambdaMax,
    CI,
    CR,
    isConsistent: CR < 0.1,
    matrix,
    normalizedMatrix
  };
};
