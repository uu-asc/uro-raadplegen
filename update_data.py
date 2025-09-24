import ssl
import requests
from urllib import request
from pathlib import Path

import pandas as pd
from bs4 import BeautifulSoup
from jinja2 import Environment, FileSystemLoader

from query import osiris as osi


PATH_TO_DATA = Path('../data')
COLLEGEJAAR = 2024
URL_RATHO = 'https://wetten.overheid.nl/BWBR0035059'


#region URO
uro = (
    osi.execute_query('osiris/uro', collegejaar=COLLEGEJAAR)
    .drop('slink_code', axis=1)
    .rename(columns={
        'naam_nl': 'opleiding_naam_nl',
        'naam_en': 'opleiding_naam_en',
        'voltijd_deeltijd': 'vtdt_vorm',
        'bekostigings_niveau': 'bekostigingsniveau',
        'opleiding_ingangsdatum': 'ingangsdatum_actueel',
        'opleiding_afloopdatum': 'afloopdatum_actueel',
        'examentype_inschrijven_tm': 'ext_inschrijven_tm',
        'examentype_herinschrijven_tm': 'ext_herinschrijven_tm',
        'examentype_inschrijven_vanaf': 'ext_inschrijven_vanaf',
    })
    .astype({
        'opleiding': 'string',
        'opleiding_naam_nl': 'string',
        'opleiding_naam_en': 'string',
        'examentype': 'string',
        'vtdt_vorm': 'string',
        'type_opleiding': 'string',
        'februari_instroom': 'string',
        'faculteit': 'string',
        'aggregaat_1': 'string',
        'aggregaat_2': 'string',
        'aggregaat_3': 'string',
        'croho': 'string',
        'croho_naam_nl': 'string',
        'croho_naam_en': 'string',
        'croho_sector': 'string',
        'nominale_studieduur': 'string',
        'bekostigingsniveau': 'string',
        'ingangsdatum_actueel': 'string',
        'afloopdatum_actueel': 'string',
        'croho_inschrijven_tm': 'string',
        'croho_herinschrijven_tm': 'string',
        'croho_inschrijven_vanaf': 'string',
        'ext_inschrijven_tm': 'string',
        'ext_herinschrijven_tm': 'string',
        'ext_inschrijven_vanaf': 'string',
        'vtdt_inschrijven_tm': 'string',
        'vtdt_herinschrijven_tm': 'string',
        'vtdt_inschrijven_vanaf': 'string'
    })
    .fillna('')
)

jsondata = uro.to_json(orient='values')
(PATH_TO_DATA / 'opleiding.json').write_text(jsondata, encoding='utf8')

#region REFERENTIETABELLEN
# VAK
jsondata = osi.get_table(
    'ost_vak',
    where = "actueel = 'J'",
    select = ['vak', 'naam']
).to_json(orient='values')
(PATH_TO_DATA / 'vak.json').write_text(jsondata, encoding='utf8')


# SCHOOL
jsondata = osi.get_table(
    'ost_school',
    select = ['school', 'naam', 'plaats']
).to_json(orient='values')
(PATH_TO_DATA / 'school.json').write_text(jsondata, encoding='utf8')


# VOOROPLEIDING
jsondata = osi.get_table(
    'ost_vooropleiding',
    where = "actueel = 'J'",
    select = ['vooropleiding', 'naam', 'type_vooropleiding']
).to_json(orient='values')
(PATH_TO_DATA / 'vooropleiding.json').write_text(jsondata, encoding='utf8')


# NATIONALITEIT
jsondata = (
    osi.get_table(
        'ost_nationaliteit',
        where = "actueel = 'J'",
        select = ['nationaliteit', 'naam', 'eer', 'ingangsdatum', 'afloopdatum']
    )
    .astype({'ingangsdatum': 'string', 'afloopdatum': 'string'})
    .fillna('')
    .to_json(orient='values')
)
(PATH_TO_DATA / 'nationaliteit.json').write_text(jsondata, encoding='utf8')


# LAND
jsondata = (
    osi.get_table(
        'ost_land',
        select = ['land', 'naam', 'eer', 'land_iso', 'ingangsdatum', 'afloopdatum']
    )
    .astype({'ingangsdatum': 'string', 'afloopdatum': 'string'})
    .fillna('')
    .to_json(orient='values')
)
(PATH_TO_DATA / 'land.json').write_text(jsondata, encoding='utf8')


#region RATHO

context = ssl._create_unverified_context()
response = request.urlopen(URL_RATHO, context=context)
html = response.read()
