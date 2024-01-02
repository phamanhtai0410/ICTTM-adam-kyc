import requests
from concurrent.futures import ThreadPoolExecutor
from tqdm import tqdm
import zipfile
import os
import sys


def download_large_file(url, local_filename):
    response = requests.get(url, stream=True)
    response.raise_for_status()
    total_size = int(response.headers.get('content-length', 0))

    with open(local_filename, 'wb') as file:
        with tqdm(total=total_size, file=sys.stdout, unit='B', unit_scale=True, desc=local_filename) as progress_bar:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    file.write(chunk)
                    progress_bar.update(len(chunk))
    print(f'Download complete: {local_filename}')
    return local_filename


def unzip_file(zip_file, destination_folder):
    with zipfile.ZipFile(zip_file, 'r') as zip_ref:
        zip_ref.extractall(destination_folder)


def download_and_unzip_multiple_files(urls, local_filenames, destination_folder):
    downloaded_files = download_multiple_files(urls, local_filenames)
    for local_filename in downloaded_files:
        zip_file = local_filename
        print(f'Unzipping started: {zip_file}')
        unzip_file(zip_file, destination_folder)
        
        #Should hashtag this line the first time debug
        os.remove(zip_file)


def download_multiple_files(urls, local_filenames):
    with ThreadPoolExecutor(max_workers=len(urls)) as executor:
        downloaded_files = list(executor.map(download_large_file, urls, local_filenames))
    return downloaded_files
