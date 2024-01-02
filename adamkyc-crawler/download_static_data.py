import requests
from bs4 import BeautifulSoup
from db import db_collection


ignored_links = [
    '/datasets/',
    '/datasets/default/',
    '/datasets/sanctions/',
    '/datasets/peps/',
    '/datasets/crime/',
]


def format_text(value):
    return ' '.join(value.strip().split())


def download_datasets():
    datasets_res = requests.get('https://www.opensanctions.org/datasets/')
    datasets_res.raise_for_status()
    datasets_soup = BeautifulSoup(datasets_res.content, 'html.parser')

    links = datasets_soup.find_all(
        'a',
        href=lambda value: value and value.startswith('/datasets/') and value not in ignored_links
    )

    result = []

    for link in links:
        link_id = link['href'][10:-1]

        if not link_id:
            continue

        res = requests.get('https://www.opensanctions.org/datasets/' + link_id)
        res.raise_for_status()
        soup = BeautifulSoup(res.content, 'html.parser')

        title_tag = soup.find('h1')
        paragraph_tag = soup.find('p')
        information_tag = soup.find('th', string='Information:')
        publisher_tag = soup.find('th', string='Publisher:')

        if not title_tag:
            continue

        item = {
            'id': link_id,
            'title': format_text(title_tag.get_text()),
            'description': '',
            'country': '',
            'publisher_name': '',
            'publisher_url': '',
            'source_url': '',
            'tags': [],
        }

        if paragraph_tag:
            item['description'] = format_text(paragraph_tag.get_text())

        if publisher_tag:
            publisher_info = publisher_tag.parent.find('td')
            publisher_name = publisher_info.find('a')
            publisher_country = publisher_info.find('a', href=lambda value: value and value.startswith('/countries/'))
            publisher_badges = publisher_info.find_all('span', class_='badge')

            if publisher_name:
                item['publisher_name'] = format_text(publisher_name.get_text())
                item['publisher_url'] = publisher_name['href'].strip()

            if publisher_country:
                item['country'] = publisher_country['href'][11:-1]
            else:
                item['tags'].append('external dataset')

            for publisher_badge in publisher_badges:
                item['tags'].append(format_text(publisher_badge.get_text()))

        if information_tag:
            information_link = information_tag.parent.find('a')

            if information_link:
                item['source_url'] = information_link['href'].strip()

        if not item['source_url']:
            source_data_tag = soup.find('th', string='Source data:')

            if source_data_tag:
                source_data_link = source_data_tag.parent.find('a')

                if source_data_link:
                    item['source_url'] = source_data_link['href'].strip()

        result.append(item)

    if len(result) == 0:
        return

    collection = db_collection('Dataset')

    collection.delete_many({
        'id': {
            '$ne': ''
        }
    })

    collection.insert_many(result)


def download_topics():
    datasets_res = requests.get('https://www.opensanctions.org/reference/')
    datasets_res.raise_for_status()
    datasets_soup = BeautifulSoup(datasets_res.content, 'html.parser')

    anchor = datasets_soup.find('a', id='type.topic')

    if not anchor or not anchor.parent.next_sibling or not anchor.parent.next_sibling.next_sibling:
        return

    items = anchor.parent.next_sibling.next_sibling.find_all('tr')
    result = []

    for item in items:
        cells = item.find_all('td')

        if len(cells) < 2:
            continue

        result.append({
            'id': format_text(cells[0].get_text()),
            'label': format_text(cells[1].get_text()),
        })

    collection = db_collection('Topic')

    collection.delete_many({
        'id': {
            '$ne': ''
        }
    })

    collection.insert_many(result)
