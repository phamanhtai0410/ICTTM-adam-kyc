import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAlert } from 'providers'
import assets from '../../../assets/index'
import '../../Header/Header.style.scss'

export function SearchForm ({ location, filterValue, sortValue, countryValue, specialValue }) {
  const { displayAlert } = useAlert()
  const navigate = useNavigate()
  const dirLocation = useLocation()
  const [searchParams] = useSearchParams()
  const searchValue = searchParams.get('q')
  const isAdvancedSearch = searchParams.get('advanced')

  const [inputData, setInputData] = useState({
    search: ''
  })

  useEffect(() => {
    if (searchValue) {
      setInputData({ ...inputData, search: searchValue })
    }

    if (dirLocation.pathname === '/' || (dirLocation.pathname.includes('/entity/')) || (dirLocation.pathname.includes('/report/')) || dirLocation.pathname === '/bulk-upload' || dirLocation.pathname === '/bookmarks' || dirLocation.pathname === '/advanced-search' || dirLocation.pathname === '/bulk-upload/data' || dirLocation.pathname === '/admin/database' || dirLocation.pathname === '/history') {
      setInputData({ search: '' })
    }
  }, [searchValue])

  function handleChange (e) {
    const { name, value } = e.target
    setInputData({ ...inputData, [name]: value })
  }

  function handleSubmit (e) {
    e.preventDefault()
    let keysString

    if (inputData.search.trim() === '') return displayAlert('You searched empty value. You must input a value to search for', 10000, 'red')

    if (specialValue) {
      const specialKeys = Object.keys(specialValue)
      keysString = specialKeys.join(', ')
    } else {
      keysString = ''
    }

    const queryParams = new URLSearchParams({
      q: inputData.search.trim(),
      type: filterValue || '',
      page: true,
      sort: sortValue || '',
      topics: keysString || '',
      country: countryValue || '',
      ...(isAdvancedSearch ? { advanced: true } : {})
    })

    const queryString = queryParams.toString()
    const url = `/search?${queryString}`

    navigate(url)
  }

  return (
    location === 'hero'
      ? (
        <form onSubmit={handleSubmit}>
          <div className='hero-searchbar__wrapper'>
            <label className='hero-search'>
              <assets.SearchWhiteSVG
                width={16}
                height={16}
                className='hero-search__icon'
              />
              <input
                type='text'
                name='search'
                className='hero-container__field'
                placeholder='Keyword'
                value={inputData.search}
                onChange={handleChange}
              />
            </label>
            <button
              type='submit'
              className='button-primary'
            >
              Search
            </button>
          </div>
        </form>
        )
      : (
        <form onSubmit={handleSubmit}>
          <label className='navbar-search'>
            <div className='search-button'>
              <assets.SearchLoop
                width={14}
                height={14}
                className='search-svg'
              />
            </div>
            <input
              type='text'
              name='search'
              className='navbar-search__field'
              placeholder='Please type your keyword'
              value={inputData.search}
              onChange={handleChange}
            />
          </label>
        </form>
        )
  )
}
