OpenMapJS - README

1. Configuration
----------------
The file config.json contains all the necesary settings (enpoint's url and maximum number of results accepted by the application).

2. Use 
------
After a correct configuration (config.json), the html file should be working and showing the interface.

The interface is integrated by an sidebar and the map. In particual, the sidebar puts on view all the subclasses of geosparl:Feature stored in the endpoint. Furthermore, each item can be enabled/disabled according you want to see in the map. In addition, each feature can be clicked to see which Latitude/Longitude and label corrresponds to that point. 

3. Limits
---------
The map has been tested with Parliament (v2.7.9 and 2.7.10) endpoint only. However, tests were performed with Marmotta+GeoSPARQL-module but they were lacking of inference, so future test will be carried out when they include that characteristic. 

This application is compatible only with GeoSPARQL, any other geographical standard is not recognized.

4. RDF4GeoKeetle Project
------------------------
It is a project to perform ETL-transformation for RDF generation using custom GeoKettle plugins. As a result, RDF4GeoKeetle was employed to generate the RDFs used in Geo Linked Data Ecuador. In addition, all the resulted RDF will be shown in this mapp instead of Map4RDF. 

Overall, OpenMapJS is used as a free and open alternative (you can put your logos, customize the css, modify he javascript, etc. according to the license) to Map4RDF without the engagement of an application server.

5. License
----------
This project is under GNU/LGPL v3 License.
