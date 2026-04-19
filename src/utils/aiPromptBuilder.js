/**
 * Formats preprocessed data into a highly condensed string for AI context.
 */
export function buildAIContext(preprocessedData, mode = "SINGLE") {
  if (!preprocessedData) return "No data available.";

  let context = `DATASET_CONTEXT_PROTOCOL_V1\n`;
  context += `MODE: ${mode}\n`;
  context += `TOTAL_ROWS: ${preprocessedData.totalRows || preprocessedData.datasetA_Summary?.totalRows + preprocessedData.datasetB_Summary?.totalRows}\n\n`;

  context += `--- TOP_INSIGHTS ---\n`;
  preprocessedData.insights?.forEach((insight, i) => {
    context += `${i + 1}. ${insight}\n`;
  });

  context += `\n--- COLUMN_SCHEMA_SUMMARY ---\n`;
  const schema = preprocessedData.columnSummary || preprocessedData.datasetA_Summary?.columnSummary;
  
  if (schema) {
    Object.entries(schema).forEach(([col, stats]) => {
      context += `[${col}] (${stats.type}): `;
      if (stats.type === "numeric") {
        context += `Mean: ${stats.mean}, Min: ${stats.min}, Max: ${stats.max}, Missing: ${stats.missingPercent}%\n`;
      } else {
        context += `Distinct: ${stats.distinctCount}, Top: ${stats.topValues?.join(", ")}, Missing: ${stats.missingPercent}%\n`;
      }
    });
  }

  if (mode === "TWO_SAMPLE" && preprocessedData.testMetrics) {
    context += `\n--- T_TEST_METRICS ---\n`;
    context += `T-Statistic: ${preprocessedData.testMetrics.tStatistic}\n`;
    context += `Dataset_A Mean: ${preprocessedData.testMetrics.meanA} (Target: ${preprocessedData.testMetrics.targetFeatureA})\n`;
    context += `Dataset_B Mean: ${preprocessedData.testMetrics.meanB} (Target: ${preprocessedData.testMetrics.targetFeatureB})\n`;
  }

  context += `\nINSTRUCTION: Answer questions strictly based on this condensed metadata. Do not hallucinate raw rows.`;

  return context;
}
