export function Capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function deCapitalize (str) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export function TitleCapiralize (str) {
  if (typeof str === 'string' && str.length > 0) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  } else {
    return str
  }
}
