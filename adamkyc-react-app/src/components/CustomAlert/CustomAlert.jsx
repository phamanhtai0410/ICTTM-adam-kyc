import { useEffect } from 'react'
import './CustomAlert.style.scss'

export function CustomAlert ({ message, className, isError }) {
  const body = document.querySelector('#root')

  useEffect(() => {
    if (isError) body.classList.add('half-opacity')

    return () => {
      body.classList.remove('half-opacity')
    }
  })

  return (
    <div className={className}>
      <p>{message}</p>
    </div>
  )
}
