// Shared, muted accents for project identity across the workspace.
export const ICON_COLORS = [
  { hex: '#6750A4', label: 'Iris' },
  { hex: '#586F96', label: 'Dusty blue' },
  { hex: '#9A526C', label: 'Rosewood' },
  { hex: '#84623C', label: 'Honey' },
  { hex: '#95604C', label: 'Clay' },
  { hex: '#79577E', label: 'Plum' },
  { hex: '#656B83', label: 'Blue slate' },
  { hex: '#78685B', label: 'Cocoa' },
];
const legacyColors = {
  '#6366f1': '#6750A4', '#10b981': '#656B83', '#f59e0b': '#84623C',
  '#3b82f6': '#586F96', '#ec4899': '#9A526C', '#ef4444': '#9A526C',
  '#8b5cf6': '#79577E', '#14b8a6': '#586F96', '#f97316': '#95604C', '#64748b': '#656B83',
};
export function parseIcon(icon) {
  if (icon?.startsWith('data:')) return { text: '', color: ICON_COLORS[0].hex, isImage: true };
  const [text = '', storedColor = ''] = (icon || '').split('|');
  const color = legacyColors[storedColor.toLowerCase()] || (/^#[0-9a-f]{6}$/i.test(storedColor) ? storedColor : ICON_COLORS[0].hex);
  return { text, color, isImage: false };
}
const tint = (hex, amount) => '#' + hex.slice(1).match(/../g).map(channel => Math.round(parseInt(channel, 16) * (1 - amount) + 255 * amount).toString(16).padStart(2, '0')).join('');
export function projectAppearance(icon) {
  const { color } = parseIcon(icon);
  return { '--project-accent': color, '--project-surface': tint(color, .94), '--project-hover': tint(color, .90), '--project-tint': tint(color, .85), '--project-border': tint(color, .76) };
}
