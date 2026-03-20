function fromWindow() {
  return typeof window !== "undefined" ? window.__APP_CONFIG__ || {} : {};
}

export function getAppConfig() {
  const w = fromWindow();
  return {
    appTitle: w.appTitle || import.meta.env.VITE_APP_TITLE || "Star Dash",
  };
}
