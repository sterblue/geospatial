# Sterblue Geospatial

Geospatial monorepo for geospatial related packages

## Packages

- [Geometry Referential](./packages/geometry-referential)
- [Coordinates altitude](./packages/geometry-coordinates-altitude)
- [Geometry egm96](./packages/geometry-egm96)
### Auxiliary packages

Packages used for compiling and other auxiliary tasks.

- [Development babel preset](./packages/development-babel-preset)
- [Development rollup config](./packages/development-rollup-config)
- [Utils testing](./packages/utils-testing)
- [Development testing](./packages/development-testing)
- [Data waypoints](./packages/data-waypoints)
- [Data angles](./packages/data-angles)

## Get started

Just add the required package to your dependencies e.g. `yarn add @geospatial/geometry-referential` or add it directly editing your `package.json` enjoy! More info can be found inside the package folder.

The example below show how to use both [Geometry Referential](./packages/geometry-referential) and [Coordinates altitude](./packages/geometry-coordinates-altitude) 
```javascript

import { addAltitudeToGeojson } from "@geospatial/geometry-coordinates-altitude";
import { convert, convertAsync } from "@geospatial/geometry-referential";



    const geojson = {
        "type": "FeatureCollection",
        "crs": {
          "type": "name",
          "properties": {
            "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
          }
        },
        "features": [
              {
                "type": "Feature",
                "properties": {
                  "name": "Bourgogne"
                },
                "geometry": { "type": "Point", "coordinates": [3.461807, 46.880655] }
              },
              {
                "type": "Feature",
                "properties": {
                  "name": "Cote d'ivoire"
                },
                "geometry": { "type": "Point", "coordinates": [-4.395542, 5.332077] }
              }
            ]
      };
    async function asyncFunction() {

        /*************************
         * Add altitude to coordinate 
         * using @geospatial/geometry-coordinates-altitude
        **************************/
        var result = await addAltitudeToGeojson(geojson);
        console.log(result.features[0].geometry.coordinates);

        /*************************
         * Transform from EPSG:4326 to EPSG:3857 
         * and convert from arrayXYZ into objectXYZ
         * Using @geospatial/geometry-referential
        **************************/
        const myConvertion = await convertAsync(
            {
                system: {
                  type: "reference",
                  definition: "EPSG:4326",
                  altitudeReference: "default"
                },
                format: {
                  type: "arrayXYZ"
                }
              },
              {
                system: {
                  type: "reference",
                  definition: "EPSG:3857",
                  altitudeReference: "default"
                },
                format: {
                  type: "objectXYZ"
                }
              }
          );
        result = await myConvertion(result.features[0].geometry.coordinates);
        console.log(result);
      }
      asyncFunction();

```