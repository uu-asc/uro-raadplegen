import pandas as pd
from urllib import request
import ssl


def fetch_ratho():
    url = 'https://wetten.overheid.nl/BWBR0035059/2022-04-15'
    context = ssl._create_unverified_context()
    response = request.urlopen(url, context=context)
    html = response.read()

    to_rename = {'Opleidingen': 'croho_naam_nl'}
    tables = pd.read_html(html)[1:10]
    return (
        pd.concat(tables, ignore_index=True)
        .rename(to_rename, axis=1)
        .drop(['NG¹'], axis=1)
    )
