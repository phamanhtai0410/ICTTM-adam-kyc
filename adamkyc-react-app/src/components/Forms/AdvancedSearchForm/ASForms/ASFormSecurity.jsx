import { allCountriesList, buildInput, mockCountryFilter } from 'helpers'
import { Select } from 'components'
import assets from '../../../../assets/index'
import '../../../Filter/Filter.style.scss'
import '../AdvancedSearchForm.style.scss'

export const ASFormSecurity = ({ onChange, onChangeType, filterOptions, value, onChangeCountry, countryOptions, handleSend }) => {
  return (
    <form className='form'>
      <div className='form-wrapper'>
        <div className='form-wrapper__label-wrapper'>
          <label className='form-label'>
            <p className='form-text'>ISIN</p>
            {buildInput('properties_isin', 'Ex: US1A5181A', value.properties_isin, onChange)}
          </label>
          <label className='form-label'>
            <p className='form-text'>Name</p>
            {buildInput('properties_name', 'Ex: John Doe', value.properties_name, onChange)}
          </label>
        </div>
        <div className='form-wrapper__label-wrapper'>
          <label className='form-label'>
            <p className='form-text'>Issuer</p>
            {buildInput('properties_issuer', 'Ex: US1A5181A', value.properties_issuer, onChange)}
          </label>
          <label className='form-label'>
            <p className='form-text'>Country</p>
            <Select
              type='select country'
              data={mockCountryFilter}
              onChange={onChangeCountry}
              value={allCountriesList.find(item => item.code.toLowerCase() === value.properties_country)?.name}
              Vessels
            />
          </label>
        </div>
      </div>
      <button
        type='submit'
        aria-label='button to submit data to the server'
        className='form-button'
        onClick={(e) => handleSend(e, 'security')}
      >
        Match
        <assets.SearchSVG
          width={16}
          height={16}
        />
      </button>
    </form>
  )
}
