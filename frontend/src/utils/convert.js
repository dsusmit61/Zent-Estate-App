export const convert = (value) => {
  if (value >= 10000000) {
    value = value / 10000000;
    value = Math.round(value * 100) / 100 + 'Cr';
  } else if (value >= 100000) {
    value = value / 100000;
    value = Math.round(value * 100) / 100 + 'L';
  } else if (value >= 1000) {
    value = value / 1000;
    value = Math.round(value * 100) / 100 + 'K';
  }
  return value;
};
