import requests
from bs4 import BeautifulSoup


bachelors = croho.query("type_opleiding in ['BA', 'BSC', 'LLB'] and not opleiding.str.startswith('PRE')")
for opleiding in bachelors.index:
    url = f"https://www.uu.nl/bachelors/{opleiding.replace('&', 'N')}"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    link = soup.find('a', 'admission').get('href')

    url = f"https://www.uu.nl{link}/nl"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    classes = ["diploma-reqs-free-nl", "diploma-requirements-nl", "admissions-content", "group-prior-education-nl"]
    info = soup.find(class_=classes).prettify()
    if not info:
        print(opleiding)
    with open(f"data/toelating/{opleiding}.html", 'w', encoding='utf8') as f:
        f.write(info)