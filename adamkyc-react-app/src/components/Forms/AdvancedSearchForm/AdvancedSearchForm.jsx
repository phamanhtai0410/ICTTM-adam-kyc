import { useNavigate } from 'react-router'
import { useState } from 'react'
import { ASFormAddress, ASFormSecurity, ASFormVessels, ASFormBankAccount, ASFormCompany, ASFormCrypto, ASFormPerson } from 'components'
import { allCountriesList } from 'helpers'
import './AdvancedSearchForm.style.scss'

export function AdvancedSearchForm ({ form }) {
  let component
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    properties_city: '',
    properties_street: '',
    properties_registrationNumber: '',
    properties_owner: '',
    properties_operator: '',
    properties_accountNumber: '',
    properties_bankName: '',
    properties_incorporationDate: '',
    properties_publicKey: '',
    properties_amountsInUSDFrom: '',
    properties_amountsInUSDTo: '',
    properties_balanceFrom: '',
    properties_balanceTo: '',
    properties_currency: '',
    properties_modifiedAt: '',
    properties_createdAt: '',
    properties_lastChanged: '',
    properties_alias: '',
    properties_birthDate: '',
    properties_passportNumber: '',
    properties_idNumber: '',
    properties_tag: '',
    properties_isin: '',
    properties_name: '',
    properties_issuer: '',
    properties_country: '',
    properties_birthCountry: '',
    properties_flag: '',
    properties_type: '',
    properties_status: ''
  })

  function handleChange (e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  function handleChangeCompanyStatus (e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value.toUpperCase() })
  }

  function handleChangeCountryState (e) {
    const selectedValue = e.target.value
    setFormData({ ...formData, properties_country: allCountriesList.find(item => item.name === selectedValue)?.code.toLowerCase() })
  }
  function handleChangeCountryOfRegistrationState (e) {
    const selectedValue = e.target.value
    setFormData({ ...formData, properties_flag: allCountriesList.find(item => item.name === selectedValue)?.code.toLowerCase() })
  }
  function handleChangeCountryOfBirthState (e) {
    const selectedValue = e.target.value
    setFormData({ ...formData, properties_birthCountry: allCountriesList.find(item => item.name === selectedValue)?.code.toLowerCase() })
  }
  function handleChangeNationalityState (e) {
    const selectedValue = e.target.value
    setFormData({ ...formData, properties_nationality: allCountriesList.find(item => item.name === selectedValue)?.code.toLowerCase() })
  }

  function trimAllFields (data) {
    const trimmedData = {}

    for (const key in data) {
      if (data[key] !== '') {
        trimmedData[key] = data[key]
      }
    }

    return trimmedData
  }

  function handleSend (e, typeValue) {
    e.preventDefault()
    const trimmedData = trimAllFields(formData)

    const queryParams = new URLSearchParams({
      q: '',
      type: typeValue,
      advanced: true,
      properties: JSON.stringify(trimmedData)
    })

    const queryString = queryParams.toString()
    const url = `/search?${queryString}`

    navigate(url)
  }

  switch (form) {
    case 'Address':
      component = (
        <ASFormAddress
          onChangeCountry={handleChangeCountryState}
          onChange={handleChange}
          countryOptions={allCountriesList.find(item => item.code.toLowerCase() === formData.properties_country)?.name}
          value={formData}
          handleSend={handleSend}
        />
      )
      break
    case 'Vessels':
      component = (
        <ASFormVessels
          onChangeCountry={handleChangeCountryState}
          onChangeCountryOfRegistration={handleChangeCountryOfRegistrationState}
          onChange={handleChange}
          value={formData}
          handleSend={handleSend}
        />
      )
      break
    case 'Bank Account':
      component = (
        <ASFormBankAccount
          onChangeCountry={handleChangeCountryState}
          onChange={handleChange}
          value={formData}
          handleSend={handleSend}
        />
      )
      break
    case 'Company':
      component = (
        <ASFormCompany
          onChangeCountry={handleChangeCountryState}
          onChange={handleChange}
          onChangeStatus={handleChangeCompanyStatus}
          value={formData}
          handleSend={handleSend}
        />
      )
      break
    case 'Crypto':
      component = (
        <ASFormCrypto
          onChangeCountry={handleChangeCountryState}
          onChange={handleChange}
          value={formData}
          handleSend={handleSend}
        />
      )
      break
    case 'Person':
      component = (
        <ASFormPerson
          onChangeCountry={handleChangeCountryState}
          onChangeCountryOfBirth={handleChangeCountryOfBirthState}
          onChangeNationality={handleChangeNationalityState}
          onChange={handleChange}
          value={formData}
          handleSend={handleSend}
        />
      )
      break
    case 'Security':
      component = (
        <ASFormSecurity
          onChangeCountry={handleChangeCountryState}
          onChange={handleChange}
          value={formData}
          handleSend={handleSend}
        />
      )
      break
    default:
      component = 'No suitable form founded'
  }

  return (
    component
  )
}
