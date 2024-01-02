import { useEffect, useRef, useState } from 'react'
import { allCountriesList, entityCreateDatasetType } from 'helpers'
import { useStore } from 'providers'
import assets from '../../../../assets/index'
import './AdminEditProfileDataSource.style.scss'

export function AdminEditProfileDataSource ({ onChange, onDelete, onSave, index, datasetsArray, onDeleteDataset, disableDelete, disableDeleteDatasets }) {
  const { datasets } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [countryValue, setCountryValue] = useState('')
  const [countryKey, setCountryKey] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedTopics, setSelectedTopics] = useState([])
  const [selectedCountry, setSelectedCountry] = useState([])
  const [selectedDatasets, setSelectedDatasets] = useState([])
  const [selectedDatasetsKeys, setSelectedDatasetsKeys] = useState([])
  const [deletedData, setDeletedData] = useState(false)
  const [shouldSave, setShouldSave] = useState(false)
  const [datasetItem, setDataSetItem] = useState({
    country: '',
    description: '',
    publisher_name: '',
    publisher_url: '',
    source_url: '',
    tags: [],
    title: ''
  })
  const [editMode, setEditMode] = useState(false)
  const inputRef = useRef()
  const tagsRef = useRef()
  const countryRef = useRef()

  function handleSave () {
    const countryString = datasetItem.country.length !== 0 ? datasetItem.country.join(', ').toLowerCase() : ''
    const tagsString = datasetItem.tags.length !== 0 ? datasetItem.tags.join(', ') : ''
    onSave({ ...datasetItem, country: countryString, tags: tagsString }, index)
    setShouldSave(false)
  }

  function handleChangeDatasetDetail (e) {
    const { name, value } = e.target
    setDataSetItem({ ...datasetItem, [name]: value })
  }

  function findArrayByIndex (array, index) {
    return array.find((_, i) => i === index)
  }

  function handleClearDatasets () {
    setSelectedTopics([])
    setDeletedData(true)
    onDelete(index)
  }

  function handleClearCreatedDataset () {
    setDataSetItem({
      country: '',
      description: '',
      publisher_name: '',
      publisher_url: '',
      source_url: '',
      tags: [],
      title: ''
    })
    onDelete(index)
    onDeleteDataset(index)
  }

  function findCountry () {
    const query = countryValue.toLowerCase().trim()

    if (!query) return []

    return allCountriesList
      .filter(item => item.name.toLowerCase().includes(query))
      .map(item => item.name)
  }

  function findDatasets () {
    const query = inputValue.toLowerCase().trim()

    if (!query) return []

    return entityCreateDatasetType
      .filter(item => item.toLowerCase().includes(query))
      .map(item => item)
  }

  function handleRemoveValue (index) {
    const updatedValues = [...selectedDatasets]
    updatedValues.splice(index, 1)
    setSelectedDatasets(updatedValues)
  }
  function handleRemoveCountry (index) {
    const updatedValues = [...selectedCountry]
    const updatedKeys = [...countryKey]
    updatedKeys.splice(index, 1)
    updatedValues.splice(index, 1)
    setCountryKey(updatedKeys)
    setSelectedCountry(updatedValues)
  }

  function filterDatasets () {
    const query = searchQuery.toLowerCase().trim()

    if (!query) {
      return []
    }

    return datasets.data
      .filter(item => item.title.toLowerCase().includes(query) &&
      !datasetsArray.flat().includes(item.id))
      .map(filteredItem => filteredItem.title)
  }

  function handleDivClick () {
    inputRef.current.focus()
  };

  function handleSelectDataset (dataset) {
    if (!selectedDatasets.includes(dataset)) {
      setSelectedDatasets([...selectedDatasets, dataset])
    }
    setInputValue('')
  }
  function handleSelectCountry (dataset) {
    if (!selectedCountry.includes(dataset)) {
      setSelectedCountry([...selectedCountry, dataset])
      setCountryKey([...countryKey, allCountriesList.find(item => item.name === dataset)?.code])
    }
    setCountryValue('')
  }
  function handleSelectTopic (dataset) {
    const flattenedDatasets = datasetsArray.flat()
    const foundedDataset = datasets.data.find(item => item.title === dataset)?.id
    if (!flattenedDatasets.includes(foundedDataset)) {
      setSelectedTopics([...selectedTopics, dataset])
      setSelectedDatasetsKeys((prevKeys) => [...prevKeys, datasets.data.find(item => item.title === dataset)?.id])
    }
    setSearchQuery('')
    setDeletedData(false)
  }

  function handleChangeEditMode () {
    setEditMode(!editMode)
  }

  useEffect(() => {
    if (datasetsArray[index] !== undefined) {
      const foundArray = findArrayByIndex(datasetsArray, index)
      const title = datasets.data
        .filter((item) => foundArray.includes(item.id))
        .map((item) => item.title)
      setSelectedTopics([...title])
    }
  }, [datasetsArray, index, deletedData])

  useEffect(() => {
    const areRequiredFieldsFilled =
    datasetItem.publisher_name !== '' &&
    datasetItem.description !== '' &&
    datasetItem.publisher_url !== '' &&
    datasetItem.title !== ''

    const areOptionalFieldsUpdated =
    selectedCountry.length >= 0 ||
    selectedDatasets.length >= 0 ||
    (datasetItem.source_url !== '' || datasetItem.source_url === '')

    setShouldSave(areRequiredFieldsFilled && areOptionalFieldsUpdated)
  }, [datasetItem, selectedDatasets, selectedCountry])

  useEffect(() => {
    if (shouldSave) {
      handleSave()
    }
  }, [shouldSave])

  useEffect(() => {
    if (selectedDatasets.length !== 0) {
      datasetItem.tags = [...selectedDatasets]
    } else datasetItem.tags = []
  }, [selectedDatasets])
  useEffect(() => {
    if (countryKey.length !== 0) {
      datasetItem.country = [...countryKey]
    } else datasetItem.country = []
  }, [countryKey])

  useEffect(() => {
    if (selectedDatasetsKeys.length !== 0) onChange(selectedDatasetsKeys, index)
  }, [selectedDatasetsKeys])

  return (
    <>
      {!editMode
        ? (
          <div className='admin-edit__label'>
            <div className='admin-edit__label-item'>
              <button
                className='admin-edit__label-button'
                aria-label='button for deleting label from view'
                onClick={() => handleClearDatasets()}
              >
                <assets.Trash width={20} height={20} title='Delete button' />
              </button>
              <p className='report-form__subtext'>Source Title <span className='report-form__subtext--star'>*</span></p>
              <div className='admin-edit__label-multiple__container admin-topics--selected' onClick={handleDivClick}>
                {selectedTopics.map((selectedTopic, index) => (
                  <li key={selectedTopic} className='recentsearch-list__item' onClick={() => handleSelectTopic(selectedTopic)}>
                    <p className='recentsearch-subtitle'>{selectedTopic}</p>
                  </li>
                ))}
                <input
                  className='admin-edit__label-input'
                  ref={inputRef}
                  style={selectedTopics.length === 1 ? { display: 'none' } : {}}
                  placeholder='Search topics'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className='admin-changelog--element'>
                {searchQuery.trim() !== '' && (
                  <ul className='admin-topics__search-container'>
                    {filterDatasets().map((result, index) => (
                      <li key={result} className='recentsearch-list__item' onClick={() => handleSelectTopic(result)}>
                        <p className='recentsearch-subtitle'>{result}</p>
                      </li>
                    ))}
                    {filterDatasets().length === 0 && searchQuery.trim() !== '' && (
                      <div className='admin-edit__dataSource--no-results'>No search results. But no worries, <button onClick={handleChangeEditMode}>create some!</button></div>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
          )
        : (
          <>
            <div className='admin-edit__label'>
              <div className='admin-edit__label-item'>
                <button
                  className='admin-edit__label-button'
                  aria-label='button for deleting label from view'
                  disabled={disableDelete}
                  onClick={() => handleClearCreatedDataset()}
                >
                  <assets.Trash width={20} height={20} />
                </button>
                <p className='report-form__subtext'>Source Title <span className='report-form__subtext--star'>*</span></p>
                <input
                  className='admin-edit__label-input'
                  placeholder='Enter datasource title'
                  name='title'
                  value={datasetItem.title}
                  onChange={handleChangeDatasetDetail}
                />
              </div>
              <div className='admin-edit__label-item'>
                <p className='report-form__subtext'>Country</p>
                <div className='admin-edit__label-multiple__container admin-topics--selected'>
                  {selectedCountry.map((selectedCountry, index) => (
                    <li key={index} className='admin-edit__label-multiple__container-item'>
                      <button
                        onClick={() => handleRemoveCountry(index)} className='admin-edit__label-multiple__container-item__button'
                      >
                        <assets.Close width={16} height={16} />
                      </button>
                      {selectedCountry}
                    </li>
                  ))}
                  <input
                    className='admin-edit__label-input'
                    ref={countryRef}
                    placeholder='Search country'
                    disabled={countryKey.length === 1}
                    style={countryKey.length === 1 ? { display: 'none' } : {}}
                    name='country'
                    value={countryValue}
                    onChange={(e) => setCountryValue(e.target.value)}
                  />
                </div>
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
              </div>
              <div className='admin-edit__label-item'>
                <p className='report-form__subtext'>Short Decription <span className='report-form__subtext--star'>*</span></p>
                <input
                  className='admin-edit__label-input'
                  placeholder='Enter short description of the datasource'
                  name='description'
                  value={datasetItem.description}
                  onChange={handleChangeDatasetDetail}
                />
              </div>
              <div className='admin-edit__label-item'>
                <p className='report-form__subtext'>Source URL</p>
                <input
                  className='admin-edit__label-input'
                  placeholder='https://example.com'
                  name='source_url'
                  value={datasetItem.source_url}
                  onChange={handleChangeDatasetDetail}
                />
              </div>
              <div className='admin-edit__label-item'>
                <p className='report-form__subtext'>Publisher Name <span className='report-form__subtext--star'>*</span></p>
                <input
                  className='admin-edit__label-input'
                  placeholder='Publisher name'
                  name='publisher_name'
                  value={datasetItem.publisher_name}
                  onChange={handleChangeDatasetDetail}
                />
              </div>
              <div className='admin-edit__label-item'>
                <p className='report-form__subtext'>Publisher URL <span className='report-form__subtext--star'>*</span></p>
                <input
                  className='admin-edit__label-input'
                  placeholder='https://publlisher.com'
                  name='publisher_url'
                  value={datasetItem.publisher_url}
                  onChange={handleChangeDatasetDetail}
                />
              </div>
              <div className='admin-edit__label-item'>
                <p className='report-form__subtext'>Tags</p>
                <div className='admin-edit__label-multiple__container admin-topics--selected'>
                  {selectedDatasets.map((selectedDatasets, index) => (
                    <li key={index} className='admin-edit__label-multiple__container-item'>
                      <button
                        onClick={() => handleRemoveValue(index)} className='admin-edit__label-multiple__container-item__button'
                      >
                        <assets.Close width={16} height={16} />
                      </button>
                      {selectedDatasets}
                    </li>
                  ))}
                  <input
                    className='admin-edit__label-input'
                    ref={tagsRef}
                    placeholder='Search datasets'
                    name='tags'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
                <div className='admin-changelog--element'>
                  {inputValue.trim() !== '' && (
                    <ul className='admin-topics__search-container'>
                      {findDatasets().map((result, index) => (
                        <li key={result} className='recentsearch-list__item' onClick={() => handleSelectDataset(result)}>
                          <p className='recentsearch-subtitle'>{result}</p>
                        </li>
                      ))}
                      {findDatasets().length === 0 && inputValue.trim() !== '' && (
                        <div className='admin-edit__dataSource--no-results'>No search results.</div>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
          )}
    </>
  )
}
