import os
import shutil
import ele_dlt


def separate_entries_by_collection(file_path, plain_filename):
    with open(file_path, 'r') as file:
        for line in file:
            entry = line.strip()[1:-1].split(', ')

            if len(entry) == 2:
                id, collection_name = entry
                filename = './temporary/data/' + plain_filename + '/' + collection_name + '.txt'

                with open(filename, 'a') as output_file:
                    output_file.write(f"[{id}]\n")

    print('Files created successfully.')


def folder_creation():
    for file in os.listdir('./temporary'):
        file_path = os.path.join('./temporary', file)

        if os.path.isfile(file_path):
            filename = os.path.basename(file_path)
            plain_filename = os.path.splitext(filename)[0]
            os.makedirs(f'./temporary/data/{plain_filename}')
            separate_entries_by_collection(file_path, plain_filename)


def coll_maker_main():
    if os.path.exists('./temporary/data'):
        shutil.rmtree('./temporary/data')
        os.mkdir('./temporary/data')
        folder_creation()
    else:
        os.makedirs('./temporary/data')
        folder_creation()

    ele_dlt.ele_dlt_main()
