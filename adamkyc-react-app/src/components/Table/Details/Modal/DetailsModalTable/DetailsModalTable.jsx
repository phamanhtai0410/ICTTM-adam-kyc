import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useStore } from 'providers'
import { TitleCapiralize, allCountriesList, topicsSearcher } from 'helpers'
import assets from '../../../../../assets/index'
import './DetailsModalTable.style.scss'

export function DetailsModalTable ({ data, type }) {
  const { datasets } = useStore()
  const [actualDatasets, setActualDatasets] = useState([])

  useEffect(() => {
    setActualDatasets(datasets?.data ?? [])
  }, [datasets])

  const matchingDatasets = actualDatasets.filter(dataset => data.datasets.includes(dataset.id))

  function renderColumn (label, content) {
    return (
      ((content !== undefined) && (content !== null))
        ? (
          <div className='details-modal__head-column'>
            <div className='details-modal__column'>
              <p>{label}</p>
            </div>
            <div className='details-modal__column'>
              <p>{content}</p>
            </div>
          </div>
          )
        : null
    )
  }

  function renderEmail (value) {
    return value !== undefined
      ? (
        <a href={`mailto:${value}`} style={{ textDecoration: 'underline', color: 'blue' }}>{value}</a>
        )
      : null
  }

  function renderNumber (value) {
    return value !== undefined ? <span style={{ color: 'red' }}>{value}</span> : null
  }

  function renderPercentage (value) {
    return value !== undefined ? (value + '%') : null
  }

  function renderCountry (value) {
    return allCountriesList.find(element => element.code.toLowerCase() === value)?.name
  }

  function renderDate (value) {
    return value ? value[0] : null
  }

  function renderValuesArray (value) {
    return value?.length > 0 ? value.join(', ') : value !== undefined ? value : null
  }

  function renderShares (value) {
    return value ? value[0] : null
  }

  function renderDataSources () {
    const datasets = matchingDatasets.map(item => item.source_url) || null
    const names = matchingDatasets.map(item => item.title) || null
    if (datasets) return renderLink(datasets, 'Data Sources', names)
  }

  function renderTopics (value) {
    return value.map((item) => {
      return (
        <span className='person-details__header-wrapper__tag-item' style={{ width: 'fit-content' }} key={item}>
          <p className='person-details__header-wrapper__tag-subtext'>{topicsSearcher(item)}</p>
        </span>
      )
    })
  }

  function renderLink (value, text, titleArray) {
    return (
      value !== undefined && (
        <div className='details-modal__head-column'>
          <div className='details-modal__column'>
            <p>{text || 'Source link'}</p>
          </div>
          <div className='details-modal__column'>
            {value && value.map((item, index) => {
              const url = item
              const domain = (new URL(url))
              return (
                <Link
                  to={item}
                  className='person-details__factsheet-column__2-link'
                  key={item}
                >
                  <assets.LinkSVG
                    width={12}
                    height={12}
                  />
                  <p className='person-details__factsheet-column__2-link__subtext'>
                    {titleArray ? titleArray[index] : domain.hostname}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      )
    )
  }

  function renderOftenUsedValues (publishingSource) {
    return (
      <>
        {renderColumn('Start date', renderDate(data.properties.startDate))}
        {renderColumn('End date', renderDate(data.properties.endDate))}
        {publishingSource && renderColumn('Publishing source', data.properties.publisher)}
        {renderDataSources()}
      </>
    )
  }

  return (
    <>
      {type === 'Assets' && (
        <>
          {renderColumn('Asset', data.properties?.assetEntity?.caption || '-')}
          {renderColumn('Percentage held', renderPercentage(data.properties.percentage?.[0]))}
          {renderColumn('Start date', renderDate(data.properties.startDate))}
          {renderColumn('End date', renderDate(data.properties.endDate))}
          {renderColumn('Number of shares', renderShares(data.properties.numberOfShares))}
          {renderColumn('Role', data.properties.role.join(', ') || '-')}
          {renderDataSources()}
        </>
      )}
      {(type === 'Associates' || type === 'Associations') && (
        <>
          {renderColumn('Associate', type === 'Associates' ? data.properties.associateEntity.caption : data.properties.personEntity.caption)}
          {renderColumn('Relationship', renderValuesArray(data.properties.relationship))}
          {renderOftenUsedValues()}
        </>
      )}
      {type === 'Family members' && (
        <>
          {renderColumn('Relative', data.properties.relativeEntity.caption)}
          {renderColumn('Relationship', renderValuesArray(data.properties.relationship))}
          {renderOftenUsedValues()}
        </>
      )}
      {type === 'Relatives' && (
        <>
          {renderColumn('Person', data.properties.personEntity.caption)}
          {renderColumn('Relationship', renderValuesArray(data.properties.relationship))}
          {renderOftenUsedValues()}
        </>
      )}
      {type === 'Directorships' && (
        <>
          {renderColumn('Organization', data.properties.organizationEntity.caption)}
          {renderColumn('Role', renderValuesArray(data.properties.role))}
          {renderOftenUsedValues(data)}
        </>
      )}
      {type === 'Positions held' && (
        <>
          {renderColumn('Position occupied', data.properties.post)}
          {renderColumn('Status', renderValuesArray(data.properties.status))}
          {renderOftenUsedValues()}
        </>
      )}
      {type === 'Clients' && (
        <>
          {renderColumn('Client', data.properties.clientEntity.caption)}
          {renderOftenUsedValues(true)}
        </>
      )}
      {type === 'Issued securities' && (
        <>
          {renderColumn('Name', data.properties.name || '-')}
          {renderColumn('Country', renderCountry(data.properties?.country?.[0]))}
          {renderColumn('ISIN', data.properties.isin)}
          {renderColumn('Financial Instrument Global Identifier', renderValuesArray(data.properties.figiCode))}
          {renderColumn('Stock ticker symbol', renderValuesArray(data.properties.ticker))}
          {renderColumn('Type', data.properties.type)}
          {renderDataSources()}
        </>
      )}
      {type === 'Issuer securities' && (
        <>
          {renderColumn('Name', data.properties.name)}
          {renderColumn('Incorporation date', renderDate(data.properties.incorporationDate))}
          {renderColumn('Legal form', renderValuesArray(data.properties.legalForm))}
          {renderColumn('Jurisdiction', renderCountry(data.properties?.jurisdiction?.[0]))}
          {renderColumn('Registration number', data.properties.registrationNumber?.[0])}
          {renderColumn('LEI', data.properties.leiCode)}
          {renderLink(data.properties.opencorporatesUrl, 'OpenCorporates URL')}
          {renderColumn('Topics', renderTopics(data.properties.topics))}
          {renderColumn('Status', TitleCapiralize(data.properties.status?.[0]))}
          {renderColumn('Address', renderValuesArray(data.properties.address))}
          {renderColumn('Modified on', renderDate(data.properties.modifiedAt))}
          {renderDataSources()}
        </>
      )}
      {type === 'Issuer securities-organization' && (
        <>
          {renderColumn('Name', renderValuesArray(data.properties.name))}
          {renderColumn('Other name', renderValuesArray(data.properties.alias))}
          {renderColumn('Legal form', renderValuesArray(data.properties.legalForm))}
          {renderColumn('ID Number', data.properties.idNumber?.[0])}
          {renderColumn('Topics', renderTopics(data.properties.topics))}
          {renderColumn('Status', TitleCapiralize(data.properties.status?.[0]))}
          {renderColumn('Address', renderValuesArray(data.properties.address))}
          {renderColumn('Modified on', renderDate(data.properties.modifiedAt))}
          {renderDataSources()}
        </>
      )}
      {type === 'Wallet holder' && (
        <>
          {renderColumn('Name', renderValuesArray(data.properties.name))}
          {renderColumn('Other name', renderValuesArray(data.properties.alias))}
          {renderColumn('Incorporation date', renderDate(data.properties.incorporationDate))}
          {renderLink(data.properties.opencorporatesUrl, 'OpenCorporates URL')}
          {renderColumn('Legal form', renderValuesArray(data.properties.legalForm))}
          {renderColumn('Jurisdiction', renderCountry(data.properties?.jurisdiction?.[0]))}
          {renderColumn('Country', renderCountry(data.properties?.country?.[0]))}
          {renderColumn('Registration number', renderValuesArray(data.properties.registrationNumber))}
          {renderColumn('LEI', renderNumber(data.properties.leiCode))}
          {renderColumn('E-Mail', renderEmail(data.properties.email))}
          {renderColumn('Keywords', renderValuesArray(data.properties.keywords))}
          {renderColumn('Notes', renderValuesArray(data.properties.notes))}
          {renderColumn('OGRN', renderNumber(data.properties.ogrnCode?.[0]))}
          {renderColumn('PermID', renderNumber(data.properties.permId?.[0]))}
          {renderLink(data.properties.website, 'Website')}
          {renderColumn('Topics', renderTopics(data.properties.topics))}
          {renderColumn('Status', TitleCapiralize(data.properties.status?.[0]))}
          {renderColumn('Address', renderValuesArray(data.properties.address))}
          {renderLink(data.properties.sourceUrl, 'Source link')}
          {renderColumn('Created at', renderDate(data.properties.createdAt))}
          {renderColumn('Modified on', renderDate(data.properties.modifiedAt))}
          {renderDataSources()}
        </>
      )}
      {type === 'Wallet holder-person' && (
        <>
          {renderColumn('Name', renderValuesArray(data.properties.name))}
          {renderColumn('Weak alias', renderValuesArray(data.properties.weakAlias))}
          {renderColumn('Birth date', renderDate(data.properties.birthDate))}
          {renderColumn('Gender', data.properties.gender)}
          {renderColumn('Nationality', renderCountry(data.properties?.nationality?.[0]))}
          {renderColumn('Country', renderCountry(data.properties?.country?.[0]))}
          {renderColumn('First name', data.properties.firstName)}
          {renderColumn('ID Number', renderNumber(data.properties.idNumber?.[0]))}
          {renderColumn('Last name', data.properties.lastName)}
          {renderColumn('Phone', renderValuesArray(data.properties.phone))}
          {renderColumn('Topics', renderTopics(data.properties.topics))}
          {renderColumn('Address', renderValuesArray(data.properties.address))}
          {renderLink(data.properties.sourceUrl, 'Source link')}
          {renderDataSources()}
        </>
      )}
      {(type === 'Memberships' || type === 'Members') && (
        <>
          {renderColumn(type === 'Memberships' ? 'Organization' : 'Member', type === 'Memberships' ? data.properties.organizationEntity.caption : data.properties.memberEntity.caption)}
          {renderColumn('Role', renderValuesArray(data.properties.role))}
          {renderOftenUsedValues()}
        </>
      )}
      {(type === 'Linked from' || type === 'Linked to') && (
        <>
          {renderColumn(type === 'Linked from' ? 'Subject' : 'Object', type === 'Linked from' ? data.properties.subjectEntity.caption : data.properties.objectEntity.caption)}
          {renderColumn('Role', renderValuesArray(data.properties.role))}
          {renderOftenUsedValues()}
        </>
      )}
      {type === 'Sanctions' && (
        <>
          {renderColumn('Country', renderCountry(data.properties.country))}
          {renderColumn('Authority', data.properties.authority)}
          {renderColumn('Program', data.properties.program)}
          {renderColumn('Authority-issued identifier', data.properties.authorityId)}
          {renderColumn('Duration', data.properties.duration)}
          {renderColumn('Listing date', data.properties.listingDate)}
          {renderColumn('Status', TitleCapiralize(data.properties.status?.[0]))}
          {renderLink(data.properties.sourceUrl)}
          {renderOftenUsedValues()}
        </>
      )}
      {type === 'Cryptocurrency wallets' && (
        <>
          {renderColumn('Currency', data.properties.currency)}
          {renderColumn('Address', renderValuesArray(data.properties.publicKey))}
          {renderColumn('Topics', renderTopics(data.properties.topics))}
          {renderDataSources()}
        </>
      )}
      {type === 'Identifications' && (
        <>
          {renderColumn('Country', renderCountry(data.properties?.country?.[0]))}
          {renderColumn('Document number', data.properties.number)}
          {renderColumn('Type', data.properties.type)}
          {renderOftenUsedValues()}
        </>
      )}
      {type === 'Employers' && (
        <>
          {renderColumn('Employer', data.properties.employerEntity.caption)}
          {renderColumn('Role', data.properties.role)}
          {renderColumn('Modified on', data.properties.modifiedAt)}
          {renderOftenUsedValues()}
        </>
      )}
      {type === 'Employees' && (
        <>
          {renderColumn('Employee', data.properties.employeeEntity.caption)}
          {renderColumn('Role', data.properties.role)}
          {renderOftenUsedValues()}
        </>
      )}
      {(type === 'Agents' || type === 'Directors' || type === 'Owners') && (
        <>
          {renderColumn(type === 'Agents' ? 'Agent' : type === 'Directors' ? 'Director' : 'Owner', type === 'Agents' ? data.properties.agentEntity.caption : type === 'Directors' ? data.properties.directorEntity.caption : type === 'Owners' ? data.properties.ownerEntity.caption : null)}
          {renderColumn('Role', renderValuesArray(data.properties.role))}
          {type === 'Owners' && (renderColumn('Percentage held', renderPercentage(data.properties.percentage?.[0])))}
          {renderOftenUsedValues(true)}
        </>
      )}
      {type === 'Located there' && (
        <>
          {renderColumn('Country', renderCountry(data.properties?.country?.[0]))}
          {renderColumn('Full address', data.properties.full)}
          {renderColumn('City', data.properties.city)}
          {renderColumn('Street address', data.properties.street)}
          {renderColumn('State', data.properties.state)}
          {renderDataSources()}
        </>
      )}
    </>
  )
}
