export function findKeyByValue (obj, targetValue) {
  for (const key in obj) {
    if (obj[key] === targetValue) {
      return key
    }
  }
  return null
}

export function findValueByKey (obj, targetKey) {
  for (const key in obj) {
    if (key === targetKey) {
      return obj[key]
    }
  }
  return null
}
