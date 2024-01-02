import pymongo
from pymongo.errors import DuplicateKeyError
import json
import os
import shutil


def load_ownership_data(files):
    client = pymongo.MongoClient(os.getenv('DATABASE_URL'))
    db = client['sanction']
    chunk_size = 1024 * 1024 * 500

    for filename in files:
        print("Loading file: ", filename)
        with open(filename, 'r', encoding='utf-8') as file:
            remaining_data = ''
            while True:
                chunk = file.read(chunk_size)
                if not chunk:
                    break
                chunk = remaining_data + chunk
                remaining_data = process_chunk(chunk, db)

    client.close()

    shutil.rmtree("./ownership_data")
    print("Ownership data folder deleted.")


def process_chunk(chunk, db):
    bulk_operations = {
        'entityStatement': [],
        'personStatement': [],
        'ownershipOrControlStatement': []
    }

    lines = chunk.splitlines()

    for i, line in enumerate(lines[:-1]):
        try:
            data = json.loads(line)
            schema = data.get('statementType')

            if schema is not None:
                insert_data: dict[str, any] = {
                    'id': data.get('statementID', None),
                    'schema': get_collection_name(schema),
                }

                if schema == "entityStatement":
                    insert_data['caption'] = data.get('name', None)
                    insert_data['properties'] = {
                        "publisher": [data.get('publicationDetails').get('publisher').get('name')],
                        "sourceUrl": [data.get('publicationDetails').get('publisher').get('url')],
                        "name": [insert_data['caption']],
                    }

                elif schema == "personStatement":
                    if data["personType"] in ["anonymousPerson", "unknownPerson"]:
                        continue

                    insert_data['caption'] = data.get('names', [{}])[0].get('fullName', None)
                    insert_data['datasets'] = data.get('identifiers', None)
                    insert_data['properties'] = {
                        "country": [data.get('addresses', None)],
                        "nationality": [data.get('nationalities', None)],
                        "birthDate": [data.get('birthDate', None)],
                        "sourceUrl": [data['publicationDetails'].get('publisher').get('url')],
                        "lastName": [data.get('names', [{}])[0].get('familyName', None)],
                        "firstName": [data.get('names', [{}])[0].get('givenName', None)],
                        "name": [insert_data['caption']],
                    }

                elif schema == "ownershipOrControlStatement":
                    insert_data['caption'] = 'Ownership'
                    insert_data['properties'] = {
                        'publisher': [data.get('publicationDetails', {}).get('publisher', {}).get('name', {})],
                        'owner': [data.get('interestedParty').get('describedByPersonStatement')],
                        'asset': [data.get('subject').get('describedByEntityStatement')],
                    }

                insert_data['referents'] = data.get('source', None)
                insert_data['datasets'] = data.get('identifiers', None)

                bulk_operations[schema].append({
                    'collection_name': insert_data['schema'],
                    'data': insert_data
                })
            else:
                print(f"Could not find 'statementType'. Skipping line {i + 1}.")
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            continue

    for schema, operations in bulk_operations.items():
        if operations:
            collection_name = get_collection_name(schema)
            collection = db[collection_name]
            data_to_insert = [operation['data'] for operation in operations]

            try:
                collection.insert_many(data_to_insert, ordered=False)
            except DuplicateKeyError:
                for operation in operations:
                    print(f"Skipping duplicate 'id' {operation['data']['id']}.")

    remaining_data = lines[-1]
    return remaining_data


def get_collection_name(schema):
    collection_mapping = {
        'entityStatement': 'LegalEntity',
        'personStatement': 'Person',
        'ownershipOrControlStatement': 'Ownership'
    }
    return collection_mapping.get(schema, 'Unknown')
