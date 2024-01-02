import { Select } from 'components'
import { useEffect, useRef, useState } from 'react'
import { allCountriesList, findValueByKey, mockCountryMultiFilterEditor, nameObject } from 'helpers'
import assets from '../../../../assets/index'
import './AdminEditProfileLabelContainer.style.scss'

export function AdminEditProfileLabelContainer ({ onSelectProperty, currentProperty = 'Test', value, order, onClick, onChange, text, star, search, textarea, currentPropertyInArray, propertyArray, updateObject, index, disableDelete, arrayForSelect, keysArrayForSelect, originalSortedArray, descriptionArray }) {
  const [inputValue, setInputValue] = useState('')
  const [countryValue, setCountryValue] = useState('')
  const [countryKey, setCountryKey] = useState([])
  const [selectedValues, setSelectedValues] = useState([])
  const [selectedCountry, setSelectedCountry] = useState([])
  const [selectValue, setSelectValue] = useState()
  const [dropDown, setDropDown] = useState(false)
  const [description, setDescription] = useState('')
  const inputRef = useRef(null)

  function handleInputChange (e) {
    setInputValue(e.target.value)
  }
  function handleCountryInputChange (e) {
    setCountryValue(e.target.value)
  }
  function handleDescriptionChange (e) {
    setDescription(e.target.value)
  }

  function findCountry () {
    const query = countryValue.toLowerCase().trim()

    if (!query) return []

    return allCountriesList
      .filter(item => item.name.toLowerCase().includes(query))
      .map(item => item.name)
  }
  function handleSelectCountry (dataset) {
    if (!selectedCountry.includes(dataset)) {
      setSelectedCountry([...selectedCountry, dataset])
      setCountryKey([...countryKey, allCountriesList.find(item => item.name === dataset)?.code])
    }
    setCountryValue('')
  }
  function handleRemoveCountry (index) {
    const updatedValues = [...selectedCountry]
    updatedValues.splice(index, 1)
    setSelectedCountry(updatedValues)
  }

  function handleInputKeyDown (e) {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setSelectedValues([...selectedValues, inputValue.trim()])
      setInputValue('')
    }
  }

  function handleSelectDropdownValue (value) {
    setSelectedValues([...selectedValues, value.trim()])
    setInputValue('')
    setDropDown(false)
  }

  function handleDivClick () {
    inputRef.current.focus()
  };

  function handleRemoveValue (index) {
    const updatedValues = [...selectedValues]
    updatedValues.splice(index, 1)
    setSelectedValues(updatedValues)
  }

  function handleSelectProperty (e) {
    const { value } = e.target
    onSelectProperty(value)
    setSelectValue(value)
  }

  useEffect(() => {
    if (selectedValues.length !== 0) updateObject(selectedValues, currentPropertyInArray)
  }, [selectedValues])

  useEffect(() => {
    if (descriptionArray !== undefined) {
      if (description !== descriptionArray[index]) {
        setDescription(descriptionArray[index])
      }
    }
  }, [descriptionArray])

  useEffect(() => {
    if (description !== '') onChange(description, index)
  }, [description])

  useEffect(() => {
    if (inputRef.current && inputRef.current.value.trim() !== '') {
      setDropDown(true)
    } else setDropDown(false)
  }, [inputValue])

  useEffect(() => {
    if (propertyArray?.length === 0) setSelectValue()
  }, [propertyArray])

  return (
    <div className='admin-edit__label'>
      <div className='admin-edit__label-item'>
        <button
          className='admin-edit__label-button'
          aria-label='button for deleting label from view'
          onClick={() => onClick(!textarea ? currentPropertyInArray : index)}
        >
          <assets.Trash width={20} height={20} title='Delete button' />
        </button>
        <p className='report-form__subtext'>
          {text || 'Label'} {star ? <span className='report-form__subtext--star'>*</span> : null}
        </p>
        {!textarea
          ? (
            <Select onChange={handleSelectProperty} value={currentPropertyInArray || selectValue} isSelected={selectValue} type='value' data={arrayForSelect} transformedData={keysArrayForSelect} isAdvancedSearch selectedValue={Object.entries(nameObject[0]).find(([key, v]) => key === selectValue)?.[1]} />
            )
          : (
            <textarea
              className='admin-edit__label-textarea'
              value={description}
              onChange={handleDescriptionChange}
              placeholder='Write your description here'
            />
            )}
      </div>
      {search && (
        <>
          <div className='admin-edit__label-item' {...search ? { onClick: handleDivClick } : {}}>
            <p className='report-form__subtext'>{findValueByKey(nameObject[0], currentPropertyInArray) || 'Value'} <span className='report-form__subtext--star'>*</span></p>
            <div className='admin-edit__label-multiple__container'>
              {(currentPropertyInArray && mockCountryMultiFilterEditor.includes(currentPropertyInArray))
                ? (
                    selectedCountry.map((selectedCountry, index) => (
                      <li key={index} className='admin-edit__label-multiple__container-item'>
                        <button
                          onClick={() => handleRemoveCountry(index)} className='admin-edit__label-multiple__container-item__button'
                        >
                          <assets.Close width={16} height={16} />
                        </button>
                        {selectedCountry}
                      </li>
                    ))
                  )
                : (
                    selectedValues.map((value, index) => (
                      <li key={index} className='admin-edit__label-multiple__container-item'>
                        <button onClick={() => handleRemoveValue(index)} className='admin-edit__label-multiple__container-item__button'><assets.Close width={16} height={16} /></button>
                        {value}
                      </li>
                    ))
                  )}
              <input
                className='admin-edit__label-input'
                ref={inputRef}
                onChange={mockCountryMultiFilterEditor.includes(currentPropertyInArray) ? handleCountryInputChange : handleInputChange}
                onKeyDown={handleInputKeyDown}
                value={mockCountryMultiFilterEditor.includes(currentPropertyInArray) ? countryValue : inputValue}
                placeholder='Type and press Enter to add'
                readOnly={currentPropertyInArray === undefined || selectValue === undefined}
              />
            </div>
          </div>
          {(!mockCountryMultiFilterEditor.includes(currentPropertyInArray) && dropDown) && (
            <div className='admin-edit__dropdown' style={{ marginTop: '-16px' }}>
              <ul className='admin-edit__dropdown-list'>
                <li className='admin-edit__dropdown-element' onClick={() => handleSelectDropdownValue(inputValue)}>
                  {inputValue}
                </li>
              </ul>
            </div>
          )}
          {mockCountryMultiFilterEditor.includes(currentPropertyInArray) && (
            <div className='admin-changelog--element'>
              {countryValue.trim() !== '' && (
                <ul className='admin-topics__search-container'>
                  {findCountry().map((result, index) => (
                    <li key={result} className='recentsearch-list__item' onClick={() => handleSelectCountry(result)}>
                      <p className='recentsearch-subtitle'>{result}</p>
                    </li>
                  ))}
                  {findCountry().length === 0 && countryValue.trim() !== '' && (
                    <div className='admin-edit__dataSource--no-results'>No search results.</div>
                  )}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
