import { DetailsFactsheetMoreButton } from 'components'
import { RenderFactSheetColumn, dedicatedRenderArray, handleScrollTo } from 'helpers'
import assets from '../../../assets/index'
import './DetailsFactsheet.style.scss'

export function DetailsFactsheet ({ data, serverData }) {
  return (
    <div className='person-details__factsheet'>
      <div className='person-details__factsheet-column'>
        <div className='person-details__factsheet-column__1'><p>Type</p></div>
        <div className='person-details__factsheet-column__2'><p>{serverData[0].schema}</p></div>
        <div className='person-details__factsheet-column__3'>
          <a onClick={() => handleScrollTo('Data Sources')} className='person-details__factsheet-column__3-link'>
            <p>Sources</p><assets.LinkSVG width={12} height={12} />
          </a>
        </div>
      </div>
      {serverData?.[0]?.properties?.Type && RenderFactSheetColumn(serverData[0].properties.Type, 'Type', 'Regular')}
      {serverData?.[0]?.properties?.Name && RenderFactSheetColumn(serverData[0].properties.Name, 'Name', 'Regular')}
      {serverData?.[0]?.properties?.['Other name'] && RenderFactSheetColumn(serverData[0].properties['Other name'], 'Other name', 'Regular')}
      {serverData && Object.entries(serverData?.[0]?.properties).map(([key, value]) => {
        if (dedicatedRenderArray.includes(key)) return null

        return (
          <div className='person-details__factsheet-column' key={key}>
            <div className='person-details__factsheet-column__1'><p>{key}</p></div>
            <div className='person-details__factsheet-column__2'>
              <DetailsFactsheetMoreButton value={value} />
            </div>
            <div className='person-details__factsheet-column__3'>
              <a
                onClick={() => handleScrollTo('Data Sources')}
                className='person-details__factsheet-column__3-link'
              >
                <p>Sources</p>
                <assets.LinkSVG
                  width={12}
                  height={12}
                />
              </a>
            </div>
          </div>
        )
      })}
      {serverData?.[0]?.properties?.['Country of birth'] && RenderFactSheetColumn(serverData[0].properties['Country of birth'], 'Country of birth', 'Array')}
      {serverData?.[0]?.properties?.Country && RenderFactSheetColumn(serverData[0].properties.Country, 'Country', 'Array')}
      {serverData?.[0]?.properties?.Nationality && RenderFactSheetColumn(serverData[0].properties.Nationality, 'Nationality', 'Array')}
      {serverData?.[0]?.properties?.Jurisdiction && RenderFactSheetColumn(serverData[0].properties.Jurisdiction, 'Jurisdiction', 'Array')}
      {serverData?.[0]?.properties?.['E-Mail'] && RenderFactSheetColumn(serverData[0].properties['E-Mail'], 'E-Mail', 'E-Mail')}
      {serverData?.[0]?.properties?.Phone && RenderFactSheetColumn(serverData[0].properties.Phone, 'Phone', 'Phone')}
      {serverData?.[0]?.properties?.['Wikidata ID'] && RenderFactSheetColumn(serverData[0].properties['Wikidata ID'], 'Wikidata ID', 'Wikidata ID')}
      {serverData?.[0]?.properties?.['Source link'] && RenderFactSheetColumn(serverData[0].properties['Source link'], 'Source link', 'Source link Array')}
      {serverData?.[0]?.properties?.Website && RenderFactSheetColumn(serverData[0].properties.Website, 'Website', 'Website')}
      {serverData?.[0]?.properties?.LEI && RenderFactSheetColumn(serverData[0].properties.LEI, 'LEI', 'Link Array')}
      {serverData?.[0]?.properties?.['OpenCorporates URL'] && RenderFactSheetColumn(serverData[0].properties['OpenCorporates URL'], 'OpenCorporates URL', 'Source link Array')}
      {serverData?.[0]?.properties?.['Created at'] && RenderFactSheetColumn(serverData[0].properties['Created at'], 'Created at', 'Time changed')}
      {serverData?.[0]?.properties?.['Modified on'] && RenderFactSheetColumn(serverData[0].properties['Modified on'], 'Modified on', 'Time changed')}
      {serverData?.[0]?.properties?.['Last change'] && RenderFactSheetColumn(serverData[0].properties['Last change'], 'Last change', 'Time changed')}
      {serverData?.[0]?.properties?.['Last seen'] && RenderFactSheetColumn(serverData[0].properties['Last seen'], 'Last seen', 'Time changed')}
      {serverData?.[0]?.properties?.['First seen'] && RenderFactSheetColumn(serverData[0].properties['First seen'], 'First seen', 'Time changed')}
    </div>
  )
}
