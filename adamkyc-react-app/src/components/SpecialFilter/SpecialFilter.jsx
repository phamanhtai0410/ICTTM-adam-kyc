import { useState } from 'react'
import { CountryFilter } from 'components'
import assets from '../../assets/index'
import './SpecialFilter.style.scss'

export function SpecialFilter ({ onCountryChange, countryValue, onChange, topicsArray }) {
  const [checkedItems, setCheckedItems] = useState({})

  function handleCheckboxChange (e) {
    const { id, checked } = e.target

    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = {
        ...prevCheckedItems,
        [id]: checked
      }

      onChange(updatedCheckedItems)
      return updatedCheckedItems
    })
  }

  const numberOfChecked = Object.values(checkedItems).filter(Boolean).length

  function resetCheckboxes () {
    const checkboxes = document.querySelectorAll('.special-filter__checkbox-item')
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false
    })
  }

  function handleRemoveAllFilter () {
    setCheckedItems({})
    onChange({})
    resetCheckboxes()
  }

  return (
    <div className='special-filter__container'>
      <div className='special-filter__title-container'>
        <h3 className='special-filter__title'>Special Filter</h3>
        <span className='special-filter__title-amount__border'>
          <p className='special-filter__title-amount'>{numberOfChecked}</p>
        </span>
      </div>
      <div className='special-filter__checkbox-wrapper'>
        <ul className='special-filter__list'>
          {Object.entries(topicsArray).map(([key, value]) => {
            const id = `checkbox-${key}`

            return (
              <li key={key}>
                <label className='special-filter__item'>
                  <input
                    className='special-filter__checkbox-item'
                    type='checkbox'
                    id={id}
                    defaultChecked={false}
                    onChange={handleCheckboxChange}
                  />
                  <p className='special-filter__checkbox-subtext'>{value}</p>
                </label>
              </li>
            )
          })}
        </ul>
      </div>
      <button
        type='button'
        className='special-filter__button'
        onClick={() => handleRemoveAllFilter()}
      >
        <assets.Close width={16} height={16} className='special-filter__icon' />
        Remove all filters
      </button>
      <CountryFilter
        onChange={onCountryChange}
        value={countryValue}
      />
    </div>
  )
}
