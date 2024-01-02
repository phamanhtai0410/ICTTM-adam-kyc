from unidecode import unidecode
from itertools import chain



def process_alias_english(data: list):
    # Point into entities of data to process english Alias with name and caption.
    List_Entities = [
        "Person",
        "Organization",
        "Vessel",
        "Company",
        "LegalEntity"
    ]
    for entity in List_Entities:
        if data[0]["schema"] == entity:
            for index in range(len(data)):
                names_list = []
                try:
                    if 'alias' in data[index]['properties']:
                       names_list.append(data[index]['properties']['alias'])
                    if 'name' in data[index]['properties']:
                        names_list.append(data[index]['properties']['name'])
                    if 'caption' in data[index]['properties']:
                        names_list.append(data[index]['properties']['caption'])
                except:
                    print("Don't have name or caption properties in this entity to insert")
                    
                new_alias_list = []
                flatten_names_list = list(chain(*names_list))
                for name in flatten_names_list:
                    converted_name = unidecode(name)
                    if converted_name not in new_alias_list:
                        if 'alias' in data[index]['properties']:
                            if converted_name in data[index]['properties']['alias']:
                                continue
                        new_alias_list.append(converted_name)

                if 'alias' in data[index]['properties'] and new_alias_list:
                    data[index]['properties']['alias'] += new_alias_list
                elif new_alias_list:
                    data[index]['properties']['alias'] = new_alias_list
        return data
