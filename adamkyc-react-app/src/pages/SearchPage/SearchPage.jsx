import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MockFilterOptions, mockSortOptions, updateArrayOfObjects, modifiedValue, allCountriesList } from 'helpers'
import { Bulk, Filter, HashViewComponent, NotFound, SpecialFilter, Spinner, Card, AdminButton } from 'components'
import { useAlert, useStore } from 'providers'
import { getLastViewed, getResentSearches, searchByQInDB } from 'api/requests'
import assets from '../../assets/index'
import './SearchPage.style.scss'

function SearchPage () {
  const { topics } = useStore()
  const [cardStyle, SetCardStyle] = useState('grid')
  const [filterOptions, setFilterOptions] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const propertiesDataString = searchParams.get('properties')
  const initialPropertiesData = propertiesDataString ? JSON.parse(propertiesDataString) : null
  const [propertiesData, setPropertiesData] = useState(initialPropertiesData)
  const [sortOptions, setSortOptions] = useState(searchParams.get('sort') || '')
  const [sortData, setSortData] = useState('')
  const [typeOptions, setTypeOptions] = useState(searchParams.get('type') || '')
  const [countryOptions, setCountryOptions] = useState(searchParams.get('country') || '')
  const [countryOptionsValue, setCountryOptionsValue] = useState()
  const [specialFilterOptions, setSpecialFilterOptions] = useState(searchParams.get('topics') || '')
  const [specialFilterData, setSpecialFilterData] = useState(topics?.data ?? {})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState()
  const [itemAmount, setItemAmount] = useState()
  const [resentData, setResentData] = useState()
  const [lastViewed, setLastViewed] = useState()
  const [data, setData] = useState()
  const { displayAlert } = useAlert()
  const searchValue = searchParams.get('q') ?? ''
  const isAdvancedSearch = searchParams.get('advanced') ?? ''
  const searchType = searchParams.get('type')
  const [searchCheck, setSearchCheck] = useState(searchValue)
  const [object, setObject] = useState()
  const [isURLParamsLoaded, setIsURLParamsLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSpecialFilterData(topics?.data ?? {})
  }, [topics])

  const keysArray = [
    { name: '', value: 'All Types' },
    { name: 'address', value: 'Addresses' },
    { name: 'bank-account', value: 'Bank Accounts' },
    { name: 'crypto-wallet', value: 'Crypto Wallets' },
    { name: 'person', value: 'Individuals' },
    { name: 'legal-entity', value: 'Legal Entities' },
    { name: 'security', value: 'Securities' },
    { name: 'vessel', value: 'Aircrafts or Ships' },
    { name: 'Oldest Updated', value: 'desc' },
    { name: 'Lasted Updated', value: 'asc' },
    { name: 'Most Relevant', value: '' }

  ]

  function switchLayer (type) {
    const newStyleType = type === 'grid' ? 'grid' : 'list'
    SetCardStyle(newStyleType)
  }

  function handleChangeFilterState (e, type) {
    const selectedValue = e.target.value

    if (type === 'filter') {
      const result = keysArray.find((item) => item.value === selectedValue)?.name
      setTypeOptions(!result ? '' : result)
      setFilterOptions(selectedValue)
    }
    if (type === 'sort') {
      const result = keysArray.find((item) => item.name === selectedValue)?.value
      setSortOptions(result)
      setSortData(selectedValue)
    }
  }

  function handleChangeSpecialState (data) {
    const filteredItems = {}

    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('checkbox-')) {
        filteredItems[key.replace('checkbox-', '')] = value
      }
    })

    setSpecialFilterOptions(filteredItems)
  }

  function handleChangeCountryState (e) {
    const selectedValue = e.target.value
    if (selectedValue === 'All Countries') return (setCountryOptionsValue(''), setCountryOptions())
    const countryCode = allCountriesList.find((item) => item.name === selectedValue)?.code
    setCountryOptions(countryCode.toLowerCase())
    setCountryOptionsValue(selectedValue)
  }

  function handleLoadMore () {
    setCurrentPage((prevState) => {
      return prevState + 1
    })
  }

  useEffect(() => {
    if (searchType || typeOptions) {
      const result = keysArray.find((item) => item.name === (searchType !== typeOptions ? typeOptions : searchType))?.value
      setFilterOptions(result)
    }
  }, [typeOptions])

  useEffect(() => {
    const result = keysArray.find((item) => item.value === sortOptions)?.name
    setSortData(result)
  }, [sortOptions])

  useEffect(() => {
    if ((data) && (topics !== null || topics !== undefined)) {
      const updatedArrayOfObjects = updateArrayOfObjects(data, topics)
      setObject(updatedArrayOfObjects)
    }
  }, [data, topics])

  useEffect(() => {
    async function fetchData () {
      let keysString
      function encodeSpecialValues (obj) {
        const result = {}
        for (const [key, value] of Object.entries(obj)) {
          if (/[а-яА-ЯЁё]/.test(value)) {
            result[key] = value
          } else {
            result[key] = encodeURIComponent(value).replace(/%20/g, ' ')
          }
        }
        return result
      }

      if (specialFilterOptions && isAdvancedSearch) {
        const specialKeys = Object.keys(specialFilterOptions)
        keysString = specialKeys.join(', ')
      } else {
        keysString = ''
      }

      const queryParams = {
        q: searchValue,
        type: searchType !== typeOptions ? typeOptions : searchType,
        page: currentPage,
        topics: keysString || undefined,
        sort: sortOptions || '',
        country: countryOptions || undefined,
        ...(isAdvancedSearch !== '' ? { advanced: isAdvancedSearch } : { undefined }),
        ...(propertiesData ? encodeSpecialValues(propertiesData) : {})
      }

      const filteredParams = Object.fromEntries(Object.entries(queryParams).filter(([_, value]) => value !== undefined))
      try {
        setLoading(true)
        setSearchParams(filteredParams)
        const res = await searchByQInDB(filteredParams)
        if (res.message) return displayAlert(res.message, 10000, 'red')
        if (currentPage > 1)setData([...data, ...res.items])
        else setData(res.items)
        setTotalPages(res.totalPages)
        setItemAmount(res.totalItems)
        setLoading(false)
      } catch (err) {
        console.error(err)
      }
    }
    if (isURLParamsLoaded) fetchData()
  }, [searchValue, typeOptions, sortOptions, currentPage, propertiesData, specialFilterOptions, countryOptions])

  useEffect(() => {
    setSearchCheck(searchValue)
    if (searchValue !== searchCheck) setCurrentPage(1)
  }, [searchValue])

  useEffect(() => {
    async function getResentSearch () {
      const res = await getResentSearches()
      if (res.message) return displayAlert(res.message, 10000, 'red')
      setResentData(res)
      return res
    }
    getResentSearch()
  }, [])

  useEffect(() => {
    async function getLastViewedSearch () {
      const res = await getLastViewed()
      if (res.message) return displayAlert(res.message, 10000, 'red')
      setLastViewed(res)
      return res
    }
    getLastViewedSearch()
  }, [])

  useEffect(() => {
    const propertiesByLink = {}
    searchParams.forEach((value, key) => {
      if (key.startsWith('properties_')) {
        propertiesByLink[key] = decodeURIComponent(value)
      }
    })

    setPropertiesData((prevPropertiesData) => ({
      ...prevPropertiesData,
      ...propertiesByLink
    }))

    setIsURLParamsLoaded(true)
  }, [])

  return (
    loading === false
      ? (
        <section className='section' aria-label='search section'>
          <div className='container no-flex no-padding__top-bottom'>
            <div className='title-wrapper push-content'>
              <div className='title-wrapper no-wrap title-wrapper--flex-start'>
                <div className='title-wrapper__results-container'>
                  <h1 className='title-wrapper__results-title'>
                    Results for:
                  </h1>
                  <span className='title-wrapper__searchquery'>{modifiedValue(searchValue)}</span>
                  <span className='special-filter__title-amount__border'><p className='special-filter__title-amount'>{itemAmount}</p></span>
                </div>
              </div>
              <div className='title-wrapper title-wrapper--flex-end'>
                <Filter
                  type='filter'
                  data={MockFilterOptions}
                  onChange={(e) => handleChangeFilterState(e, 'filter')}
                  value={filterOptions}
                />
                <Filter type='sort' data={mockSortOptions} value={sortData} onChange={(e) => handleChangeFilterState(e, 'sort')} />
                <div className='title-wrapper__grid-selection'>
                  <button
                    aria-label='Switch to Grid View'
                    title='Switch to Grid View'
                    disabled={cardStyle === 'grid'}
                    className={cardStyle === 'grid' ? 'title-wrapper__layer-switch switchlayer-button__reset-style' : 'title-wrapper__layer-switch not-active switchlayer-button__reset-style'}
                    onClick={() => switchLayer('grid')}
                  >
                    <assets.FlexSVG
                      width={16}
                      height={16}
                      title='Switch to Grid View'
                    />
                  </button>
                  <button
                    aria-label='Switch to List View'
                    title='Switch to List View'
                    disabled={cardStyle === 'list'}
                    className={cardStyle === 'list' ? 'title-wrapper__layer-switch switchlayer-button__reset-style' : 'title-wrapper__layer-switch not-active switchlayer-button__reset-style'}
                    onClick={() => switchLayer('list')}
                  >
                    <assets.GridSVG
                      width={16}
                      height={16}
                      title='Switch to List View'
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className='search-content__wrapper'>
              <div className='widgets-wrapper'>
                {isAdvancedSearch
                  ? (
                    <SpecialFilter
                      topicsArray={specialFilterData}
                      onCountryChange={handleChangeCountryState}
                      countryValue={countryOptionsValue}
                      onChange={handleChangeSpecialState}
                    />
                    )
                  : (
                    <>
                      <Bulk />
                      <HashViewComponent type='recentviewed' data={resentData} />
                      <HashViewComponent type='lastvisited' data={lastViewed} />
                    </>
                    )}

              </div>
              <div className='search-list__wrapper' style={data?.length === 0 ? { margin: '0 auto' } : {}}>
                {data?.length === 0
                  ? (
                    <NotFound />
                    )
                  : (
                    <>
                      <ul className='search-list'>
                        {object && object.map((item, index) => <Card key={index} layer={cardStyle} dataArray={item} />)}
                      </ul>
                      {currentPage !== totalPages && (
                        <AdminButton
                          text='Load More'
                          svgPath='SearchSVG'
                          onClick={handleLoadMore}
                          className='admin-edit__header-control--button admin-edit__header-control--centered'
                        />
                      )}
                    </>
                    )}
              </div>
            </div>
          </div>
        </section>
        )
      : <Spinner />
  )
}

export default SearchPage
