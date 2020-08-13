import pandas as pd


url = 'https://wetten.overheid.nl/BWBR0035059/2019-09-01'

ratho = pd.concat(
    pd.read_html(url)[4:14]
).rename(
    {'Opleidingen': 'croho_naam'}, axis=1
).drop(['NG¹'], axis=1)