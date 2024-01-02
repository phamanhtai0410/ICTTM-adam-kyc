import { useEffect, useState } from 'react'
import { mockSortOptions, MockFilterOptions, allCountriesList } from 'helpers'
import { getLastViewed, getResentSearches } from 'api/requests'
import { SpecialFilter, Title, Hero, Bulk, HashViewComponent, Filter, Spinner } from 'components'
import { useAlert, useStore } from 'providers'
import './WelcomePage.style.scss'

function WelcomePage () {
  const { topics } = useStore()
  const [filterOptions, setFilterOptions] = useState('')
  const [typeOptions, setTypeOptions] = useState('')
  const [sortOptions, setSortOptions] = useState('')
  const [sortData, setSortData] = useState('asc')
  const [countryOptions, setCountryOptions] = useState('')
  const [countryOptionsValue, setCountryOptionsValue] = useState()
  const [specialFilterOptions, setSpecialFilterOptions] = useState()
  const [specialFilterData, setSpecialFilterData] = useState(topics?.data ?? {})
  const [resentData, setResentData] = useState()
  const [lastViewed, setLastViewed] = useState()
  const { displayAlert } = useAlert()

  useEffect(() => {
    setSpecialFilterData(topics?.data ?? {})
  }, [topics])

  function handleChangeFilterState (e) {
    const selectedValue = e.target.value
    const keysArray = [
      { name: 'address', value: 'Addresses' },
      { name: 'bank-account', value: 'Back Accounts' },
      { name: 'crypto-wallet', value: 'Crypto Wallets' },
      { name: 'person', value: 'Individuals' },
      { name: 'legal-entity', value: 'Legal Entities' },
      { name: 'security', value: 'Securities' },
      { name: 'vessel', value: 'Aircrafts or Ships' }
    ]

    const result = keysArray.find((item) => item.value === selectedValue)?.name
    setTypeOptions(!result ? 'vessel' : result)
    setFilterOptions(selectedValue)
  }

  function handleChangeSortState (e) {
    const selectedValue = e.target.value
    const keysArray = [
      { name: 'Oldest Updated', value: 'desc' },
      { name: 'Lasted Updated', value: 'asc' }
    ]
    const result = keysArray.find((item) => item.name === selectedValue)?.value
    setSortOptions(result)
    setSortData(selectedValue)
  }

  function handleChangeCountryState (e) {
    const selectedValue = e.target.value
    if (selectedValue === 'All Countries') return (setCountryOptionsValue(''), setCountryOptions())
    const countryCode = allCountriesList.find((item) => item.name === selectedValue)?.code
    setCountryOptions(countryCode.toLowerCase())
    setCountryOptionsValue(selectedValue)
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

  useEffect(() => {
    async function getResentSearch () {
      const res = await getResentSearches()
      if (res.response ? res.response.data.message : res.message) return displayAlert(res.response ? res.response.data.message + ' ' + res.message : res.message, 10000, 'red')
      setResentData(res)
      return res
    }
    getResentSearch()

    async function getLastViewedSearch () {
      const res = await getLastViewed()
      if (res.response ? res.response.data.message : res.message) return displayAlert(res.response ? res.response.data.message + ' ' + res.message : res.message, 10000, 'red')
      setLastViewed(res)
      return res
    }
    getLastViewedSearch()
  }, [])

  return (
    (resentData !== undefined && lastViewed !== undefined)
      ? (
        <section className='section' aria-label='welcome section'>
          <div className='container no-flex no-padding__top-bottom'>
            <div className='title-wrapper push-content'>
              <div className='title-wrapper no-wrap'>
                <Title text='Welcome' />
              </div>
              <div className='title-wrapper no-wrap place-to__end'>
                <Filter
                  type='filter'
                  data={MockFilterOptions}
                  onChange={handleChangeFilterState}
                  value={filterOptions}
                />
                <Filter
                  type='sort'
                  data={mockSortOptions}
                  onChange={handleChangeSortState}
                  value={sortData}
                />
              </div>
            </div>
            <div className='hero-wrapper'>
              <SpecialFilter
                topicsArray={specialFilterData}
                onCountryChange={handleChangeCountryState}
                countryValue={countryOptionsValue}
                onChange={handleChangeSpecialState}
              />
              <Hero
                filterValue={typeOptions}
                sortValue={sortOptions}
                countryValue={countryOptions}
                specialValue={specialFilterOptions}
              />
              <div className='widgets-wrapper'>
                <Bulk />
                <HashViewComponent type='recentviewed' data={resentData} />
                <HashViewComponent type='lastvisited' data={lastViewed} />
              </div>
            </div>
          </div>
        </section>
        )
      : <Spinner />
  )
}

export default WelcomePage
