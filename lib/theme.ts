export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";

/** Browser-UI bar color per theme — kept in step with --base in globals.css. */
export const THEME_BAR_COLOR: Record<Theme, string> = {
  dark: "#282725",
  light: "#f7f5f1",
};

/**
 * Runs before first paint so a returning light-mode visitor never sees a dark
 * flash. <html> ships with data-theme="dark", so this only has to flip to light.
 */
export const themeInitScript = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light"){document.documentElement.dataset.theme="light";var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","${THEME_BAR_COLOR.light}")}}catch(e){}`;
