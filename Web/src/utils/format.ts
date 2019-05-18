export function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

const thousand = 1000;
const million = 1000000;
const billion = 1000000000;

export function formatNumber(value: number): string {
  if (Number.isNaN(value)) {
    return 'NaN';
  }
  const absValue = Math.abs(value);
  if (absValue > billion) {
    return `${(value / billion).toFixed(2)}T`;
  }
  if (absValue > million) {
    return `${(value / million).toFixed(2)}M`;
  }
  if (absValue > thousand) {
    return `${(value / thousand).toFixed(2)}K`;
  }
  if (Number.isInteger(value)) {
    return `${value}`;
  }

  return (absValue > 1 && value.toFixed(2)) || value.toFixed(5);
}
