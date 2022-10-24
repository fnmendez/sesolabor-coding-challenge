"use-strict";

/**
 * MinHeap implementation for two-sized array values, sorted by zero indexed value date attribute.
 */
module.exports = class MinHeap {
  constructor() {
    this.data = [];
  }

  length() {
    return this.data.length;
  }

  left(i) {
    return i * 2 + 1;
  }

  right(i) {
    return i * 2 + 2;
  }

  parent(i) {
    return Math.floor((i - 1) / 2);
  }

  swap(i, j) {
    [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
  }

  push(logEntry, logSourceIndex) {
    this.data.push([logEntry, logSourceIndex]);
    this.heapifyUp(this.data.length - 1);
  }

  heapifyUp(index) {
    if (index > 0 && this.data[index][0].date < this.data[this.parent(index)][0].date) {
      this.swap(index, this.parent(index));
      this.heapifyUp(this.parent(index));
    }
  }

  poll() {
    if (this.data.length === 1) {
      return this.data.pop();
    }
    const min = this.data[0];
    this.data[0] = this.data.pop();
    this.heapifyDown(0);
    return min;
  }

  heapifyDown(index) {
    if (this.left(index) < this.data.length) {
      let minChild = this.left(index);
      if (this.right(index) < this.data.length && this.data[this.right(index)][0].date < this.data[minChild][0].date) {
        minChild = this.right(index);
      }
      if (this.data[minChild][0].date < this.data[index][0].date) {
        this.swap(index, minChild);
        this.heapifyDown(minChild);
      }
    }
  }

  peek() {
    if (this.data.length > 0) {
      return this.data[0];
    }
  }
}
