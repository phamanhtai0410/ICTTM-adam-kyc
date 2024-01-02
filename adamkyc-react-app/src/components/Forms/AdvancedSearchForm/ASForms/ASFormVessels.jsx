import { allCountriesList, buildInput, mockCountryFilter } from 'helpers'
import { Select } from 'components'
import assets from '../../../../assets/index'
import '../AdvancedSearchForm.style.scss'

export const ASFormVessels = ({ onChange, onChangeType, filterOptions, value, onChangeCountry, onChangeCountryOfRegistration, countryOptions, handleSend }) => {
  return (
    <form className='form'>
      <div className='form-wrapper'>
        <div className='form-wrapper__label-wrapper'>
          <label className='form-label'>
            <p className='form-text'>Type</p>
            {buildInput('properties_type', 'Vessel type', value.properties_type, onChange)}
          </label>
          <label className='form-label'>
            <p className='form-text'>Registration Number</p>
            {buildInput('properties_registrationNumber', 'Ex: 121 Post Street', value.properties_registrationNumber, onChange)}
          </label>
        </div>
        <div className='form-wrapper__label-wrapper'>
          <label className='form-label'>
            <p className='form-text'>Owner</p>
            {buildInput('properties_owner', 'John Doe', value.properties_owner, onChange)}
          </label>
          <label className='form-label'>
            <p className='form-text'>Operator</p>
            {buildInput('properties_operator', 'Ex: US2851991', value.properties_operator, onChange)}
          </label>
        </div>
      </div>
      <label className='form-label'>
        <p className='form-text'>Country</p>
        <Select
          type='select country'
          data={mockCountryFilter}
          onChange={onChangeCountry}
          value={allCountriesList.find(item => item.code.toLowerCase() === value.properties_country)?.name}
          isAdvancedSearch
        />
      </label>
      <label className='form-label'>
        <p className='form-text'>Country of Registration (Flag)</p>
        <Select
          type='select country'
          data={mockCountryFilter}
          onChange={onChangeCountryOfRegistration}
          value={allCountriesList.find(item => item.code.toLowerCase() === value.properties_flag)?.name}
          isAdvancedSearch
        />
      </label>
      <label className='form-label'>
        <p className='form-text'>Name</p>
        {buildInput('properties_name', 'Ex: A-12', value.properties_name, onChange)}
      </label>
      <button
        type='submit'
        aria-label='button to submit data to the server'
        className='form-button'
        onClick={(e) => handleSend(e, 'vessel')}
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
