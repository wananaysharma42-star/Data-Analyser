export function correlation(arr1, arr2) {
  const n = arr1.length;
  const avg1 = arr1.reduce((a, b) => a + b, 0) / n;
  const avg2 = arr2.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let den1 = 0;
  let den2 = 0;

  for (let i = 0; i < n; i++) {
    num += (arr1[i] - avg1) * (arr2[i] - avg2);
    den1 += (arr1[i] - avg1) ** 2;
    den2 += (arr2[i] - avg2) ** 2;
  }

  return (num / Math.sqrt(den1 * den2)).toFixed(2);
}