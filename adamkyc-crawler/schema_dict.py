interval_schema = {
    "startDate": None,
    "endDate": None,
    "date": None,
    "summary": "",
    "description": "",
    "recordId": "",
    "sourceUrl": "",
    "publisher": "",
    "publisherUrl": "",
    "modifiedAt": None,
    "retrievedAt": None
}

address_schema = {
    "type": "",
    "summary": "",
    "description": "",
    "country": "",
    "city": "",
    "street": "",
    "postalCode": ""
}

airplane_schema = {
    "registrationNumber": "",
    "model": "",
    "owner": None,
    "operator": None,
    "buildDate": None,
    "registrationDate": None,
    "deregistrationDate": None
}

associate_schema = interval_schema.copy()
associate_schema.update({
    "subject": None,
    "object": None
})

bank_account_schema = {
    "name": "",
    "summary": "",
    "description": "",
    "country": "",
    "alias": "",
    "previousName": "",
    "weakAlias": "",
    "sourceUrl": "",
    "publisher": "",
    "publisherUrl": "",
    "wikipediaUrl": "",
    "wikidataId": "",
    "keywords": "",
    "topics": "",
    "address": address_schema,
    "addressEntity": [],
    "program": "",
    "notes": "",
    "createdAt": None,
    "modifiedAt": None,
    "retrievedAt": None,
    "unknownLinkTo": [],
    "unknownLinkFrom": [],
    "sanctions": []
}

legal_entity_schema = {
    "email": "",
    "phone": "",
    "website": "",
    "legalForm": "",
    "incorporationDate": None,
    "dissolutionDate": None,
    "taxStatus": "",
    "status": "",
    "sector": "",
    "classification": "",
    "registrationNumber": "",
    "idNumber": "",
    "taxNumber": "",
    "vatCode": "",
    "jurisdiction": "",
    "mainCountry": "",
    "opencorporatesUrl": "",
    "bvdId": "",
    "icijId": "",
    "okpoCode": "",
    "innCode": "",
    "ogrnCode": "",
    "leiCode": "",
    "dunsCode": "",
    "swiftBic": "",
    "parent": None,
    "ownedVehicles": [],
    "operatedVehicles": [],
    "subsidiaries": [],
    "identification": [],
    "directorshipDirector": [],
    "securities": [],
    "membershipMember": [],
    "agencyClient": [],
    "agentRepresentation": [],
    "ownershipOwner": [],
}

company_schema = legal_entity_schema.copy()
company_schema.update({
    "employees": [],
    "positions": [],
    "bankAccounts": [],
    "directorshipOrganization": [],
    "membershipOrganization": []
})

crypto_wallet_schema = {
    "name": "",
    "summary": "",
    "description": "",
    "country": "",
    "alias": "",
    "previousName": "",
    "weakAlias": "",
    "sourceUrl": "",
    "publisher": "",
    "publisherUrl": "",
    "wikipediaUrl": "",
    "wikidataId": "",
    "keywords": "",
    "topics": "",
    "address": address_schema,
    "addressEntity": [],
    "program": "",
    "notes": "",
    "createdAt": None,
    "modifiedAt": None,
    "retrievedAt": None,
    "unknownLinkTo": [],
    "unknownLinkFrom": [],
    "sanctions": []
}

directorship_schema = interval_schema.copy()
directorship_schema.update({
    "director": None,
    "organization": None,
    "role": "",
    "status": ""
})

employment_schema = interval_schema.copy()
employment_schema.update({
    "employee": None,
    "position": None,
    "role": "",
    "status": ""
})

family_schema = {
    "relationship": "",
    "person": None
}

identification_schema = interval_schema.copy()
identification_schema.update({
    "holder": None,
    "type": "",
    "country": "",
    "number": "",
    "authority": ""
})

membership_schema = {
    "startDate": None,
    "endDate": None,
    "date": None,
    "summary": "",
    "description": "",
    "recordId": "",
    "sourceUrl": "",
    "publisher": "",
    "publisherUrl": "",
    "modifiedAt": None,
    "retrievedAt": None,
    "role": "",
    "status": "",
    "member": None,
    "organization": None
}

occupancy_schema = interval_schema.copy()
occupancy_schema.update({
    "holder": None,
    "position": None,
    "role": "",
    "status": ""
})

organization_schema = legal_entity_schema.copy()
organization_schema.update({
    "positions": [],
    "bankAccounts": [],
    "directorshipDirector": [],
    "membershipMember": []
})

ownership_schema = interval_schema.copy()
ownership_schema.update({
    "owner": None,
    "asset": None,
    "percentage": None
})

passport_schema = interval_schema.copy()
passport_schema.update({
    "holder": None,
    "passportNumber": "",
    "surname": "",
    "givenName": "",
    "birthDate": None,
    "birthPlace": "",
    "gender": "",
    "personalNumber": ""
})

person_schema = legal_entity_schema.copy()
person_schema.update({
    "title": "",
    "firstName": "",
    "secondName": "",
    "middleName": "",
    "fatherName": "",
    "motherName": "",
    "lastName": "",
    "nameSuffix": "",
    "birthDate": None,
    "birthPlace": "",
    "birthCountry": "",
    "deathDate": None,
    "position": "",
    "nationality": "",
    "passportNumber": "",
    "gender": "",
    "ethnicity": "",
    "religion": "",
    "political": "",
    "education": "",
    "employers": [],
    "positionOccupancies": [],
    "familyPerson": [],
    "familyRelative": [],
    "associates": [],
    "associations": []
})

position_schema = {
    "name": "",
    "summary": "",
    "description": "",
    "country": "",
    "alias": "",
    "previousName": "",
    "weakAlias": "",
    "sourceUrl": "",
    "publisher": "",
    "publisherUrl": "",
    "wikipediaUrl": "",
    "wikidataId": "",
    "keywords": "",
    "topics": "",
    "address": address_schema,
    "addressEntity": [],
    "program": "",
    "notes": "",
    "createdAt": None,
    "modifiedAt": None,
    "retrievedAt": None,
    "unknownLinkTo": [],
    "unknownLinkFrom": [],
    "sanctions": []
}

representation_schema = interval_schema.copy()
representation_schema.update({
    "agent": None,
    "client": None,
    "role": "",
    "status": ""
})

sanction_schema = interval_schema.copy()
sanction_schema.update({
    "entity": None,
    "authority": "",
    "authorityId": "",
    "unscId": "",
    "program": "",
    "provisions": "",
    "status": "",
    "duration": "",
    "reason": "",
    "country": "",
    "listingDate": None
})

value_schema = {
    "amount": None,
    "currency": "",
    "amountUsd": None,
    "amountEur": None
}

security_schema = value_schema.copy()
security_schema.update({
    "name": "",
    "summary": "",
    "description": "",
    "country": "",
    "alias": "",
    "previousName": "",
    "weakAlias": "",
    "sourceUrl": "",
    "publisher": "",
    "publisherUrl": "",
    "wikipediaUrl": "",
    "wikidataId": "",
    "keywords": "",
    "topics": "",
    "address": address_schema,
    "addressEntity": [],
    "program": "",
    "notes": "",
    "createdAt": None,
    "modifiedAt": None,
    "retrievedAt": None,
    "unknownLinkTo": [],
    "unknownLinkFrom": [],
    "sanctions": []
})

unknown_link_schema = interval_schema.copy()
unknown_link_schema.update({
    "subject": None,
    "object": None
})

vessel_schema = {
    "imoNumber": "",
    "crsNumber": "",
    "flag": "",
    "registrationPort": "",
    "navigationArea": "",
    "tonnage": "",
    "grossRegisteredTonnage": None,
    "nameChangeDate": None,
    "callSign": "",
    "pastFlags": "",
    "pastTypes": "",
    "mmsi": ""
}

interest_schema = interval_schema.copy()
interest_schema.update({
    "role": "",
    "status": ""
})

asset_schema = value_schema.copy()
asset_schema.update({
    "ownershipAsset": [],
    "registrationNumber": "",
    "type": "",
    "model": "",
    "owner": None,
    "operator": None,
    "buildDate": None,
    "registrationDate": None,
    "deregistrationDate": None
})

vehicle_schema = asset_schema.copy()
vehicle_schema.update({
    "registrationNumber": "",
    "type": "",
    "model": "",
    "owner": None,
    "operator": None,
    "buildDate": None,
    "registrationDate": None,
    "deregistrationDate": None
})

thing_schema = {
    "name": "",
    "summary": "",
    "description": "",
    "country": "",
    "alias": "",
    "previousName": "",
    "weakAlias": "",
    "sourceUrl": "",
    "publisher": "",
    "publisherUrl": "",
    "wikipediaUrl": "",
    "wikidataId": "",
    "keywords": "",
    "topics": "",
    "address": None,
    "addressEntity": [],
    "program": "",
    "notes": "",
    "createdAt": None,
    "modifiedAt": None,
    "retrievedAt": None,
    "unknownLinkTo": [],
    "unknownLinkFrom": [],
    "sanctions": []
}

dataset_schema = {
    'id': '',
    'title': '',
    'description': '',
    'country': '',
    'publisher_name': '',
    'publisher_url': '',
    'source_url': '',
    'tags': [],
}

topic_schema = {
    'id': '',
    'label': '',
}
