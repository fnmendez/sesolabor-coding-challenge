"use strict";

const MinHeap = require("../lib/min-heap");

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  minHeapSolution(logSources, printer);
  return console.log("Sync sort complete.");
};

/**
 * For a data structure approach, the optimal is to use a MinHeap of size n as we know
 * that the logEntries within a same logSource are in chronological order.
 * So they can only be unsorted in between the different n logSources.
 *
 * O(k * n * log k) time complexity, as there are n*k logEntries to push/poll from minHeap
 * O(k) space complexity, as we only store k logSources in the minHeap
 *
 * k being amount of logSources
 * n being amount of logEntries per logSource (as stated in README)
 */

function minHeapSolution(logSources, printer) {
  const minHeap = new MinHeap();
  // First MinHeap fill
  for (let i = 0; i < logSources.length; i++) {
    const logEntry = logSources[i].pop();
    if (logEntry) {
      minHeap.push(logEntry, i);
    }
  }
  // MinHeap pop and push from the same logSource (that's why we need to push the index)
  while (minHeap.length() > 0) {
    const [value, index] = minHeap.poll();
    printer.print(value);
    const logEntry = logSources[index].pop();
    if (logEntry) {
      minHeap.push(logEntry, index);
    }
  }
  printer.done();
}
