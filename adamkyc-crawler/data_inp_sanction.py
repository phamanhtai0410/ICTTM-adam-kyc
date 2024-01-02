import pymongo
from pymongo.errors import DuplicateKeyError
import json
import os
import shutil

from alias_english import process_alias_english


def load_sanction_data(files):
    client = pymongo.MongoClient(os.getenv('DATABASE_URL'))
    db = client['sanction']
    chunk_size = 1024 * 1024 * 1024

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

    shutil.rmtree("./sanction_data")
    print("Sanction data folder deleted.")


def process_chunk(chunk, db):
    bulk_operations = {
        'Interval': [],
        'Address': [],
        'Airplane': [],
        'Associate': [],
        'BankAccount': [],
        'LegalEntity': [],
        'Company': [],
        'CryptoWallet': [],
        'Directorship': [],
        'Employment': [],
        'Family': [],
        'Identification': [],
        'Membership': [],
        'Occupancy': [],
        'Organization': [],
        'Ownership': [],
        'Passport': [],
        'Person': [],
        'Position': [],
        'Representation': [],
        'Sanction': [],
        'Value': [],
        'Security': [],
        'UnknownLink': [],
        'Vessel': [],
        'Interest': [],
        'Asset': [],
        'Vehicle': [],
        'Thing': []
    }

    lines = chunk.splitlines()

    for i, line in enumerate(lines[:-1]):
        try:
            data = json.loads(line)
            schema = data.get('schema')

            if schema is not None:
                collection_name = schema
                bulk_operations[collection_name].append(data)
            else:
                print(f"Could not find 'schema'. Skipping line {i + 1}.")
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            continue

    for collection_name, data_to_insert in bulk_operations.items():
        data_to_insert = [data for data in data_to_insert if data]

        if data_to_insert:
            data_to_insert = process_alias_english(data_to_insert)
            
        if data_to_insert:
            collection = db[collection_name]
            try:
                collection.insert_many(data_to_insert, ordered=False)
            except DuplicateKeyError:
                for data in data_to_insert:
                    print(f"Skipping duplicate 'id' {data.get('id')} in schema {collection_name}.")

    remaining_data = lines[-1]
    return remaining_data
