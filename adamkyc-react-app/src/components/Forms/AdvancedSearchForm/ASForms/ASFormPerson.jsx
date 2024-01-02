import { allCountriesList, buildInput, mockCountryFilter } from 'helpers'
import { Select } from 'components'
import assets from '../../../../assets/index'
import '../../../Filter/Filter.style.scss'
import '../AdvancedSearchForm.style.scss'

export const ASFormPerson = ({ onChange, onChangeType, filterOptions, value, onChangeCountry, onChangeCountryOfBirth, onChangeNationality, countryOptions, handleSend }) => {
  return (
    <form className='form'>
      <div className='form-wrapper'>
        <div className='form-wrapper__label-wrapper'>
          <label className='form-label'>
            <p className='form-text'>Name or Alias</p>
            {buildInput('properties_alias', 'Ex: John Doe', value.properties_alias, onChange)}
          </label>
          <label className='form-label'>
            <p className='form-text'>Date of Birth (year or full date)</p>
            <input
              type='date'
              name='properties_birthDate'
              className={`form-input ${!value.properties_birthDate ? 'form-input__date' : ''}`}
              placeholder='2023-08-30'
              value={value.properties_birthDate}
              onChange={onChange}
            />
          </label>
        </div>
        <div className='form-wrapper__label-wrapper'>
          <label className='form-label'>
            <p className='form-text'>Passport Number</p>
            {buildInput('properties_passportNumber', 'Ex: VN18461001723', value.properties_passportNumber, onChange)}
          </label>
          <label className='form-label'>
            <p className='form-text'>Other Identity Card Number</p>
            {buildInput('properties_idNumber', 'Ex: 1849501765271', value.properties_idNumber, onChange)}
          </label>
        </div>
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
        {/* </div> */}
        <div className='form-wrapper__label-wrapper'>
          <label className='form-label'>
            <p className='form-text'>Nationality</p>
            <Select
              type='select country'
              data={mockCountryFilter}
              onChange={onChangeNationality}
              value={allCountriesList.find(item => item.code.toLowerCase() === value.properties_nationality)?.name}
              Vessels
            />
          </label>
          <label className='form-label'>
            <p className='form-text'>Country of Birth</p>
            <Select
              type='select country'
              data={mockCountryFilter}
              onChange={onChangeCountryOfBirth}
              value={allCountriesList.find(item => item.code.toLowerCase() === value.properties_birthCountry)?.name}
              Vessels
            />
          </label>
        </div>
      </div>
      <button
        type='submit'
        aria-label='button to submit data to the server'
        className='form-button'
        onClick={(e) => handleSend(e, 'person')}
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
