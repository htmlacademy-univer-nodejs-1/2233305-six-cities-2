export function generateRandomValue(min: number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[]): T[] {
  const randomValue = generateRandomValue(1, items.length - 1);
  const number = randomValue + generateRandomValue(randomValue, items.length);
  return items.slice(randomValue, number);
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(1, items.length - 1)];
}
