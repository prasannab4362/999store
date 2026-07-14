/**
 * Polish placeholder strategy for 999 Combo Store
 * Generates beautiful, responsive inline SVG placeholders to prevent broken images.
 */

export function getPlaceholderSvg(text: string, width = 600, height = 800, bgColor = "FFF9F4", fgColor = "16131A"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="%23${bgColor}"/>
    <line x1="0" y1="0" x2="${width}" y2="${height}" stroke="%23e5e7eb" stroke-width="1"/>
    <line x1="${width}" y1="0" x2="0" y2="${height}" stroke="%23e5e7eb" stroke-width="1"/>
    <circle cx="${width / 2}" cy="${height / 2 - 20}" r="60" fill="%23ffffff" stroke="%236D28D9" stroke-width="2"/>
    <text x="50%" y="${height / 2 - 14}" font-family="sans-serif" font-size="16" font-weight="bold" fill="%236D28D9" text-anchor="middle">999</text>
    <text x="50%" y="${height / 2 + 80}" font-family="sans-serif" font-size="20" font-weight="600" fill="%23${fgColor}" text-anchor="middle">${text}</text>
    <text x="50%" y="${height - 40}" font-family="sans-serif" font-size="12" font-weight="500" fill="%239ca3af" text-anchor="middle" letter-spacing="2">COMBO STORE</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${svg}`;
}

export function getProductPlaceholder(categoryName: string, view: string): string {
  return getPlaceholderSvg(`${categoryName} (${view})`, 600, 800, "FFF9F4", "16131A");
}

export const mockVideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40166-large.mp4";
export const mockVideoPoster = getPlaceholderSvg("Product Video Preview", 600, 800, "FFF9F4", "6D28D9");
