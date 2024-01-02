from pymongo import MongoClient
import os


def db_collection(name):
    client = MongoClient(os.getenv('DATABASE_URL'))
    return client['sanction'][name]
