export function replaceTopics (obj, key, value) {
  const foundValue = Object.keys(obj).find((val) => val === key)
  return foundValue ? obj[foundValue] : value
}

export function updateArrayOfObjects (data, res) {
  return data.map((item) => {
    const properties = item?.properties

    if (properties) {
      const updatedTopics = properties.topics?.map((topic) => {
        return replaceTopics(res?.data ?? {}, topic)
      }) || []

      return {
        ...item,
        properties: {
          ...properties,
          topics: updatedTopics
        }
      }
    }
    return item
  })
}
