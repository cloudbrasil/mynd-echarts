export type QueueTask<T = void> = () => Promise<T> | T;

/**
 * A minimal serial operation queue. Ensures tasks (setOption/resize) never race.
 */
export class OperationQueue {
  private tail: Promise<unknown> = Promise.resolve();

  enqueue<T = void>(task: QueueTask<T>): Promise<T> {
    const run = async () => task();
    // Chain onto tail to guarantee ordering
    const next = this.tail.then(run, run) as Promise<T>;
    // Ensure tail always resolves to avoid blocking on errors
    this.tail = next.catch(() => undefined);
    return next;
  }

  clear(): void {
    this.tail = Promise.resolve();
  }
}
