import { useState } from 'react'
import { FormGroup } from 'components'
import { mockReportSelectOptions } from 'helpers'
import assets from '../../../assets/index'
import './ReportIncorrectDataForm.style.scss'

export function ReportIncorrectDataForm ({ onChange, onSubmit, value, message, response }) {
  const [isChecked, setIsChecked] = useState(false)

  function handleSubmit (e) {
    e.preventDefault()
    onSubmit(e)
  }

  return (
    <form className='report-form' onSubmit={handleSubmit}>
      <div className='report-form__wrapper'>
        <FormGroup
          type='text&input'
          text='Firstname'
          isRequired
          name='firstName'
          placeholder='Ex: John'
          value={value.firstName}
          onChange={onChange}
        />
        <FormGroup
          type='text&input'
          text='Lastname'
          isRequired
          name='lastName'
          placeholder='Ex: Doe'
          value={value.lastName}
          onChange={onChange}
        />
      </div>
      <div className='report-form__wrapper'>
        <FormGroup
          type='text&input'
          text='Email'
          isEmail
          isRequired
          name='email'
          placeholder='Ex: johndoe@gmail.com'
          value={value.email}
          onChange={onChange}
        />
        <FormGroup
          type='text&input'
          text='Phone Number'
          name='phone'
          placeholder='Ex: (864) 252-7174'
          value={value.phone}
          onChange={onChange}
        />
      </div>
      <FormGroup
        type='text&textarea'
        text='Detail'
        isDetail
        isRequired
        name='details'
        placeholder='Please describe'
        value={value.details}
        onChange={onChange}
      />
      <FormGroup
        type='text&select'
        text='Relationship to Data'
        name='relationship'
        isRequired
        className='form-select__menu--padding form-select__menu--reset'
        value={value.relationship}
        array={mockReportSelectOptions}
        onChange={onChange}
      />
      <label className='report-form__label'>
        <p className='report-form__subtext report-form__subtext--font__color'>By submitting your feedback you acknowledge that you have read the Terms and Conditions of this website and understand that you may be required to remove the data at the source. To address your feedback or cater to your requests effectively, you acknowledge that we will store and process your personal information. This may involve transferring your information to third-party entities for processing purposes. We will utilize this information to provide you with a response and, if necessary, verify any details you have shared. For more comprehensive information on how we handle your data, please refer to our <a href='/' className='report-form__subtext report-form__subtext--font__color report-form__subtext--link'>privacy policy</a>.</p>
      </label>
      <label className='report-form__label-checkbox'>
        <input
          className='special-filter__checkbox-item report-form__checkbox'
          type='checkbox'
          name='agreement'
          id='agreement'
          defaultChecked={false}
          onChange={() => {
            setIsChecked(!isChecked)
          }}
        />
        <p className='report-form__subtext'>I agree and accept responsibility for ensuring that the information provided above is correct.</p>
      </label>
      <button
        type='submit'
        disabled={isChecked === false}
        title='button for submitting form'
        aria-label='button for form submit'
        className='btn-search report-form__button'
      >
        Submit
        <assets.ArrowRightRendered
          width={16}
          height={16}
          className='color-black'
        />
      </button>
      {(message || response === null) && (
        <div className={`report-form__button-result__container ${message ? 'report-form__button-result__container--error' : 'report-form__button-result__container--success'}`}>
          {message
            ? (
              <assets.AlertSVG
                width={24}
                height={24}
                className='report-form__button-result__icon--error'
              />
              )
            : (
              <assets.CheckSquareSVG
                width={24}
                height={24}
                className='report-form__button-result__icon--success'
              />
              )}
          <p className={`report-form__button-result__subtitle ${message ? 'report-form__button-result__subtitle--error' : 'report-form__button-result__subtitle--success'}`}>{message || 'Your request was sent successfully. We`ll get back to you by email. Thank you !'}</p>
        </div>
      )}
    </form>
  )
}
