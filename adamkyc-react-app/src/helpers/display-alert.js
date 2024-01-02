export function displayAlert (message, setMessageAlert, setShowAlert, time) {
  setMessageAlert(message)
  setShowAlert(true)

  setTimeout(() => {
    setShowAlert(false)
  }, time)
}
