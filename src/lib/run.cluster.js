import cluster from 'node:cluster';
import os from 'node:os';
import { pid } from 'node:process';

/**
 * @param {'auto'|number} cpusOption
 * @param {(pid: number) => void} run
 */
export function runCluster(cpusOption, run) {
  if (cpusOption === 1 || !cluster.isPrimary) {
    run(pid);
  } else {
    const cpusCount = cpusOption === 'auto' ? os.availableParallelism() : cpusOption;

    for (let i = 0; i < cpusCount; i++) {
      cluster.fork();
    }

    cluster.on('exit', () => cluster.fork());
  }
}
