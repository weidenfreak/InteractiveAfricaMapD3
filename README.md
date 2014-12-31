Interactive Africa Map D3
======================


A prototype to visualise data from the worldbank. Built with D3.js

How to generate geoJSON for Africa:

ogr2ogr \
-f GeoJSON \
-where "ADM0_A3 IN ('DZA','AGO','SHN','BEN','BWA','BFA','BDI','CMR','CPV','CAF','TCD','COM','COG','DJI','EGY','GNQ','ERI','ETH','GAB','GMB','GHA','GNB','GIN','CIV','KEN','LSO','LBR','LBY','MDG','MWI','MLI','MRT','MUS','MYT','MAR','MOZ','NAM','NER','NGA','STP','REU','RWA','STP','SEN','SYC','SLE','SOM','ZAF','SHN','SDN','SWZ','TZA','TGO','TUN','UGA','COD','ZMB','TZA','ZWE','SSD','COD')" \
../countries.json \
ne_10m_admin_0_map_subunits.shp
