import json
import os
import time
import shutil
from ele_dlt import process_directory

SCHEMA_MAPPING = {
    'personStatement': 'Person',
    'entityStatement': 'LegalEntity',
    'ownershipOrControlStatement': 'Ownership'
}


def process_json_objects(file_path, id_key, schema_key):
    collections = {}

    with open(file_path, 'r', encoding='utf-8') as file:
        for line_number, line in enumerate(file, start=1):
            try:
                data = json.loads(line)
                statement_id = data.get(id_key)
                schema = data.get(schema_key)

                mapped_schema = SCHEMA_MAPPING.get(schema, schema)

                if mapped_schema not in collections:
                    collections[mapped_schema] = []
                collections[mapped_schema].append(statement_id)

            except json.JSONDecodeError as e:
                print(f"Error decoding JSON at line {line_number}: {e}")

    return collections


def write_collections_to_files(collections):
    os.makedirs('./temporary', exist_ok=True)

    for schema, ids in collections.items():
        file_name = f'{schema}_output.txt'
        full_path = os.path.join('./temporary', file_name)

        with open(full_path, 'a') as output_file:
            for statement_id in ids:
                output_file.write(f"[{statement_id}]\n")


def process_directory_dedup(directory_path, id_key, schema_key):
    start_time = time.time()

    for root, _, files in os.walk(directory_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            read_json_attributes(file_path, id_key, schema_key)

    end_time = time.time()
    total_time = end_time - start_time
    print(f"Total time taken: {total_time} seconds")

    temp_directory = './temporary'
    process_directory(temp_directory)

    shutil.rmtree(temp_directory)
    print(f"Temporary directory '{temp_directory}' deleted.")


def read_json_attributes(file_path, id_key, schema_key):
    collections = process_json_objects(file_path, id_key, schema_key)
    write_collections_to_files(collections)
