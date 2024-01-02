import { useState } from 'react'
import { AdminEditPropertyArray, findKeyByValue, nameObject, transformArrayValues } from 'helpers'
import assets from '../../../../assets/index'
import './AdminEditProfileButton.style.scss'

export function AdminEditProfileButton ({ onSelectProperty, currentProperty, increment, digit, propertyArray }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  function handleToggleDropdown () {
    setDropdownOpen(!isDropdownOpen)
  }

  function handleSelectProperty (property) {
    setDropdownOpen(false)
    onSelectProperty(property)
  }

  const currentPageIndex = AdminEditPropertyArray.findIndex((page) => page[currentProperty])
  const propertyOptions = currentPageIndex !== -1 ? AdminEditPropertyArray[currentPageIndex][currentProperty] : []
  const newPropertyArray = transformArrayValues(propertyOptions, nameObject[0])

  return (
    !increment
      ? (
        <>
          <button className='admin-edit__button' onClick={handleToggleDropdown}>
            <assets.PlusSVG width={16} height={16} />
            Add More
          </button>
          {isDropdownOpen && (
            <div className='admin-edit__dropdown'>
              <ul className='admin-edit__dropdown-list'>
                <h3>Please, select a field to work with:</h3>
                {newPropertyArray.map((property, index) => (
                  <li key={`${property} ${index}`} className='admin-edit__dropdown-element' onClick={() => handleSelectProperty(findKeyByValue(nameObject[0], property))}>
                    {property}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
        )
      : (
        <button className='admin-edit__button' onClick={increment} disabled={digit === (propertyArray?.length + 1)}>
          <assets.PlusSVG width={16} height={16} />
          Add More
        </button>
        )
  )
}
