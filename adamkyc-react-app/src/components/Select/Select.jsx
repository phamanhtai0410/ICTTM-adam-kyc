import React from 'react'
import './Select.style.scss'

export function defaultOption (type) {
  if (type === 'filter') {
    return 'All Types'
  } else if (type === 'sort') {
    return 'Lasted Updated'
  } else if (type === 'country') {
    return 'All Countries'
  } else if (type === 'select country') {
    return 'Select country'
  } else if (type === 'status') {
    return 'Status'
  } else if (type === 'display') {
    return 'Display'
  } else if (type === 'value') {
    return 'Choose value'
  } else {
    return 'Type'
  }
}

export function Select ({ data, isAdvancedSearch, onChange, type, value, Vessels, Admin, transformedData, isSelected, selectedValue }) {
  const defaultOptionText = defaultOption(type)

  const styles = isAdvancedSearch || Vessels
    ? { width: '100%', height: '36px', maxWidth: '100%' }
    : Admin
      ? { width: '54%', height: '33px', maxWidth: '54%' }
      : {}

  return (
    <select
      className='filter-select__menu'
      onChange={onChange}
      style={styles}
      value={value}
      disabled={isSelected}
    >
      <option defaultValue={selectedValue || defaultOptionText}>
        {selectedValue || defaultOptionText}
      </option>
      {typeof data?.[0] === 'object'
        ? (
            data?.map((item, index) => { //eslint-disable-line
              if (item.reserved === false) {
                return (
                  <option key={index} value={transformedData?.[index] || item.value}>{item.value}</option>
                )
              }
            })
          )
        : (
            data?.map((data, index) => {
              return (
                <option key={index} value={transformedData?.[index] || data}>{data}</option>
              )
            })
          )}
    </select>
  )
}
