import { DetailsAddressTable, DetailsAgentsTable, DetailsAssociateTable, DetailsAssociationsTable, DetailsBankAccountTable, DetailsCompanyTable, DetailsCryptoWalletTable, DetailsDirectorsTable, DetailsDirectorshipTable, DetailsEmployeeTable, DetailsEmploymentTable, DetailsFamilyMembersTable, DetailsIdentificationTable, DetailsLegalEntityTable, DetailsMemberTable, DetailsMembershipTable, DetailsOccupancyTable, DetailsOrganizationTable, DetailsOwnedAssetsTable, DetailsOwnerShipTable, DetailsPersonTable, DetailsRelativesTable, DetailsRepresentationTable, DetailsSanctionTable, DetailsSecurityTable, DetailsUnknownLinkTable, DetailsUnknownLinkedTable, DetailsVesselTable } from 'components'

export function DetailsRelationships ({ data, familyMembers, relatives, directorship, directors, ownership, ownedAssets, associate, associations, unknownLink, unknownLinked, occupancy, legalEntity, cryptoWallet, company, employment, employee, identification, membership, member, passport, person, representation, agents, security, vessel, sanction, bankAccount, address, organization, schema }) {
  return (
    <div>
      {data && (
        <>
          {familyMembers && (
            <DetailsFamilyMembersTable data={familyMembers} />
          )}
          {relatives && (
            <DetailsRelativesTable data={relatives} />
          )}
          {directorship && (
            <DetailsDirectorshipTable data={directorship} />
          )}
          {directors && (
            <DetailsDirectorsTable data={directors} />
          )}
          {ownership && (
            <DetailsOwnerShipTable data={ownership} />
          )}
          {ownedAssets && (
            <DetailsOwnedAssetsTable data={ownedAssets} />
          )}
          {associate && (
            <DetailsAssociateTable data={associate} />
          )}
          {associations && (
            <DetailsAssociationsTable data={associations} />
          )}
          {unknownLink && (
            <DetailsUnknownLinkTable data={unknownLink} />
          )}
          {unknownLinked && (
            <DetailsUnknownLinkedTable data={unknownLinked} />
          )}
          {occupancy && (
            <DetailsOccupancyTable data={occupancy} />
          )}
          {legalEntity && (
            <DetailsLegalEntityTable data={legalEntity} />
          )}
          {organization && (
            <DetailsOrganizationTable data={organization} />
          )}
          {cryptoWallet && (
            <DetailsCryptoWalletTable data={cryptoWallet} />
          )}
          {company && (
            <DetailsCompanyTable data={company} schema={schema} />
          )}
          {employment && (
            <DetailsEmploymentTable data={employment} />
          )}
          {employee && (
            <DetailsEmployeeTable data={employee} />
          )}
          {identification && (
            <DetailsIdentificationTable data={identification} passportData={passport} />
          )}
          {/* {passport && (
            <DetailsPassportTable data={passport} />
          )} */}
          {membership && (
            <DetailsMembershipTable data={membership} />
          )}
          {member && (
            <DetailsMemberTable data={member} />
          )}
          {person && (
            <DetailsPersonTable data={person} />
          )}
          {representation && (
            <DetailsRepresentationTable data={representation} />
          )}
          {agents && (
            <DetailsAgentsTable data={agents} />
          )}
          {security && (
            <DetailsSecurityTable data={security} />
          )}
          {vessel && (
            <DetailsVesselTable data={vessel} />
          )}
          {sanction && (
            <DetailsSanctionTable data={sanction} />
          )}
          {bankAccount && (
            <DetailsBankAccountTable data={bankAccount} />
          )}
          {address && (
            <DetailsAddressTable data={address} />
          )}
        </>
      )}
    </div>
  )
}
