export const resolveStatusColors = (
  status: string,
  backgroundColorByStatus: Record<string, string>,
  statusesWithWhiteText: string[],
  fallbackBackgroundColor = "#F1F908FF"
) => ({
  backgroundColor: backgroundColorByStatus[status] ?? fallbackBackgroundColor,
  textColor: statusesWithWhiteText.includes(status) ? "white" : "black",
});
