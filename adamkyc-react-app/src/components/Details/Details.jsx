import { useEffect, useState } from 'react'
import { DetailsHeader, DetailsFactsheet, DetailsDescriptions, DetailsRelationships, DetailsDataSources, DetailsNews } from 'components'
import { mockDetailsArray } from 'helpers'
import assets from '../../assets/index'
import './Details.style.scss'

export function Details ({ serverData, sectionsShowed }) {
  const [familyMembers, setFamilyMembers] = useState()
  const [relatives, setRelatives] = useState()
  const [directorship, setDirectorship] = useState()
  const [directors, setDirectors] = useState()
  const [ownership, setOwnership] = useState()
  const [ownedAssets, setOwnedAssets] = useState()
  const [address, setAddress] = useState()
  const [unknownLink, setUnknownLink] = useState()
  const [unknownLinked, setUnknownLinked] = useState()
  const [associate, setAssociate] = useState()
  const [associations, setAssociations] = useState()
  const [sanction, setSanction] = useState()
  const [bankAccount, setBankAccount] = useState()
  const [cryptoWallet, setCryptoWallet] = useState()
  const [company, setCompany] = useState()
  const [employment, setEmployment] = useState()
  const [employee, setEmployee] = useState()
  const [identification, setIdentification] = useState()
  const [legalEntity, setLegalEntity] = useState()
  const [membership, setMembership] = useState()
  const [member, setMember] = useState()
  const [occupancy, setOccupancy] = useState()
  const [organization, setOrganization] = useState()
  const [passport, setPassport] = useState()
  const [person, setPerson] = useState()
  const [representation, setRepresentation] = useState()
  const [agents, setAgents] = useState()
  const [security, setSecurity] = useState()
  const [vessel, setVessel] = useState()
  const [dropdownStates, setDropdownStates] = useState({
    factsheet: true,
    descriptions: true,
    media: true,
    address: true,
    relationships: true,
    dataSources: true
  })

  function handleSplitRelationships (array, schema, setFunction) {
    if (!array?.[0].relations?.find((item) => item.schema === schema)) return null
    const result = array?.[0].relations?.filter((item) => item.schema === schema)
    setFunction(result)
  }

  function handleSplitFamilyRelationships (array, schema) {
    if (!array?.[0].relations?.find((item) => item.schema === schema)) return null
    const result = array?.[0].relations?.filter((item) => item.schema === schema)
    const family = result.filter((item) => item.properties.person[0] === array[0].id)
    const relative = result.filter((item) => item.properties.person[0] !== array[0].id)
    if (family) setFamilyMembers(family)
    if (relative) setRelatives(relative)
  }

  function handleSplitAssociateRelationships (array, schema) {
    if (!array?.[0].relations?.find((item) => item.schema === schema)) return null
    const result = array?.[0].relations?.filter((item) => item.schema === schema)
    const associate = result.filter((item) => item.properties.person[0] === array[0].id)
    const associations = result.filter((item) => item.properties.person[0] !== array[0].id)
    if (associate) setAssociate(associate)
    if (associations) setAssociations(associations)
  }

  function handleSplitRepresentationRelationships (array, schema) {
    if (!array?.[0].relations?.find((item) => item.schema === schema)) return null
    const result = array?.[0].relations?.filter((item) => item.schema === schema)
    const representation = result.filter((item) => item.properties.client[0] !== array[0].id)
    const agents = result.filter((item) => item.properties.client[0] === array[0].id)
    if (representation) setRepresentation(representation)
    if (agents) setAgents(agents)
  }

  function handleSplitEmploymentRelationships (array, schema) {
    if (!array?.[0].relations?.find((item) => item.schema === schema)) return null
    const result = array?.[0].relations?.filter((item) => item.schema === schema)
    const employment = result.filter((item) => item.properties.employer[0] !== array[0].id)
    const employees = result.filter((item) => item.properties.employer[0] === array[0].id)
    if (employment) setEmployment(employment)
    if (employees) setEmployee(employees)
  }

  function handleSplitOwnershipRelationships (array, schema) {
    if (!array?.[0].relations?.find((item) => item.schema === schema)) return null
    const result = array?.[0].relations?.filter((item) => item.schema === schema)
    const ownership = result.filter((item) => item.properties.owner[0] !== array[0].id)
    const assets = result.filter((item) => item.properties.owner[0] === array[0].id)
    if (ownership) setOwnership(ownership)
    if (assets) setOwnedAssets(assets)
  }

  function handleSplitMembershipRelationships (array, schema) {
    if (!array?.[0].relations?.find((item) => item.schema === schema)) return null
    const result = array?.[0].relations?.filter((item) => item.schema === schema)
    const member = result.filter((item) => item.properties.member[0] !== array[0].id)
    const membership = result.filter((item) => item.properties.member[0] === array[0].id)
    if (membership) setMembership(membership)
    if (member) setMember(member)
  }

  function handleSplitDirectorshipRelationships (array, schema) {
    if (!array?.[0].relations?.find((item) => item.schema === schema)) return null
    const result = array?.[0].relations?.filter((item) => item.schema === schema)
    const directors = result.filter((item) => item.properties.director[0] !== array[0].id)
    const directorship = result.filter((item) => item.properties.director[0] === array[0].id)
    if (directorship) setDirectorship(directorship)
    if (directors) setDirectors(directors)
  }

  function handleSplitUnknownLinkRelationships (array, schema) {
    if (!array?.[0].relations?.find((item) => item.schema === schema)) return null
    const result = array?.[0].relations?.filter((item) => item.schema === schema)
    const linkedTo = result.filter((item) => item.properties.object[0] !== array[0].id)
    const linkedFrom = result.filter((item) => item.properties.object[0] === array[0].id)
    if (linkedFrom) setUnknownLink(linkedFrom)
    if (linkedTo) setUnknownLinked(linkedTo)
  }

  useEffect(() => {
    if (!familyMembers && !relatives) handleSplitFamilyRelationships(serverData, 'Family')
    if (!directorship && !directors) handleSplitDirectorshipRelationships(serverData, 'Directorship')
    if (!sanction) handleSplitRelationships(serverData, 'Sanction', setSanction)
    if (!address) handleSplitRelationships(serverData, 'Address', setAddress)
    if (!unknownLink && !unknownLinked) handleSplitUnknownLinkRelationships(serverData, 'UnknownLink')
    if (!ownership && !ownedAssets) handleSplitOwnershipRelationships(serverData, 'Ownership')
    if (!associate && !associations) handleSplitAssociateRelationships(serverData, 'Associate')
    if (!bankAccount) handleSplitRelationships(serverData, 'BankAccount', setBankAccount)
    if (!cryptoWallet) handleSplitRelationships(serverData, 'CryptoWallet', setCryptoWallet)
    if (!company) handleSplitRelationships(serverData, 'Company', setCompany)
    if (!employment && !employee) handleSplitEmploymentRelationships(serverData, 'Employment')
    if (!identification) handleSplitRelationships(serverData, 'Identification', setIdentification)
    if (!legalEntity) handleSplitRelationships(serverData, 'LegalEntity', setLegalEntity)
    if (!membership && !member) handleSplitMembershipRelationships(serverData, 'Membership')
    if (!occupancy) handleSplitRelationships(serverData, 'Occupancy', setOccupancy)
    if (!organization) handleSplitRelationships(serverData, 'Organization', setOrganization)
    if (!passport) handleSplitRelationships(serverData, 'Passport', setPassport)
    if (!person) handleSplitRelationships(serverData, 'Person', setPerson)
    if (!representation && !agents) handleSplitRepresentationRelationships(serverData, 'Representation')
    if (!security) handleSplitRelationships(serverData, 'Security', setSecurity)
    if (!vessel) handleSplitRelationships(serverData, 'Vessel', setVessel)
  }, [serverData])

  function toggleExpansion (section) {
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [section]: !prevStates[section]
    }))
  }

  useEffect(() => {
    const uniqueSections = new Set()
    if (serverData && serverData.length > 0) uniqueSections.add('Factsheet')
    if (serverData && serverData[0].properties['Notes text']) uniqueSections.add('Description')
    if (serverData && serverData[0].relations.length !== 0) uniqueSections.add('Relationships')
    if (serverData && serverData[0].datasets) uniqueSections.add('Data Sources')
    if (serverData && serverData[0].id) uniqueSections.add('News')
    sectionsShowed(Array.from(uniqueSections))
  }, [])

  return (
    <div className='person-details' id='divToPrint'>
      <div className='person-details__wrapper'>
        <DetailsHeader data={mockDetailsArray[0]} serverData={serverData} sanction={sanction} />
        {serverData?.[0].properties && (
          <div>
            <div className='person-details__dropdown' id='factsheet' onClick={() => toggleExpansion('factsheet')}>
              <p className='person-details__dropdown-subtext'>Factsheet</p>
              {dropdownStates.factsheet
                ? <assets.ChevronUPSVG
                    width={24}
                    height={24}
                    className='person-details__dropdown-icon'
                  />
                : <assets.ChevronDOWNSVG
                    width={24}
                    height={24}
                    className='person-details__dropdown-icon'
                  />}
            </div>
            {dropdownStates.factsheet && <DetailsFactsheet data={mockDetailsArray[0].factsheet} serverData={serverData} />}
          </div>
        )}
        {serverData?.[0].properties['Notes text'] && (
          <div>
            <div className='person-details__dropdown' id='description' onClick={() => toggleExpansion('descriptions')}>
              <p className='person-details__dropdown-subtext'>Descriptions</p>
              {dropdownStates.descriptions
                ? <assets.ChevronUPSVG
                    width={24}
                    height={24}
                    className='person-details__dropdown-icon'
                  />
                : <assets.ChevronDOWNSVG
                    width={24}
                    height={24}
                    className='person-details__dropdown-icon'
                  />}
            </div>
            {(dropdownStates.descriptions && serverData[0].properties['Notes text']) && <DetailsDescriptions data={mockDetailsArray[0].description} serverData={serverData} />}
          </div>
        )}
        {serverData?.[0].relations.length !== 0 && (
          <div>
            <div className='person-details__dropdown' id='relationships' onClick={() => toggleExpansion('relationships')}>
              <p className='person-details__dropdown-subtext'>Relationships</p>
              {dropdownStates.relationships
                ? <assets.ChevronUPSVG
                    width={24}
                    height={24}
                    className='person-details__dropdown-icon'
                  />
                : <assets.ChevronDOWNSVG
                    width={24}
                    height={24}
                    className='person-details__dropdown-icon'
                  />}
            </div>
            {dropdownStates.relationships && (
              <DetailsRelationships
                schema={serverData[0].schema}
                data={mockDetailsArray[0].relationship}
                serverData={serverData}
                familyMembers={familyMembers?.length > 0 && familyMembers}
                relatives={relatives?.length > 0 && relatives}
                address={address}
                associate={associate?.length > 0 && associate}
                associations={associations?.length > 0 && associations}
                ownership={ownership?.length > 0 && ownership}
                ownedAssets={ownedAssets?.length > 0 && ownedAssets}
                unknownLink={unknownLink?.length > 0 && unknownLink}
                unknownLinked={unknownLinked?.length > 0 && unknownLinked}
                sanction={sanction}
                directorship={directorship?.length > 0 && directorship}
                directors={directors?.length > 0 && directors}
                bankAccount={bankAccount}
                cryptoWallet={cryptoWallet}
                company={company}
                employment={employment?.length > 0 && employment}
                employee={employee?.length > 0 && employee}
                identification={identification}
                legalEntity={legalEntity}
                membership={membership?.length > 0 && membership}
                member={member?.length > 0 && member}
                occupancy={occupancy}
                organization={organization}
                passport={passport}
                person={person}
                representation={representation?.length > 0 && representation}
                agents={agents?.length > 0 && agents}
                security={security}
                vessel={vessel}
              />
            )}
          </div>
        )}
        {serverData?.[0].id && (
          <div>
            <div className='person-details__dropdown' id='news' onClick={() => toggleExpansion('news')}>
              <p className='person-details__dropdown-subtext'>Potentially Relevant News</p>
              {dropdownStates.news
                ? <assets.ChevronUPSVG
                    width={24}
                    height={24}
                    className='person-details__dropdown-icon'
                  />
                : <assets.ChevronDOWNSVG
                    width={24}
                    height={24}
                    className='person-details__dropdown-icon'
                  />}
            </div>
            {(dropdownStates.news && serverData?.[0].id) && <DetailsNews serverData={serverData} />}
          </div>
        )}
        {serverData?.[0].datasets && (
          <div>
            <div className='person-details__dropdown' id='dataSources' onClick={() => toggleExpansion('dataSources')}>
              <p className='person-details__dropdown-subtext'>Data sources</p>
              {dropdownStates.dataSources
                ? <assets.ChevronUPSVG
                    width={24}
                    height={24}
                    className='person-details__dropdown-icon'
                  />
                : <assets.ChevronDOWNSVG
                    width={24}
                    height={24}
                    className='person-details__dropdown-icon'
                  />}
            </div>
            {(dropdownStates.dataSources && serverData?.[0].datasets) && <DetailsDataSources data={mockDetailsArray[0].datasets} serverData={serverData} />}
          </div>
        )}
      </div>
    </div>
  )
}
