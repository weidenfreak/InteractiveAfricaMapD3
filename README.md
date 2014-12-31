Interactive Africa Map D3
======================
A prototype to visualise data from the [Worldbank](http://www.worldbank.org/). Currently, it shows '[Improved water source, rural (% of rural population with access)](http://data.worldbank.org/indicator/SH.H2O.SAFE.RU.ZS)'.

See [live version](http://weidenfreak.github.io/InteractiveAfricaMapD3/). (Optimised for Google Chrome only)

See [InteractiveAfricaMapD3Arduino](https://github.com/weidenfreak/InteractiveAfricaMapD3Arduino) for version with Arduino and WebSockets.

Built with [D3.js](http://d3js.org/). I recommend this awsome free book for learning D3: [Interactive Data Visualization for the Web](http://chimera.labs.oreilly.com/books/1230000000345/index.html)

Start locally
------------
Fire up a local web server to view. I use [http-server](https://github.com/nodeapps/http-server), but any server will do:
```
http-server -p 8008
```

How to generate geoJSON for a map:
----------------------------------
Install the tools as described here: [#Installing Tools](http://bost.ocks.org/mike/map/)

The free geographic data from [Natural Earth](http://www.naturalearthdata.com/)
can be found in the following folder:

```
> cd data/ne_10m_admin_0_map_subunits

> ogr2ogr \
    -f GeoJSON \
    -where "ADM0_A3 IN ('DZA','AGO','SHN','BEN','BWA','BFA','BDI','CMR','CPV','CAF',\
    'TCD','COM','COG','DJI','EGY','GNQ','ERI','ETH','GAB','GMB','GHA','GNB','GIN',\
    'CIV','KEN','LSO','LBR','LBY','MDG','MWI','MLI','MRT','MUS','MYT','MAR','MOZ',\
    'NAM','NER','NGA','STP','REU','RWA','STP','SEN','SYC','SLE','SOM','ZAF','SHN',\
    'SDN','SWZ','TZA','TGO','TUN','UGA','COD','ZMB','TZA','ZWE','SSD','COD')" \
    africa.json \
    ne_10m_admin_0_map_subunits.shp
```
