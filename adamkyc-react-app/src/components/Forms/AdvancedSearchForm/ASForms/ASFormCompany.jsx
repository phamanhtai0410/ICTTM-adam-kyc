import { allCountriesList, buildInput, mockCountryFilter } from 'helpers'
import { Select } from 'components'
import assets from '../../../../assets/index'
import '../../../Filter/Filter.style.scss'
import '../AdvancedSearchForm.style.scss'

export const ASFormCompany = ({ onChange, onChangeType, filterOptions, value, onChangeCountry, onChangeStatus, countryOptions, handleSend }) => {
  return (
    <form className='form'>
      <div className='form-wrapper'>
        <div className='form-wrapper__label-wrapper'>
          <label className='form-label'>
            <p className='form-text'>Name</p>
            {buildInput('properties_name', 'Ex: Russian Oil Limited', value.properties_name, onChange)}
          </label>
          <label className='form-label form-label__input-field'>
            <p className='form-text'>Incorporation Date</p>
            <input
              type='date'
              name='properties_incorporationDate'
              className={`form-input ${!value.properties_incorporationDate ? 'form-input__date' : ''}`}
              placeholder='2023-07-24'
              value={value.properties_incorporationDate}
              onChange={onChange}
            />
          </label>
        </div>
        <div className='form-wrapper__label-wrapper'>
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
          <label className='form-label'>
            <p className='form-text'>Legal Form</p>
            {buildInput('properties_legalForm', 'Ex: EI - is', value.properties_legalForm, onChange)}
          </label>
        </div>
        <div className='form-wrapper__label-wrapper'>
          <label className='form-label'>
            <p className='form-text'>Registration Number</p>
            {buildInput('properties_registrationNumber', 'Ex: US2851991', value.properties_registrationNumber, onChange)}
          </label>
          <label className='form-label'>
            <p className='form-text'>Status</p>
            <select
              className='filter-select__menu form-select__menu'
              name='properties_status'
              value={value.properties_status}
              onChange={onChangeStatus}
            >
              <option value=''>
                Select options
              </option>
              <option value='ACTIVE'>
                Active
              </option>
              <option value='CANCELLED'>
                Cancelled
              </option>
              <option value='INACTIVE'>
                Inactive
              </option>
              <option value='SUSPENDED'>
                Suspended
              </option>
            </select>
          </label>
        </div>
      </div>
      <button
        type='submit'
        aria-label='button to submit data to the server'
        className='form-button'
        onClick={(e) => handleSend(e, 'legal-entity')}
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
