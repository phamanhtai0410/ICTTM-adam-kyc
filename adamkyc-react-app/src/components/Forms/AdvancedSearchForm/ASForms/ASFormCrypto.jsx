import { buildInput } from 'helpers'
import assets from '../../../../assets/index'
import '../../../Filter/Filter.style.scss'
import '../AdvancedSearchForm.style.scss'

export const ASFormCrypto = ({ onChange, onChangeType, filterOptions, value, onChangeCountry, countryOptions, handleSend }) => {
  return (
    <form className='form'>
      <label>
        <p className='form-text form-text--mb'>Wallet Address</p>
        {buildInput('properties_publicKey', 'Ex: 1123pJv8jzeFQaCV4w644pzQJzVWay2zcA', value.properties_publicKey, onChange)}
      </label>
      <div className='form-wrapper'>
        <div className='form-wrapper__label-wrapper'>
          <label className='form-label'>
            <p className='form-text'>Currency</p>
            {buildInput('properties_currency', 'Ex: Bitcoin', value.properties_currency, onChange)}
          </label>
          <label className='form-label'>
            <p className='form-text'>Modified on</p>
            <input
              type='date'
              name='properties_modifiedAt'
              className={`form-input ${!value.properties_modifiedAt ? 'form-input__date' : ''}`}
              placeholder='2023-08-30'
              value={value.properties_modifiedAt}
              onChange={onChange}
            />
          </label>
        </div>
        <label className='form-label'>
          <p className='form-text'>Created on</p>
          <input
            type='date'
            name='properties_createdAt'
            className={`form-input ${!value.properties_createdAt ? 'form-input__date' : ''}`}
            placeholder='2023-08-30'
            value={value.properties_createdAt}
            onChange={onChange}
          />
        </label>
      </div>
      <button
        type='submit'
        aria-label='button to submit data to the server'
        className='form-button'
        onClick={(e) => handleSend(e, 'crypto-wallet')}
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
