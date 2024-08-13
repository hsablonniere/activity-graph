/**
 * @param {Array<string|null>} parts
 * @return {string}
 */
export function shadowPartAttribute(parts) {
  return parts.filter((name) => name != null).join(' ');
}
