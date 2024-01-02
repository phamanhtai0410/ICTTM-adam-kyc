import { buildInput, mockCountryFilter } from 'helpers'
import { Select } from 'components'
import assets from '../../../../assets/index'
import '../AdvancedSearchForm.style.scss'

export const ASFormAddress = ({ onChange, onChangeCountry, countryOptions, value, handleSend }) => {
  return (
    <form className='form'>
      <label className='form-label'>
        <p className='form-text'>Country</p>
        <Select
          type='select country'
          data={mockCountryFilter}
          onChange={onChangeCountry}
          value={countryOptions}
          isAdvancedSearch
        />
      </label>
      <div className='form-wrapper__label-wrapper'>
        <label className='form-label'>
          <p className='form-text'>Street</p>
          {buildInput('properties_street', 'Ex: 121 Post Street', value.properties_street, onChange)}
        </label>
        <label className='form-label'>
          <p className='form-text'>City</p>
          {buildInput('properties_city', 'Ex: Atlanta', value.properties_city, onChange)}
        </label>
      </div>
      <button
        type='submit'
        aria-label='button to submit data to the server'
        className='form-button'
        onClick={(e) => handleSend(e, 'address')}
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
