import React, { createContext, useContext, useState, useEffect } from 'react'
import { getAllDatasets, getAllTopics } from 'api/requests'
import { ScrollToTop, displayAlert } from 'helpers'

const AppContext = createContext(null)

export function StoreProvider ({ children }) {
  const [topics, setTopics] = useState(JSON.parse(window.localStorage.getItem('adamkyc_topics')))
  const [datasets, setDatasets] = useState(JSON.parse(window.localStorage.getItem('adamkyc_datasets')))
  // const [sections, setSections] = useState(null)

  useEffect(() => {
    if (!topics) {
      async function getAllSpecialFilterTopics () {
        const res = await getAllTopics()
        if (res.response ? res.response.data.message : res.message) return displayAlert(res.response ? res.response.data.message + ' ' + res.message : res.message, 10000, 'red')
        const topicsMap = res
        const storedData = window.localStorage.getItem('adamkyc_topics')

        if (storedData) {
          const storedTopicsMap = JSON.parse(storedData)
          if (
            !storedTopicsMap.data_expiration || new Date(storedTopicsMap.data_expiration) <= new Date()
          ) {
            storedTopicsMap.data_expiration = new Date()
            storedTopicsMap.data_expiration.setMonth(storedTopicsMap.data_expiration.getMonth() + 1)

            window.localStorage.setItem('adamkyc_topics', JSON.stringify(topicsMap))
          }
        } else {
          topicsMap.data_expiration = new Date()
          topicsMap.data_expiration.setMonth(topicsMap.data_expiration.getMonth() + 1)

          window.localStorage.setItem('adamkyc_topics', JSON.stringify(topicsMap))
          setTopics(JSON.parse(window.localStorage.getItem('adamkyc_topics')))
        }
      }
      getAllSpecialFilterTopics()
    }
  }, [])

  useEffect(() => {
    if (!datasets) {
      async function fetchData () {
        try {
          const res = await getAllDatasets()
          const storedData = window.localStorage.getItem('adamkyc_datasets')

          if (storedData) {
            const storedTopicsMap = JSON.parse(storedData)
            if (
              !storedTopicsMap.data_expiration || new Date(storedTopicsMap.data_expiration) <= new Date()
            ) {
              storedTopicsMap.data_expiration = new Date()
              storedTopicsMap.data_expiration.setMonth(storedTopicsMap.data_expiration.getMonth() + 1)

              window.localStorage.setItem('adamkyc_datasets', JSON.stringify(res))
            }
          } else {
            res.data_expiration = new Date()
            res.data_expiration.setMonth(res.data_expiration.getMonth() + 1)

            window.localStorage.setItem('adamkyc_datasets', JSON.stringify(res))
            setDatasets(JSON.parse(window.localStorage.getItem('adamkyc_datasets')))
          }
        } catch (err) {
          console.error(err)
        }
      }
      fetchData()
    }
  }, [])

  useEffect(() => {
    ScrollToTop()
  }, [])

  const contextValue = {
    topics,
    datasets
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export function useStore () {
  return useContext(AppContext)
}
