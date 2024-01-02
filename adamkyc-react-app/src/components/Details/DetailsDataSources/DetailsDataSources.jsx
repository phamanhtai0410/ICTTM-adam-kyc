import { useEffect, useState } from 'react'
import { DetailsDataSourcesCard } from 'components'
import { useStore } from 'providers'

export function DetailsDataSources ({ serverData }) {
  const { datasets } = useStore()
  const [actualDatasets, setActualDatasets] = useState([])

  useEffect(() => {
    setActualDatasets(datasets?.data ?? [])
  }, [datasets])

  const matchingDatasets = actualDatasets.filter(dataset => serverData[0].datasets.includes(dataset.id))

  return (
    <div className='person-details__card-holder' id='dataSources'>
      {matchingDatasets?.map((item, index) => {
        return <DetailsDataSourcesCard key={`${item} ${index}`} data={item} />
      })}
    </div>
  )
}
