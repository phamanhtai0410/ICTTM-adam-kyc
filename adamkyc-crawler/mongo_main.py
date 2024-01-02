import pymongo
from schema_dict import *
from dotenv import load_dotenv
import os

load_dotenv()
client = pymongo.MongoClient(os.getenv('DATABASE_URL'))
db = client['sanction']

interval_collection = db['Interval']
address_collection = db['Address']
airplane_collection = db['Airplane']
associate_collection = db['Associate']
bank_account_collection = db['BankAccount']
legal_entity_collection = db['LegalEntity']
company_collection = db['Company']
crypto_wallet_collection = db['CryptoWallet']
directorship_collection = db['Directorship']
employment_schema_collection = db['Employment']
family_collection = db['Family']
identification_collection = db['Identification']
membership_collection = db['Membership']
occupancy_collection = db['Occupancy']
organization_collection = db['Organization']
ownership_collection = db['Ownership']
passport_collection = db['Passport']
person_collection = db['Person']
position_collection = db['Position']
representation_collection = db['Representation']
sanction_collection = db['Sanction']
value_collection = db['Value']
security_collection = db['Security']
unknown_link_collection = db['UnknownLink']
vessel_collection = db['Vessel']
interest_collection = db['Interest']
asset_collection = db['Asset']
vehicle_collection = db['Vehicle']
thing_collection = db['Thing']
dataset_collection = db['Dataset']
topic_collection = db['Topic']

collections_schemas = {
    interval_collection: interval_schema,
    address_collection: address_schema,
    airplane_collection: airplane_schema,
    associate_collection: associate_schema,
    bank_account_collection: bank_account_schema,
    legal_entity_collection: legal_entity_schema,
    company_collection: company_schema,
    crypto_wallet_collection: crypto_wallet_schema,
    directorship_collection: directorship_schema,
    employment_schema_collection: employment_schema,
    family_collection: family_schema,
    identification_collection: identification_schema,
    membership_collection: membership_schema,
    occupancy_collection: occupancy_schema,
    organization_collection: organization_schema,
    ownership_collection: ownership_schema,
    passport_collection: passport_schema,
    person_collection: person_schema,
    position_collection: position_schema,
    representation_collection: representation_schema,
    sanction_collection: sanction_schema,
    value_collection: value_schema,
    security_collection: security_schema,
    unknown_link_collection: unknown_link_schema,
    vessel_collection: vessel_schema,
    interest_collection: interest_schema,
    asset_collection: asset_schema,
    vehicle_collection: vehicle_schema,
    thing_collection: thing_schema,
    dataset_collection: dataset_schema,
    topic_collection: topic_schema,
}

print("Statement schemas inserted successfully.")

for collection, schema in collections_schemas.items():
    if collection.count_documents({}) == 0:
        collection.insert_one(schema)
        print(f"Collection {collection.name} created successfully.")
    else:
        print(f"Collection {collection.name} already contains documents. Skipping insertion.")

db.Airplane.create_index([
  ('properties.name', pymongo.TEXT),
])

db.Person.create_index([
  ('properties.alias', pymongo.TEXT),
  ('properties.description', pymongo.TEXT),
  ('properties.email', pymongo.TEXT),
  ('properties.keywords', pymongo.TEXT),
  ('properties.name', pymongo.TEXT),
  ('properties.notes', pymongo.TEXT),
  ('properties.previousName', pymongo.TEXT),
  ('properties.summary', pymongo.TEXT),
])

db.Address.create_index([
  ('properties.full', pymongo.TEXT),
])

db.BankAccount.create_index([
  ('properties.iban', pymongo.TEXT),
])

db.CryptoWallet.create_index([
  ('properties.alias', pymongo.TEXT),
  ('properties.publicKey', pymongo.TEXT),
])

db.Company.create_index([
  ('properties.alias', pymongo.TEXT),
  ('properties.description', pymongo.TEXT),
  ('properties.email', pymongo.TEXT),
  ('properties.keywords', pymongo.TEXT),
  ('properties.name', pymongo.TEXT),
  ('properties.notes', pymongo.TEXT),
  ('properties.previousName', pymongo.TEXT),
  ('properties.summary', pymongo.TEXT),
])

db.LegalEntity.create_index([
  ('properties.alias', pymongo.TEXT),
  ('properties.email', pymongo.TEXT),
  ('properties.name', pymongo.TEXT),
  ('properties.notes', pymongo.TEXT),
  ('properties.previousName', pymongo.TEXT),
])

db.Organization.create_index([
  ('properties.alias', pymongo.TEXT),
  ('properties.description', pymongo.TEXT),
  ('properties.email', pymongo.TEXT),
  ('properties.keywords', pymongo.TEXT),
  ('properties.name', pymongo.TEXT),
  ('properties.notes', pymongo.TEXT),
  ('properties.previousName', pymongo.TEXT),
  ('properties.summary', pymongo.TEXT),
])

db.Position.create_index([
  ('properties.name', pymongo.TEXT),
])

db.Security.create_index([
  ('properties.isin', pymongo.TEXT),
  ('properties.name', pymongo.TEXT),
])

db.Vessel.create_index([
  ('properties.alias', pymongo.TEXT),
  ('properties.description', pymongo.TEXT),
  ('properties.name', pymongo.TEXT),
  ('properties.notes', pymongo.TEXT),
])

db.Airplane.create_index([('id', 1)])
db.Address.create_index([('id', 1)])
db.BankAccount.create_index([('id', 1)])
db.Company.create_index([('id', 1)])
db.CryptoWallet.create_index([('id', 1)])
db.LegalEntity.create_index([('id', 1)])
db.Organization.create_index([('id', 1)])
db.Person.create_index([('id', 1)])
db.Position.create_index([('id', 1)])
db.Security.create_index([('id', 1)])
db.Vessel.create_index([('id', 1)])

db.Associate.create_index([('properties.associate', 1)])
db.Associate.create_index([('properties.person', 1)])
db.CryptoWallet.create_index([('properties.holder', 1)])
db.Directorship.create_index([('properties.director', 1)])
db.Directorship.create_index([('properties.organization', 1)])
db.Employment.create_index([('properties.employee', 1)])
db.Employment.create_index([('properties.employer', 1)])
db.Family.create_index([('properties.person', 1)])
db.Family.create_index([('properties.relative', 1)])
db.Identification.create_index([('properties.holder', 1)])
db.Membership.create_index([('properties.member', 1)])
db.Membership.create_index([('properties.organization', 1)])
db.Occupancy.create_index([('properties.holder', 1)])
db.Occupancy.create_index([('properties.post', 1)])
db.Ownership.create_index([('properties.asset', 1)])
db.Ownership.create_index([('properties.owner', 1)])
db.Passport.create_index([('properties.holder', 1)])
db.Representation.create_index([('properties.agent', 1)])
db.Representation.create_index([('properties.client', 1)])
db.Sanction.create_index([('properties.entity', 1)])
db.Security.create_index([('properties.issuer', 1)])
db.UnknownLink.create_index([('properties.object', 1)])
db.UnknownLink.create_index([('properties.subject', 1)])
