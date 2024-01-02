import { mockCountryFilter } from 'helpers'
import { Select } from 'components'
import './CountryFilter.style.scss'

export function CountryFilter ({ onChange, value }) {
  return (
    <div className='special-filter__country-filter'>
      <h3 className='country-filter__title special-filter__title'>Country Filter</h3>
      <Select
        type='country'
        data={mockCountryFilter.sort((a, b) => a.localeCompare(b))}
        onChange={onChange}
        value={value}
      />
    </div>
  )
}
