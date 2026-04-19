/**
 * Summarizes an entire dataset into a concise schema to save AI tokens.
 */
export function preprocessSingleData(data) {
  if (!data || !data.length) return {};

  const columns = Object.keys(data[0]);
  const schema = {};

  columns.forEach((col) => {
    let missing = 0;
    let numericVals = [];
    let counts = {};

    data.forEach((row) => {
      const val = row[col];
      if (val === undefined || val === null || val === "") {
        missing++;
        return;
      }

      if (!isNaN(Number(val))) {
        numericVals.push(Number(val));
      }

      counts[val] = (counts[val] || 0) + 1;
    });

    // If more than 50% of non-missing values are numeric, treat as numeric
    const nonMissingCount = data.length - missing;
    const missingPercent = (missing / data.length) * 100;
    
    if (nonMissingCount > 0 && numericVals.length / nonMissingCount > 0.5) {
      const sum = numericVals.reduce((a, b) => a + b, 0);
      const min = Math.min(...numericVals);
      const max = Math.max(...numericVals);
      schema[col] = {
        type: "numeric",
        missing,
        missingPercent,
        min,
        max,
        mean: Number((sum / numericVals.length).toFixed(2)),
      };
    } else {
      // Categorical processing
      const topValues = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([k, v]) => `${k} (count: ${v})`);

      schema[col] = {
        type: "categorical",
        missing,
        missingPercent,
        distinctCount: Object.keys(counts).length,
        topValues,
      };
    }
  });

  // Generate programmatic insights
  const insights = [];
  const totalRows = data.length;
  
  Object.entries(schema).forEach(([col, stats]) => {
    if (stats.missingPercent > 10) {
      insights.push(`High Missing Data: Column '${col}' is missing ${stats.missingPercent.toFixed(1)}% of values. Consider imputation or dropping.`);
    }
    if (stats.type === 'numeric' && stats.min === stats.max && stats.missing < totalRows) {
      insights.push(`Zero Variance: Column '${col}' has a constant value of ${stats.min}. It may not be useful for modeling.`);
    }
    if (stats.type === 'categorical' && stats.distinctCount > totalRows * 0.9 && totalRows > 50) {
      insights.push(`High Cardinality: Column '${col}' has almost entirely unique string values. Likely an identifier or ID column.`);
    }
    if (stats.type === 'categorical' && stats.distinctCount === 1) {
      insights.push(`Constant Value: Column '${col}' only contains 1 distinct category.`);
    }
  });

  if (insights.length === 0) {
    insights.push("Data Health Excellent: No immediate issues detected with missing values or variance.");
  }

  return {
    totalRows,
    columnSummary: schema,
    insights
  };
}

/**
 * Summarizes two datasets and appends test profiles.
 */
export function preprocessTwoSampleData(dataA, dataB, profile) {
  const summaryA = preprocessSingleData(dataA);
  const summaryB = preprocessSingleData(dataB);
  
  const insights = [];
  if (profile.tScore !== null) {
    const t = Math.abs(Number(profile.tScore));
    if (t > 1.96) {
      insights.push(`Significant Difference (p < 0.05 estimated): The T-Statistic is ${profile.tScore}, indicating the means of Dataset A and Dataset B are likely statistically different.`);
    } else {
      insights.push(`No Significant Difference: The T-Statistic is ${profile.tScore}, suggesting the means are statistically similar.`);
    }
  }

  const meanDiff = Math.abs(profile.avgA - profile.avgB);
  if (meanDiff > 0) {
    insights.push(`Absolute Mean Difference: The absolute difference between the targets is ${meanDiff.toFixed(2)}.`);
  }

  return {
    datasetA_Summary: summaryA,
    datasetB_Summary: summaryB,
    testMetrics: {
      targetFeatureA: profile.targetA,
      meanA: profile.avgA,
      targetFeatureB: profile.targetB,
      meanB: profile.avgB,
      tStatistic: profile.tScore,
    },
    insights: [...insights, ...summaryA.insights.map(i => `(A) ${i}`), ...summaryB.insights.map(i => `(B) ${i}`)]
  };
}
