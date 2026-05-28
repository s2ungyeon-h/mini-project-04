export function getFirstSentence(content = '') {
  const trimmed = content.trim();
  if (!trimmed) return '';
  const match = trimmed.match(/^[^.!?。]+[.!?。]?/);
  return match ? match[0].trim() : trimmed.slice(0, 80);
}
