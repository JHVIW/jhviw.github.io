import xml.etree.ElementTree as ET
import json

tree = ET.parse('RSS/feed.xml')
root = tree.getroot()
items = []

for item in root.findall('.//item'):
    title = item.findtext('title') or ""
    link = item.findtext('link') or ""
    desc = item.findtext('description') or ""
    date = item.findtext('pubDate') or ""

    items.append({
        'title': title.strip(),
        'link': link.strip(),
        'description': desc.strip(),
        'pubDate': date.strip()
    })

with open('RSS/data/feed.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)
