import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()


if __name__ == '__main__':
    client = MongoClient(os.getenv('DATABASE_URL'))
    client.drop_database('sanction')
