import type { ReducedTrialRow } from "psyflow-web";

export function summarizeBlock(
  rows: ReducedTrialRow[],
  blockId: string
): { go_accuracy: number; nogo_accuracy: number } {
  const blockRows = rows.filter((row) => row.block_id === blockId);
  const goRows = blockRows.filter((row) => row.condition === "go");
  const nogoRows = blockRows.filter((row) => row.condition === "nogo");

  const goHits = goRows.filter((row) => row.go_hit === true);
  const nogoCorrect = nogoRows.filter((row) => row.nogo_hit === false);

  return {
    go_accuracy: goRows.length > 0 ? goHits.length / goRows.length : 0,
    nogo_accuracy: nogoRows.length > 0 ? nogoCorrect.length / nogoRows.length : 0
  };
}
