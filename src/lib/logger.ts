const DEBUG_ENABLED = process.env.DEBUG_ENABLED === 'true' || false;

export function logit(...args: any[]) {
  if (!DEBUG_ENABLED) return;
  console.log(...args);
}

export function logError(...args: any[]) {
  if (!DEBUG_ENABLED) return;
  console.error(...args);
}

export function logWarn(...args: any[]) {
  if (!DEBUG_ENABLED) return;
  console.warn(...args);
}


