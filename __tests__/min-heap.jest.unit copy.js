const MinHeap = require("../lib/min-heap");

describe("MinHeap behavior", () => {
  test("It should heapify up", () => {
    const minHeap = new MinHeap();
    minHeap.push({ date: 5 }, 0);
    minHeap.push({ date: 3 }, 0);
    minHeap.push({ date: 4 }, 0);
    minHeap.push({ date: 2 }, 0);
    expect(minHeap.peek()[0].date).toEqual(2);
  });

  test("It should heapify down", () => {
    const minHeap = new MinHeap();
    minHeap.push({ date: 5 }, 0);
    minHeap.push({ date: 3 }, 0);
    minHeap.push({ date: 4 }, 0);
    minHeap.push({ date: 2 }, 0);
    const val = minHeap.poll();
    expect(val[0].date).toEqual(2);
    expect(minHeap.peek()[0].date).toEqual(3);
  });
});
