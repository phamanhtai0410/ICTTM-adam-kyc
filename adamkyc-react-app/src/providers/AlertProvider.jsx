import React, { createContext, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { CustomAlert } from 'components'

const AlertContext = createContext(null)

export function AlertProvider ({ children }) {
  const [showAlert, setShowAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [alertClass, setAlertClass] = useState('')

  function displayAlert (message, time, newAlertClass) {
    setMessageAlert(message)
    setAlertClass(newAlertClass)
    setShowAlert(true)

    setTimeout(() => {
      setShowAlert(false)
    }, time)
  }

  const value = {
    showAlert,
    messageAlert,
    alertClass,
    displayAlert
  }

  return (
    <AlertContext.Provider value={value}>
      {children}
      {showAlert && createPortal(
        <CustomAlert message={messageAlert} className={`custom-alert ${showAlert ? '' : 'hide'} ${alertClass === 'red' ? 'red' : ''}`} />,
        document.querySelector('#root')
      )}
    </AlertContext.Provider>
  )
}

export function useAlert () {
  return useContext(AlertContext)
}
