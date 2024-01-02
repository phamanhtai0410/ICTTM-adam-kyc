import { AdminEditPropertyArray } from 'helpers'

export function fillPropertiesObject (installedProperty, setFunction) {
  const entityArray = AdminEditPropertyArray.find(entity => entity[installedProperty])

  if (entityArray) {
    const entityProperties = entityArray[installedProperty]

    const updatedPropertiesObject = {}

    entityProperties.forEach(property => {
      updatedPropertiesObject[property] = ['']
    })

    setFunction(updatedPropertiesObject)
  }
}
