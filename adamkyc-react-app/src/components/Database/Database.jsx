import { useNavigate } from 'react-router'
import { FormGroup, Title } from 'components'
import { useAlert } from 'providers'
import { useEffect, useState } from 'react'
import { loginToDB, logoutDB, getCurrentUser, isLoggedInDB } from 'api/requests'
import assets from '../../assets/index'
import './Database.styles.scss'

export function Database () {
  const navigate = useNavigate()
  const [isConnected, setIsConnected] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const { displayAlert } = useAlert()
  const [formData, setFormData] = useState({
    hostname: '',
    username: '',
    database: '',
    password: ''
  })

  function handleChange (e) {
    const { name, value } = e.target

    setFormData({
      ...formData, [name]: value
    })
  }

  async function handleLoginToDB () {
    try {
      const res = await loginToDB(formData)

      if (res.status === false && res.message) {
        setErrorMessage(res.message)
      }

      if (res.data?.status === true) {
        setIsConnected(!isConnected)
      }
    } catch (err) {
      console.error(err)
    }
  }

  function handleSubmit () {
    handleLoginToDB()
  }

  function handleDisconnect () {
    logoutDB()
    setIsConnected(!isConnected)
    setFormData({
      hostname: '',
      username: '',
      database: '',
      password: ''
    })
  }

  useEffect(() => {
    async function fetchData () {
      try {
        const currentUserRes = await getCurrentUser()

        if (currentUserRes.data.status === 404 || currentUserRes.message) {
          return displayAlert(currentUserRes.message, 10000, 'red')
        }

        if (currentUserRes.data?.data?.is_admin === false) {
          navigate('/')
        } else {
          const isLoggedInRes = await isLoggedInDB()

          if (isLoggedInRes.connected === true) {
            setIsConnected(!isConnected)
            setFormData({ ...isLoggedInRes, password: '*****' })
          }
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className='database'>
      <Title text='Database' />
      <div className='database-form__wrapper'>
        <form className='report-form'>
          <div className='report-form__wrapper'>
            <FormGroup
              type='text&input'
              text='Database server address'
              isConnected={isConnected}
              isRequired
              name='hostname'
              placeholder='192.168.21.128'
              value={formData.hostname}
              onChange={handleChange}
            />
            <FormGroup
              type='text&input'
              text='Database username'
              isConnected={isConnected}
              isRequired
              name='username'
              placeholder='admin1'
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className='report-form__wrapper'>
            <FormGroup
              type='text&input'
              text='Database name'
              isConnected={isConnected}
              isRequired
              name='database'
              placeholder='example_search1'
              value={formData.database}
              onChange={handleChange}
            />
            <FormGroup
              type='text&input'
              text='Database password'
              isPassword
              isConnected={isConnected}
              isRequired
              name='password'
              placeholder='!@3711241!@#&!'
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <p className={isConnected ? 'database-subtext database-subtext--success' : 'database-subtext database-subtext--error'}>
            {isConnected ? 'Successful connection !' : errorMessage}
          </p>
        </form>
      </div>
      <div className='database-connection'>
        <div className='database-connection__wrapper'>
          <h2 className='database-connection__title'>Database connection</h2>
          <p className='database-connection__subtext'>Please re-enter the Database information and click the database connection button to be able to make a new connection.</p>
          <div className='database-connection__button-wrapper'>
            {isConnected === false && (
              <button
                className='database-connection__button database-connection__button--green'
                onClick={handleSubmit}
                style={isConnected ? { display: 'none' } : {}}
              >
                Connect Database
                <assets.RefreshSVG
                  width={16}
                  height={16}
                  className='database-connection__icon'
                />
              </button>
            )}
            {isConnected === true && (
              <button
                className='database-connection__button database-connection__button--red'
                onClick={handleDisconnect}
              >
                Disconnect Database
                <assets.DisconnectSVG
                  width={16}
                  height={16}
                  className='database-connection__icon'
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
