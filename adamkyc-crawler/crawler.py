import requests
from bs4 import BeautifulSoup
from datetime import datetime
import time
import os
import json
from dotenv import load_dotenv
from downloader import download_and_unzip_multiple_files, download_multiple_files
from data_inp_sanction import load_sanction_data
from data_inp_ownership import load_ownership_data
from dedup_main import process_directory_dedup
from download_static_data import download_datasets, download_topics
import pymongo

load_dotenv()


def convert_json_array_to_objects(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as file:
        data = json.load(file)
        with open(output_file, 'a', encoding='utf-8') as output:
            for obj in data:
                json.dump(obj, output, ensure_ascii=False)
                output.write('\n')


def mongo_check():
    client = pymongo.MongoClient(os.getenv('DATABASE_URL'))
    db = client['sanction']

    for collection_name in db.list_collection_names():
        collection = db[collection_name]
        if collection.count_documents({}) > 0:
            return True

    return False


def save_total_time(total_time, filename='total_time.txt'):
    with open(filename, 'a') as file:
        file.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}: {total_time} seconds\n")


def opensanctions():
    url1 = "https://www.opensanctions.org/datasets/default/"
    response = requests.get(url1)
    response.raise_for_status()
    output_1 = []
    soup = BeautifulSoup(response.content, 'html.parser')
    link1 = soup.find("a", string="entities.ftm.json")

    if link1:
        file_url1 = link1["href"]
    else:
        print("links not found on the page.")
        return []

    timestamp_element = soup.find("time", class_="util_formattedDate__i6BYn")
    if timestamp_element and timestamp_element.has_attr("datetime"):
        last_changed = timestamp_element["datetime"].split("T")[0]
    else:
        print("Last changed timestamp not found on the page.")
        return []

    output_1.append([file_url1, last_changed])
    return output_1


def scrape_and_process_data():
    url1 = "http://127.0.0.1:5000"
    response = requests.get(url1)
    response.raise_for_status()
    soup = BeautifulSoup(response.content, 'html.parser')
    links = soup.find_all("a", string="JSON Download")
    output = []

    if links:
        for link in links:
            file_url = link["href"]
            card_title = link.find_previous("h5", class_="card-title serif").text.strip()
            name = card_title[:-12]
            date = card_title[-11:-1]
            output.append([name, date, file_url])

    return output


def create_folder_if_not_exists(folder_path):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f"Folder '{folder_path}' created successfully.")
    else:
        print(f"Folder '{folder_path}' already exists.")


def check_for_changes():
    while True:
        start_time = time.time()
        download_datasets()
        download_topics()

        # new_result = scrape_and_process_data()
        new_sanction = opensanctions()

        # new_result = [item for item in new_result if item[2] in [
        #     'https://s3.eu-west-1.amazonaws.com/oo-bodsdata/data/register/json.zip',
        #     'https://s3.eu-west-1.amazonaws.com/oo-bodsdata/data/latvia/json.zip',
        #     'https://s3.eu-west-1.amazonaws.com/oo-bodsdata/data/gleif/json.zip'
        # ]]

        if new_sanction:
            print("Sanctions Data Changed: {}".format(new_sanction))
            links = []
            filenames = []
            links.append(new_sanction[0][0])
            filenames.append("./sanction_data/entities.ftm.json")
            print("Downloading & Unziping ...")
            
            #Should hashtag this line when debug
            download_multiple_files(links, filenames)

            print("Unzipped")
            print("Deduplication Started...")

            if mongo_check():
                process_directory_dedup('./sanction_data', 'id', 'schema')
                print("Deduplication Done")

            print("Data insertion Started...")
            all_files_sanction = os.listdir("./sanction_data")
            full_path_sanction = [os.path.join("./sanction_data", file) for file in all_files_sanction]
            load_sanction_data(full_path_sanction)
            print("Data insertion Done")
            print("Crawler Re-Started...")
        else:
            print("Sanctions Data Unchanged at {}".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S")))

        # if new_result:
        #     print("Ownership Data Changed: {}".format(new_result))
        #     links = []
        #     filenames = []

        #     for i in range(len(new_result)):
        #         filename = new_result[i][0].split()
        #         dater = new_result[i][1].replace("-", "_")
        #         links.append(new_result[i][2])
        #         filenames.append("./ownership_data/" + filename[0] + "_" + dater + ".json.zip")

        #     print("Downloading...")
        #     download_and_unzip_multiple_files(links, filenames, "./ownership_data")
        #     convert_json_array_to_objects('./ownership_data/latvia.json', './ownership_data/latvia_new.json')
        #     os.remove("./ownership_data/latvia.json")
        #     print("Unzipped")
        #     print("Deduplication Started...")

        #     if mongo_check():
        #         print("Deduplication Started...")
        #         process_directory_dedup('./ownership_data', 'statementID', 'statementType')
        #         print("Deduplication Done")

        #     print("Data insertion Started...")
        #     all_files = os.listdir("./ownership_data")
        #     full_paths = [os.path.join("./ownership_data", file) for file in all_files]
        #     load_ownership_data(full_paths)
        #     print("Data insertion Done")
        #     print("Crawler Re-Started...")
        # else:
        #     print("Ownership Data Unchanged at {}".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S")))

        end_time = time.time()
        total_time = end_time - start_time
        print(f"Total time taken: {total_time} seconds")
        save_total_time(total_time)

        time.sleep(43200)


if __name__ == "__main__":
    folder_path = './ownership_data'
    create_folder_if_not_exists(folder_path)
    folder_path = './sanction_data'
    create_folder_if_not_exists(folder_path)
    check_for_changes()
