export function modifiedValue (value) {
  return value.length >= 15 ? '"' + value.slice(0, 15) + '...' + '"' : '"' + value + '"'
}
