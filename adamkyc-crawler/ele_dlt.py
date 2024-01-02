import pymongo
import os


def remove_entries_from_mongodb(file_path, collection_name, base, batch_size=100000):
    client = pymongo.MongoClient(os.getenv('DATABASE_URL'))
    db = client['sanction']

    with open(file_path, 'r') as file:
        ids = [line.strip()[1:-1] for line in file]

    field_name = 'id'

    for i in range(0, len(ids), batch_size):
        batch = ids[i:i + batch_size]
        result = db[collection_name].delete_many({field_name: {'$in': batch}})
        print(f"Deleted {result.deleted_count} entries from {collection_name}. Batch {i // batch_size + 1}")

    client.close()


def process_directory(temp_directory):
    for file_name in os.listdir(temp_directory):
        if file_name.endswith('_output.txt'):
            schema = file_name[:-11]
            file_path = os.path.join(temp_directory, file_name)

            base = os.path.basename(temp_directory)
            collection_name = schema.split('_')[0] if base == 'entities_output' else schema

            remove_entries_from_mongodb(file_path, collection_name, base)
