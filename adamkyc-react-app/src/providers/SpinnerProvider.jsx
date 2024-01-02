import React, { createContext, useContext, useState } from 'react'

const SpinnerContext = createContext(null)

export function SpinnerProvider ({ children }) {
  const [isLoading, setIsLoading] = useState(false)

  function showSpinner () {
    setIsLoading(true)
  }

  function hideSpinner () {
    setIsLoading(false)
  }

  return (
    <SpinnerContext.Provider value={{ isLoading, showSpinner, hideSpinner }}>
      {children}
    </SpinnerContext.Provider>
  )
}

// todo Not used?
export function useSpinner () {
  return useContext(SpinnerContext)
}
