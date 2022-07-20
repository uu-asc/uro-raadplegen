import requests
from bs4 import BeautifulSoup


def fetch_pages(data):
    bachelors = data.query(
        "type_opleiding in ['BA', 'BSC', 'LLB'] "
        "and not opleiding.str.startswith('PRE')", engine='python')
    for opleiding in bachelors.index:
        url = f"https://www.uu.nl/bachelors/{opleiding.replace('&', 'N')}"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        admission = soup.find('a', 'admission')
        if admission is None:
            print(opleiding)
            continue
        link = admission.get('href')
        url = f"https://www.uu.nl{link}/nl"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        classes = [
            "diploma-reqs-free-nl",
            "diploma-requirements-nl",
            "admissions-content",
            "group-prior-education-nl",
        ]
        info = soup.find(class_=classes).prettify()
        if not info:
            print(opleiding)
        fn = f"data/toelating/{opleiding}.html"
        with open(fn, 'w', encoding='utf8') as f:
            f.write(info)
