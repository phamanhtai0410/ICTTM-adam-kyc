import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { uploadUserReport } from 'api/requests'
import { Button, ReportIncorrectDataForm, Title } from 'components'
import './ReportIncorrectDataPage.style.scss'

function ReportIncorrectDataPage () {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    details: '',
    relationship: ''
  })
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState()

  async function postUserReport () {
    try {
      const res = await uploadUserReport(formData, id)

      if (res.message) {
        setMessage(res.message)
      } else {
        setResponse(res.data)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          details: '',
          relationship: ''
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  function handleReturn () {
    navigate(location.state.from.pathname + location.state.from.search)
  }

  function handleChange (e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  function handleSubmit () {
    postUserReport()
  }

  return (
    <section className='section' aria-label='search results section'>
      <div className='container no-flex no-padding__top-bottom'>
        <div className='report'>
          {location.state ? <Button text='Back' type='back' ariaLabel='button for returning to previous page' className='btn-search padding-8-12' onClick={handleReturn} /> : ''}
          <Title
            text='Submitted Data Rectification Request'
            className={location.state ? '' : 'report--margin-center'}
          />
        </div>
        <div className='form-group__container'>
          <ReportIncorrectDataForm
            onChange={handleChange}
            value={formData}
            onSubmit={handleSubmit}
            message={message}
            response={response}
          />
        </div>
      </div>
    </section>
  )
}

export default ReportIncorrectDataPage
