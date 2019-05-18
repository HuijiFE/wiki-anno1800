export function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

export function formatNumber(value: number): string {
  if (!value) {
    return `${value}`;
  }
  const absValue = Math.abs(value);
  if (absValue >= 10000000000) {
    return `${(value / 1000000000).toFixed(2)}T`;
  }
  if (absValue >= 10000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }
  if (absValue >= 10000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  if (Number.isInteger(value)) {
    return `${value}`;
  }

  return (absValue > 1 && value.toFixed(2)) || value.toFixed(5);
}
