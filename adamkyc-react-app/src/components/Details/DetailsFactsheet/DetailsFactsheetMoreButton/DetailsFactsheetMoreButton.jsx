import { useState } from 'react'

export function DetailsFactsheetMoreButton ({ value }) {
  const [showAll, setShowAll] = useState(false)
  const maxCharacters = 75

  let displayedValue = ''
  let hiddenValue = ''

  for (const item of value) {
    if (displayedValue.length + item.length <= maxCharacters || showAll) {
      displayedValue += item + ', '
    } else {
      hiddenValue += item + ', '
    }
  }

  displayedValue = displayedValue.slice(0, -2)
  hiddenValue = hiddenValue.slice(0, -2)

  return (
    <>
      <p>{displayedValue}</p>
      {hiddenValue && (
        <button
          className='search-item__tags-item search-item__tags-item__more'
          onClick={() => setShowAll(true)}
        >
          <p className='search-item__tag search-item__name-subtext filter-subtext'>
            +{hiddenValue.split(',').length} More
          </p>
        </button>
      )}
    </>
  )
}
