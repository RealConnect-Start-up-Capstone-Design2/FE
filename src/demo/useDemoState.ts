import { useSyncExternalStore } from "react";

import { getDemoState, subscribeDemoState } from "./repository";
import type { DemoState } from "./types";

let currentSnapshot = getDemoState();
let stopRepositorySubscription: (() => void) | null = null;
const reactListeners = new Set<() => void>();

function updateSnapshot(nextState: DemoState): void {
  currentSnapshot = nextState;
  reactListeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  reactListeners.add(listener);

  if (!stopRepositorySubscription) {
    currentSnapshot = getDemoState();
    stopRepositorySubscription = subscribeDemoState(updateSnapshot);
  }

  return () => {
    reactListeners.delete(listener);

    if (reactListeners.size === 0) {
      stopRepositorySubscription?.();
      stopRepositorySubscription = null;
    }
  };
}

function getSnapshot(): DemoState {
  return currentSnapshot;
}

export function useDemoState(): DemoState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
