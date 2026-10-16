export const formatRecordTime = (seconds: number): string => {
  if (seconds >= 60) {
    return `${Math.floor(seconds / 60)}:${(seconds % 60)
      .toString()
      .padStart(2, '0')}`;
  }

  return `0:${seconds.toString().padStart(2, '0')}`;
};
