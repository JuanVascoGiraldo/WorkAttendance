export const trackEvent = (eventName, payload = {}) => {
  if (import.meta?.env?.DEV) {
    console.debug(`[analytics] ${eventName}`, payload);
  }
};
