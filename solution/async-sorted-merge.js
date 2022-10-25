"use strict";

const MinHeap = require("../lib/min-heap");

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = (logSources, printer) => {
  return new Promise((resolve, reject) => {
    // minHeapAsyncNaiveSolution(logSources, printer)
    minHeapAsyncSolution(logSources, printer)
      .then((rs) => rs(resolve(console.log("Async sort complete."))))
      .catch((err) => reject(err));
  });
};

/**
 * The difference is that calling await is a bottleneck. To avoid having to await
 * for each popAsync(), we push TIMES_OVERSIZED times more logEntries per logSource
 * as a setup. And then we can make TIMES_OVERSIZED polls without having to await
 * right away, so we stack the promises and await them all at once with Promise.all().
 *
 * This leads us to:
 * O(k * n * log k) time complexity, same as before, but
 * O(k * TIMES_OVERSIZED) space complexity
 *
 * Observed 677.1759710826783 Logs/s for k = 100, TIMES_OVERSIZED = 5
 * That is ~3,2x faster than the naive solution at the bottom of this file
 *
 * Observed 1205.840310394119 Logs/s for k = 100, TIMES_OVERSIZED = 10
 * That is ~5,7x faster than the naive solution at the bottom of this file
 */

// Tradeoff between memory and time
const TIMES_OVERSIZED = 10;

async function minHeapAsyncSolution(logSources, printer) {
  const minHeap = new MinHeap();
  let promises = [];

  // Initial setup
  for (let i = 0; i < logSources.length * TIMES_OVERSIZED; i++) {
    promises.push(asyncMinHeapPush(minHeap, logSources, i % logSources.length));
  }

  // Main routine
  while (true) {
    if (promises.length > 0) {
      await Promise.all(promises);
      promises = [];
    }
    if (minHeap.length() === 0) {
      break;
    }

    let i = TIMES_OVERSIZED;
    while (i-- && minHeap.length() > 0) {
      const [value, index] = minHeap.poll();
      printer.print(value);
      promises.push(asyncMinHeapPush(minHeap, logSources, index));
    }
  }

  return printer.done();
}

async function asyncMinHeapPush(minHeap, logSources, index) {
  return logSources[index].popAsync().then((logEntry) => {
    // Push logEntries to the minHeap as they resolve
    if (logEntry) {
      minHeap.push(logEntry, index);
    }
  })
}

/**
 * Naive solution: doesn't handle the await bottleneck in main routine
 * Observed 212.4901600629756 Logs/s for k = 100
 */
async function minHeapAsyncNaiveSolution(logSources, printer) {
  const minHeap = new MinHeap();
  const promises = [];

  // Initial setup
  for (let i = 0; i < logSources.length; i++) {
    // Awaiting here would be too much, and I would rather compare the main routine difference
    promises.push(asyncMinHeapPush(minHeap, logSources, i % logSources.length));
  }
  await Promise.all(promises);

  // Main routine
  while (minHeap.length() > 0) {
    const [value, index] = minHeap.poll();
    printer.print(value);
    await asyncMinHeapPush(minHeap, logSources, index);
  }

  return printer.done();
}
