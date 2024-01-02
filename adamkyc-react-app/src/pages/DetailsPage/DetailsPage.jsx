import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { DownloadBODS, Details, ReportIncorrectData, TableOfContent, Spinner } from 'components'
import { useAlert, useStore } from 'providers'
import { getEntityById } from 'api/requests'
import { ScrollToTop, mockDetailsArray, nameObject, swapObjectKeys, updateArrayOfObjects } from 'helpers'
import './DetailsPage.style.scss'

function DetailsPage () {
  const { topics, datasets } = useStore()
  const { id } = useParams()
  const { displayAlert } = useAlert()
  const [serverData, setServerData] = useState()
  const [dataVersion, setDataVersion] = useState(0)
  const [displayedSections, setDisplayedSections] = useState([])

  function getAllShowedSections (value) {
    setDisplayedSections(value)
  }

  useEffect(() => {
    async function fetchData () {
      try {
        const res = await getEntityById(id)

        if (res.message) {
          return displayAlert(res.message, 10000, 'red')
        }

        if (topics) {
          const dateValues = [
            res.first_seen.split('T')[0],
            res.last_seen.split('T')[0],
            res.last_change.split('T')[0]
          ]
          delete res.first_seen
          delete res.last_seen
          delete res.last_change
          const datesArray = dateValues.map(value => [value])
          res.properties.first_seen = datesArray[0]
          res.properties.last_seen = datesArray[1]
          res.properties.last_change = datesArray[2]

          const updatedArrayOfObjects = updateArrayOfObjects([res], topics)
          const dataObject = swapObjectKeys(updatedArrayOfObjects[0], nameObject[0])
          setServerData(dataObject)
          setDataVersion((prevVersion) => prevVersion + 1)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
    ScrollToTop()
  }, [topics, datasets, id])

  return (
    serverData
      ? (
        <section aria-label='bulk uploader section'>
          <div className='container no-flex no-padding__top-bottom'>
            <div className='details-page'>
              <div className='navigation-container'>
                <TableOfContent
                  data={mockDetailsArray}
                  serverData={serverData}
                  sections={displayedSections}
                />
                <DownloadBODS
                  serverData={serverData}
                />
                <ReportIncorrectData
                  key={dataVersion}
                  serverData={serverData}
                  id={serverData[0].id}
                />
              </div>
              <Details
                key={dataVersion}
                data={mockDetailsArray}
                serverData={serverData}
                sectionsShowed={getAllShowedSections}
              />
            </div>
          </div>
        </section>
        )
      : <Spinner />
  )
}

export default DetailsPage
