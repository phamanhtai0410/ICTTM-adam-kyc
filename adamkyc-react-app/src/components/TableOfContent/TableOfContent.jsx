import { useEffect, useState } from 'react'
import { handleScrollTo } from 'helpers'
import './TableOfContent.style.scss'

export function TableOfContent ({ data, sections }) {
  const [filteredItems, setFilteredItems] = useState([])

  useEffect(() => {
    const itemMappings = {
      factsheet: 'Factsheet',
      description: 'Description',
      // negative_media: 'Media',
      // location_markers: 'Address',
      relationship: 'Relationships',
      sources: 'Data Sources'
    }

    const order = {
      Factsheet: 1,
      Description: 2,
      // Media: 3,
      // Address: 4,
      Relationships: 5,
      'Data Sources': 6
    }

    const filteredNames = Object.keys(data[0]).filter(item => {
      return item in itemMappings
    })
    const result = filteredNames.map(item => itemMappings[item])
    const filteredResult = result.filter(item => sections.includes(item))
    const sortedArray = filteredResult.sort((a, b) => order[a] - order[b])

    setFilteredItems(sortedArray)
  }, [data, sections])

  return (
    <div className='navigation-wrapper'>
      <h2 className='navigation-wrapper__title'>Table of Content</h2>
      <div className='navigation-wrapper__link-container'>
        {filteredItems.map((navItem, navIndex) => {
          const displayIndex = 1 + navIndex
          return (
            <a
              key={navItem}
              className='navigation-wrapper__link'
              onClick={() => handleScrollTo(navItem)}
            >
              {displayIndex}. {navItem}
            </a>
          )
        })}
      </div>
    </div>
  )
}
