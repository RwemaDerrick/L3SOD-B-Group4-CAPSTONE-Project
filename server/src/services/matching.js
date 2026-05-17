/** In-memory match queue: mood -> Set of { userId, socketId } */
export const matchQueues = new Map();

export function getQueue(mood) {
  if (!matchQueues.has(mood)) matchQueues.set(mood, new Map());
  return matchQueues.get(mood);
}

export function leaveAllQueues(userId) {
  for (const queue of matchQueues.values()) {
    for (const [key, entry] of queue.entries()) {
      if (entry.userId === userId) queue.delete(key);
    }
  }
}
