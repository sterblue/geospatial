jest.mock("vm");
import fs from "fs-extra";

import {
  generateCesiumCoordinates,
  terrainProvider,
  sampleTerrainMostDetailed,
  addAltitudeToLocation,
  addAltitudeToGeojson
} from "..";

// describe("Coordinates altitude", () => {
//   test("Positions", () => {
//     expect(
//       generateCesiumCoordinates([[-9.1711, 38.7474], [-9.171, 38.7474]])
//     ).toEqual(expect.any(Array));

//     expect(generateCesiumCoordinates([-9.1711, 38.7474])).toEqual(
//       expect.any(Object)
//     );
//   });

//   const positions = generateCesiumCoordinates([
//     [-9.1711, 38.7474],
//     [-9.171, 38.7474]
//   ]);

//   test("Coordinate height", async () => {
//     const updatedPositions = await sampleTerrainMostDetailed(
//       terrainProvider,
//       positions
//     );
//     expect(updatedPositions[0].height).toEqual(expect.any(Number));
//   });

//   test("Coordinate array", async () => {
//     return sampleTerrainMostDetailed(terrainProvider, positions).then(data => {
//       expect(data).toEqual(expect.any(Array));
//     });
//   });
// });

describe("Add altitude to location", () => {
  test("Positions", async () => {
    const result = await addAltitudeToLocation({ longitude: 1, latitude: 45 });
    // console.log(result);
    expect(result.altitude).toEqual(expect.any(Number));
  });
  test("Positions2", async () => {
    const result = await addAltitudeToLocation({
      longitude: -7.49024,
      latitude: 38.41922
    });
    console.log(result);
    expect(result.altitude).toEqual(228.43328508716138);
  });
});
describe("Add altitude to geojson", () => {
  test("geojson", async () => {
    const geojson = {
      type: "FeatureCollection",
      name: "Poteaux",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
      },
      features: [
        {
          type: "Feature",
          properties: {
            "Num�ro Support": 834,
            Commune: "Lam�court",
            Agence: "GF",
            "Texte �tiquette": "14/400",
            "Segment support": 1637,
            Type: "Poteau",
            "Poteau bois : visuel": null,
            "Poteau bois : test marteau": null,
            "Poteau bois : test enfoncement": null,
            "Plaque pos�e": "OUI",
            Cause: null,
            "Semaine d'intervention": "S 50",
            "TM        OUI/NON": null,
            "TN               OUI/NON": null,
            "Plaque bois 9,70": " ",
            "TN bois 6,90": null,
            "TM bois 6,90": null,
            "Test Marteau bois 3,90": null,
            "Plaque Beton 10,90": 10.9,
            "TN b�ton 7,90": null,
            "TM b�ton 7,90": null,
            Total: 10.9,
            "GPS X Visit": 2.481316561,
            "GPS Y Visit": 49.42899564,
            Place: "834 Lam�court",
            field_26: null,
            field_27: "406 simple",
            field_28: 406,
            cluster: "cluster1"
          },
          geometry: { type: "Point", coordinates: [2.481316561, 49.42899564] }
        },
        {
          type: "Feature",
          properties: {
            "Num�ro Support": 3214,
            Commune: "Clairoix",
            Agence: "RES",
            "Texte �tiquette": null,
            "Segment support": null,
            Type: "Poteau",
            "Poteau bois : visuel": "OUI",
            "Poteau bois : test marteau": "RAS",
            "Poteau bois : test enfoncement": null,
            "Plaque pos�e": null,
            Cause: null,
            "Semaine d'intervention": null,
            "TM        OUI/NON": null,
            "TN               OUI/NON": null,
            "Plaque bois 9,70": null,
            "TN bois 6,90": null,
            "TM bois 6,90": null,
            "Test Marteau bois 3,90": null,
            "Plaque Beton 10,90": null,
            "TN b�ton 7,90": null,
            "TM b�ton 7,90": null,
            Total: null,
            "GPS X Visit": 2.860758452,
            "GPS Y Visit": 49.44437786,
            Place: null,
            field_26: null,
            field_27: null,
            field_28: null
          },
          geometry: { type: "Point", coordinates: [2.860758452, 49.44437786] }
        }
      ]
    };
    const result = await addAltitudeToGeojson(geojson);
    expect(result.features[0].geometry.coordinates[2]).toEqual(
      expect.any(Number)
    );
  });
  // test("geojson", async () => {
  //   const geojson = await fs.readJSON(
  //     // "/Users/lcalisto/Downloads/Poteaux.geojson"
  //     "/Users/lcalisto/Documents/2DPoteauxLines.geojson"
  //   );
  //   const result = await addAltitudeToGeojson(geojson);
  //   await fs.writeFile(
  //     "/Users/lcalisto/Documents/3DPoteauxLines.geojson",
  //     JSON.stringify(result, null, 2)
  //   );
  //   expect(result.features[0].geometry.coordinates).toEqual(expect.any(Array));
  // });
});
