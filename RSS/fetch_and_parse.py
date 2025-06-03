import xml.etree.ElementTree as ET
import json

tree = ET.parse('RSS/feed.xml')
root = tree.getroot()
items = []

for item in root.findall('.//item'):
    title = item.find('title').text
    link = item.find('link').text
    desc = item.find('description').text
    date = item.find('pubDate').text
    items.append({
        'title': title,
        'link': link,
        'description': desc,
        'pubDate': date
    })

with open('RSS/data/feed.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)
