import { allCountriesList, buildInput, mockCountryFilter } from 'helpers'
import { Select } from 'components'
import assets from '../../../../assets/index'
import '../AdvancedSearchForm.style.scss'

export const ASFormBankAccount = ({ onChange, onChangeCountry, countryOptions, value, handleSend }) => {
  return (
    <form className='form'>
      <div className='form-wrapper__label-wrapper'>
        <label className='form-label form-label__input-field'>
          <p className='form-text'>Account Number</p>
          {buildInput('properties_accountNumber', 'Ex: US1A5181A', value.properties_accountNumber, onChange)}
        </label>
        <label className='form-label form-label__input-field'>
          <p className='form-text'>Bank name</p>
          {buildInput('properties_bankName', 'Ex: Bank of America', value.properties_bankName, onChange)}
        </label>
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
      <button
        type='submit'
        aria-label='button to submit data to the server'
        className='form-button'
        onClick={(e) => handleSend(e, 'bank-account')}
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
