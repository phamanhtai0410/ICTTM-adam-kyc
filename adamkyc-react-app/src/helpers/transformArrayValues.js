export function transformArrayValues (array, valueObject) {
  return array.map((value) => valueObject[value] || value)
}
