import { useLocation, useNavigate, useParams } from 'react-router'
import React, { useEffect, useState } from 'react'
import { AdminEditProfileButton, AdminEditProfileContainer, AdminEditProfileTitle, AdminEntityDataAside, AdminEntityNameForm, Button, Title, AdminEditProfileLabelContainer, AdminEditProfileTopics, AdminEditProfileDataSource } from 'components'
import { AdminEditPropertyArray, TitleCapiralize, nameObject, transformArrayValues } from 'helpers'
import { useAlert } from 'providers'
import { createAdminEntity, createAdminEntityDataset, deleteAdminEntityById, getAdminEntityById, updateAdminEntityById } from 'api/requests'
import './AdminEditProfileDetailPage.style.scss'

function AdminEditProfileDetailPage () {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { displayAlert } = useAlert()
  const [entityObject, setEntityObject] = useState()
  const [entityObjectAside, setEntityObjectAside] = useState()
  const [installedProperty, setInstalledProperty] = useState('Person')
  const [schemaProperty, setSchemaProperty] = useState('')
  const [caption, setCaption] = useState()
  const [selectedProperty, setSelectedProperty] = useState([])
  const [descriptionArray, setDescriptionArray] = useState([])
  const [topicsArray, setTopicsArray] = useState([])
  const [datasetsArray, setDatasets] = useState([])
  const [datasetsCreatedArray, setDatasetsCreatedArray] = useState([])
  const [datasetsCreatedIdArray, setDatasetsCreatedIdArray] = useState([])
  const [isDatasetCreated, setIsDatasetCreated] = useState(false)
  const [isDatasetUpdated, setIsDatasetUpdated] = useState(false)
  const [propertiesObject, setPropertiesObject] = useState({})

  const currentPageIndex = AdminEditPropertyArray.findIndex((page) => page[installedProperty])
  const propertyOptions = currentPageIndex !== -1 ? AdminEditPropertyArray[currentPageIndex][installedProperty] : []
  const newPropertyArray = transformArrayValues(propertyOptions, nameObject[0])
  const sortedPropertyArray = newPropertyArray.slice().sort((a, b) => a.localeCompare(b))
  const keyValuePairs = newPropertyArray.map((value, index) => ({ key: propertyOptions[index], value }))
  keyValuePairs.sort((a, b) => a.value.localeCompare(b.value))
  const sortedPropertyKeys = keyValuePairs.map(pair => pair.key)

  const [sortedSelectValue, setSortedSelectValue] = useState(sortedPropertyArray.map(item => ({ value: item, reserved: false })))
  const [sortedSelectKeys, setSortedSelectKeys] = useState(sortedPropertyKeys) //eslint-disable-line
  const [statusValue, setStatusValue] = useState('')
  const [statusSelectValue, setStatusSelectValue] = useState()
  const [displayValue, setDisplayValue] = useState('')
  const [displaySelectValue, setDisplaySelectValue] = useState()
  const [factsheets, setFactsheets] = useState(0)
  const [dataSources, setDataSources] = useState(0)
  const [notes, setDescription] = useState(0)

  async function fetchDataAndSaveIds (dataArray, fetchDataFunction, setIdArrayFunction) {
    const idArray = []
    try {
      if (dataArray.length !== 0) {
        const results = await Promise.all( //eslint-disable-line
          dataArray.map(async (obj) => {
            const response = await fetchDataFunction(obj)
            if (response.message) {
              return displayAlert(response.message, 10000, 'red')
            }
            idArray.push(response.id)
            return response
          })
        )
      }
      setIdArrayFunction(idArray)
    } catch (err) {
      console.error(err)
      return err
    }
  }

  async function createAdminEntityOnSave () {
    try {
      await fetchDataAndSaveIds(datasetsCreatedArray, createAdminEntityDataset, setDatasetsCreatedIdArray)
      setIsDatasetCreated(!isDatasetCreated)
    } catch (err) {
      console.error(err)
      return err
    }
  }

  async function createAdminEntityOnSaveUseEffect () {
    try {
      await createAdminEntity(displaySelectValue, statusSelectValue, handleBuildEntity())
      setIsDatasetCreated(false)
      displayAlert('Entity Created. You will be redirected to a entity list', 5000, 'red')
      setTimeout(() => {
        navigate('/admin/entities')
      }, 5000)
    } catch (err) {
      console.error(err)
      return err
    }
  }

  async function updateAdminEntityOnSave () {
    try {
      await fetchDataAndSaveIds(datasetsCreatedArray, createAdminEntityDataset, setDatasetsCreatedIdArray)
      setIsDatasetUpdated(!isDatasetUpdated)
    } catch (err) {
      console.error(err)
      return err
    }
  }

  async function updateAdminEntityOnSaveUseEffect () {
    try {
      await updateAdminEntityById(id, displaySelectValue, statusSelectValue, handleBuildEntity())
      setIsDatasetUpdated(false)
      displayAlert('Entity Updated. You will be redirected to a entity list', 5000, 'red')
      setTimeout(() => {
        handleReturn()
      }, 5000)
    } catch (err) {
      console.error(err)
      return err
    }
  }

  async function deleteAdminEntityOnClick () {
    try {
      await deleteAdminEntityById(id)
      displayAlert('Entity Deleted. You will be redirected to a entity list', 5000, 'red')
      setTimeout(() => {
        navigate('/admin/entities')
      }, 5000)
    } catch (err) {
      console.error(err)
      return err
    }
  }

  const keysArray = [
    { name: 'Draft', value: 'DRAFT' },
    { name: 'Private', value: 'PRIVATE' },
    { name: 'Public', value: 'PUBLIC' },
    { name: 'Verified', value: 'VERIFIED' },
    { name: 'Incorrect', value: 'INCORRECT' },
    { name: 'Unverified', value: 'UNVERIFIED' }
  ]

  function handleEntityTypeChange (e) {
    const { value } = e.target
    if (value === 'Type') setSchemaProperty('')
    else setSchemaProperty(value)
  }

  function handleCaptionChange (e) {
    const { value } = e.target
    setCaption(value)
  }

  function handleFilterValueChange (e, select) {
    const { value } = e.target

    if (select === 'status') {
      if (value === 'Status') {
        const newValue = null
        setStatusValue(value)
        setStatusSelectValue(newValue)
      } else {
        const result = keysArray.find((item) => item.name === value)?.value
        setStatusValue(value)
        setStatusSelectValue(result)
      }
    } else {
      if (value === 'Display') {
        const newValue = null
        setDisplayValue(value)
        setDisplaySelectValue(newValue)
      } else {
        const result = keysArray.find((item) => item.name === value)?.value
        setDisplayValue(value)
        setDisplaySelectValue(result)
      }
    }
  }

  function handleDatasetSave (datasetItem, index) {
    setDatasetsCreatedArray((prevDatasets) => {
      const updatedDatasets = [...prevDatasets]
      updatedDatasets[index] = datasetItem
      return updatedDatasets
    })
  }

  function handleDatasetDelete (index) {
    setDatasetsCreatedArray((prevDatasets) => {
      return prevDatasets.filter((_, i) => i !== index)
    })
  }

  function handleRecordTopics (value) {
    setTopicsArray(value)
  }

  function handleChangeProperty (property) {
    if (!selectedProperty.includes(property)) {
      setSelectedProperty(prevSelectedProperty => [...prevSelectedProperty, property])
      handleToggleValueInSelectArray(property)
    }
  }

  function handleRemoveProperty (propertyToRemove) {
    const updatedProperties = selectedProperty.filter(property => property !== propertyToRemove)
    handleRemovePropertyFromSelectArray(propertyToRemove)
    setFactsheets(factsheets - 1)
    setSelectedProperty(updatedProperties)
  }

  function handleToggleValueInSelectArray (value) {
    const valueToKey = Object.entries(nameObject[0]).find(([key, v]) => key === value)?.[1]
    const indexInSelected = sortedSelectValue.find(item => item.value === valueToKey)
    const index = sortedSelectValue.indexOf(indexInSelected)

    setSortedSelectValue(prev => {
      const updatedArray = prev.copyWithin()
      updatedArray[index].reserved = true
      return updatedArray
    })
  }

  function handleRemovePropertyFromSelectArray (value) {
    const valueToKey = Object.entries(nameObject[0]).find(([key, v]) => key === value)?.[1]
    const indexInSelected = sortedSelectValue.find(item => item.value === valueToKey)
    const index = sortedSelectValue.indexOf(indexInSelected)

    setSortedSelectValue(prev => {
      const updatedArray = prev.copyWithin()
      updatedArray[index].reserved = false
      return updatedArray
    })
  }

  function handleChangeObjectValue (e) {
    const { name, value } = e.target

    setPropertiesObject((prevData) => {
      return { ...prevData, [name]: value }
    })
  }

  function handleDatasetsChange (value, index) {
    setDatasets((prevDatasets) => {
      const updatedDatasets = [...prevDatasets]
      updatedDatasets[index] = value
      return updatedDatasets
    })
  };

  function handleDatasetsClear (index) {
    setDatasets((prevDatasets) => {
      const updatedDescriptions = prevDatasets.filter((_, i) => i !== index)
      return updatedDescriptions
    })
    setDataSources(dataSources - 1)
  }

  function handleDescriptionChange (value, index) {
    setDescriptionArray((prevDescriptions) => {
      const updatedDescriptions = [...prevDescriptions]
      updatedDescriptions[index] = value
      return updatedDescriptions
    })
  };

  function handleDescriptionClear (index) {
    setDescriptionArray((prevDescriptions) => {
      const updatedDescriptions = prevDescriptions.filter((_, i) => i !== index)
      return updatedDescriptions
    })
    setDescription(notes - 1)
  }

  function handleIncreaseDataSources () {
    setDataSources(dataSources + 1)
  };
  function handleIncreaseFactsheets () {
    setFactsheets(factsheets + 1)
  };
  function handleIncreaseDescription () {
    setDescription(notes + 1)
  };

  function handleReturn () {
    navigate(location.state.from.pathname + location.state.from.search)
  }

  function updatePropertiesObject (selectedArray, property) {
    const updatedObject = { ...propertiesObject }
    updatedObject[property] = selectedArray || []

    setPropertiesObject(updatedObject)
  }

  function handleBuildEntity () {
    const entityNotes = entityObject?.properties?.notes || []
    const entityTopics = entityObject?.properties?.topics || []
    const entityDatasets = entityObject?.datasets || []

    const combinedNotes = removeDuplicates([...entityNotes, ...descriptionArray])
    const combinedTopics = removeDuplicates([...topicsArray, ...entityTopics])
    const datasetsFinalArray = datasetsArray.length !== 0 ? datasetsArray.flat().map(item => item) : []
    const datasetsUpdatedArray = removeDuplicates([...datasetsFinalArray, ...datasetsCreatedIdArray, ...entityDatasets])

    function removeDuplicates (arr) {
      return [...new Set(arr)]
    }

    function mergeObjects (obj1, obj2) {
      if (obj1 === undefined) {
        return obj2
      }
      const merged = { ...obj1 }

      for (const key in obj2) {
        if (obj2[key] !== undefined) {
          if (Array.isArray(obj2[key]) && obj2[key].length > 0) {
            merged[key] = Array.isArray(merged[key]) && merged[key].length > 0
              ? [...merged[key], ...obj2[key]]
              : [...obj2[key]]
          } else if (typeof obj2[key] === 'object' && obj2[key] !== null) {
            merged[key] = mergeObjects(merged[key] || {}, obj2[key])
          } else {
            merged[key] = obj2[key]
          }
        }
      }

      return merged
    }

    const mergedObject = entityObject !== undefined ? mergeObjects(entityObject.properties, propertiesObject) : propertiesObject

    const entity = {
      caption,
      datasets: datasetsUpdatedArray,
      properties: {
        ...mergedObject, notes: combinedNotes, topics: combinedTopics
      },
      schema: installedProperty
    }

    return entity
  };

  function copyNonEmptyValues (source, target) {
    const updatedObject = { ...target }
    for (const key in source) {
      if (Array.isArray(source?.[key]) && source?.[key].length > 0 && source?.[key] !== undefined) {
        updatedObject[key] = source?.[key].map(item => (item !== undefined ? item : null))
      }
    }
    return updatedObject
  }

  useEffect(() => {
    if (schemaProperty !== '') setInstalledProperty(schemaProperty)
  }, [schemaProperty])

  useEffect(() => {
    async function fetchData () {
      try {
        const res = await getAdminEntityById(id)

        if (res.message) {
          return displayAlert(res.message, 10000, 'red')
        }
        setEntityObject(res.data)
        const { data, ...restOfRes } = res
        setEntityObjectAside({ ...restOfRes, caption: res.data.schema, schema: res.data.schema })
        setSchemaProperty(res.data.schema)
      } catch (err) {
        console.error(err)
      }
    }
    if (id !== 'create') fetchData()
  }, [id])

  useEffect(() => {
    if (entityObject !== undefined) {
      setCaption(entityObject.caption)
      const newPropertiesObject = { ...propertiesObject }
      const updatedPropertiesObject = copyNonEmptyValues(entityObject.properties, newPropertiesObject)
      setPropertiesObject(updatedPropertiesObject)
    }
  }, [entityObject])

  useEffect(() => {
    if (isDatasetCreated) createAdminEntityOnSaveUseEffect()
  }, [isDatasetCreated])

  useEffect(() => {
    if (isDatasetUpdated) updateAdminEntityOnSaveUseEffect()
  }, [isDatasetUpdated])

  useEffect(() => {
    if (entityObjectAside !== undefined) {
      if (entityObjectAside.state) {
        const result = keysArray.find((item) => item.value === entityObjectAside?.state)
        setDisplayValue(TitleCapiralize(entityObjectAside?.state))
        setDisplaySelectValue(result)
      } else {
        const newValue = null
        setDisplayValue('Display')
        setDisplaySelectValue(newValue)
      }

      if (entityObjectAside.status) {
        const result = keysArray.find((item) => item.value === entityObjectAside?.status)
        setStatusValue(TitleCapiralize(entityObjectAside?.status))
        setStatusSelectValue(result)
      } else {
        const newValue = null
        setStatusValue('Status')
        setStatusSelectValue(newValue)
      }
    }
  }, [entityObjectAside?.state, entityObjectAside?.status])

  return (
    <section className='padding-top' aria-label='bulk uploader section'>
      <div className='container no-flex no-padding__top-bottom'>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div className='admin-edit__body-wrapper'>
            <div className='admin-edit__header-wrapper'>
              {location.state
                ? <Button
                    text='Back'
                    type='back'
                    ariaLabel='button for returning to previous page'
                    className='btn-search padding-8-12 border-black'
                    onClick={handleReturn}
                  />
                : ''}
              {id === 'create' && schemaProperty === ''
                ? (
                  <Title text='Please, select EntityType to start creating' />
                  )
                : (
                  <Title text='Entity Profile' />
                  )}
              {schemaProperty !== '' && (
                <AdminEntityNameForm value={caption} onChange={handleCaptionChange} />
              )}
            </div>
            {schemaProperty !== '' && (
              <>
                <AdminEditProfileContainer>
                  <AdminEditProfileTitle>Factsheet</AdminEditProfileTitle>
                  {Array.from({ length: factsheets }).map((item, index) => {
                    return (
                      <AdminEditProfileLabelContainer
                        key={index}
                        onClick={handleRemoveProperty} onChange={handleChangeObjectValue} search star onSelectProperty={handleChangeProperty}
                        currentProperty={installedProperty} currentPropertyInArray={selectedProperty[index]}
                        propertyArray={selectedProperty} updateObject={updatePropertiesObject} arrayForSelect={sortedSelectValue} keysArrayForSelect={sortedSelectKeys} originalSortedArray={sortedPropertyArray}
                      />
                    )
                  })}
                  <AdminEditProfileButton increment={handleIncreaseFactsheets} propertyArray={selectedProperty} digit={factsheets} />
                </AdminEditProfileContainer>
                <AdminEditProfileContainer>
                  <AdminEditProfileTitle>Description</AdminEditProfileTitle>
                  {Array.from({ length: notes }).map((item, i) => {
                    return <AdminEditProfileLabelContainer key={i} index={i} textarea text='Description' onChange={handleDescriptionChange} onClick={handleDescriptionClear} disableDelete={i !== descriptionArray.length - 1} descriptionArray={descriptionArray} />
                  })}
                  <AdminEditProfileButton increment={handleIncreaseDescription} />
                </AdminEditProfileContainer>
                <AdminEditProfileContainer>
                  <AdminEditProfileTitle>Data Sources</AdminEditProfileTitle>
                  {Array.from({ length: dataSources }).map((v, i) => {
                    return <AdminEditProfileDataSource key={i} index={i} onChange={handleDatasetsChange} onDelete={handleDatasetsClear} onSave={handleDatasetSave} onDeleteDataset={handleDatasetDelete} datasetsArray={datasetsArray} disableDelete={i !== datasetsCreatedArray.length - 1} disableDeleteDatasets={i !== datasetsArray.length - 1} />
                  })}
                  <AdminEditProfileButton increment={handleIncreaseDataSources} />
                </AdminEditProfileContainer>
              </>
            )}
          </div>
          <div className='admin-edit__aside-wrapper'>
            <AdminEntityDataAside statusSelectValue={statusValue} displaySelectValue={displayValue} onChange={handleFilterValueChange} onSave={id !== 'create' ? updateAdminEntityOnSave : createAdminEntityOnSave} onBuild={handleBuildEntity} onDelete={id !== 'create' ? deleteAdminEntityOnClick : null} entityType={schemaProperty} onChangeEntityType={handleEntityTypeChange} entityObjectAside={entityObjectAside} />
            {schemaProperty !== '' && (
              <AdminEditProfileTopics onRecord={handleRecordTopics} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminEditProfileDetailPage
