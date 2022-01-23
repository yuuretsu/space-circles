/**
 * Random float between `min` and `max`.
 * @param {() => number} generator function, returns random value between 0 and 1
 * @param {number} min
 * @param {number} max
 */
 export function randFloat(generator, min, max) {
  return generator() * (max - min) + min;
}

/**
 * Random integer between `min` and `max`.
 * @param {() => number} generator function, returns random value between 0 and 1
 * @param {number} min
 * @param {number} max
 */
export function randInt(generator, min, max) {
  return Math.floor(randFloat(generator, min, max));
}

export function randChoice(generator, arr) {
  return arr[Math.floor(generator() * arr.length)];
}
