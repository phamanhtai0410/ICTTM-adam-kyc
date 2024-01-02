const navArray = {
  factsheet: 'Factsheet',
  description: 'Description',
  negative_media: 'Media',
  address: 'Address',
  relationships: 'Relationships',
  dataSources: 'Data Sources'
}

// export function handleScrollTo (section) {
//   const key = Object.keys(navArray).find((k) => navArray[k] === section)
//   if (key !== undefined) document.getElementById(`${key}`).scrollIntoView()
// }

export function handleScrollTo (section) {
  const key = Object.keys(navArray).find((k) => navArray[k] === section)
  if (key) {
    const element = document.getElementById(`${key}`)
    if (element) {
      element.scrollIntoView()
    }
  }
}
