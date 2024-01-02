export function swapObjectKeys (obj1, obj2) {
  const result = { ...obj1 }
  if (obj1.properties) {
    result.properties = {}
    for (const key in obj1.properties) {
      if (key in obj2) {
        result.properties[obj2[key]] = obj1.properties[key]
      } else {
        result.properties[key] = obj1.properties[key]
      }
    }
  }
  return [result]
}
