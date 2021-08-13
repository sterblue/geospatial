import {
  convertGeoJsonListToDict,
  convertSterblueListToDict,
  convertLocationDictToSterblueList,
  convertLocationDictToGeojsonList
} from "..";

const locationDic = {
  latitude: 46.86553481708263,
  longitude: 3.550764192187078,
  altitude: 210.54
};
const locationSterblueList = [46.86553481708263, 3.550764192187078, 210.54];
const locationGeoJsonList = [3.550764192187078, 46.86553481708263, 210.54];

test("testconvertLocationDictToSterblueList", () => {
  expect(convertLocationDictToSterblueList(locationDic)).toEqual(
    locationSterblueList
  );
  expect(
    convertSterblueListToDict(convertLocationDictToSterblueList(locationDic))
  ).toEqual(locationDic);
});

test("testconvertLocationDictToGeojsonList", () => {
  expect(convertLocationDictToGeojsonList(locationDic)).toEqual(
    locationGeoJsonList
  );
  expect(
    convertSterblueListToDict(convertLocationDictToSterblueList(locationDic))
  ).toEqual(locationDic);
});

test("testconvertSterblueListToDict", () => {
  expect(convertSterblueListToDict(locationSterblueList)).toEqual(locationDic);
  expect(
    convertLocationDictToSterblueList(
      convertSterblueListToDict(locationSterblueList)
    )
  ).toEqual(locationSterblueList);
});

test("testconvertGeoJsonListToDict", () => {
  expect(convertGeoJsonListToDict(locationGeoJsonList)).toEqual(locationDic);
  expect(
    convertLocationDictToGeojsonList(
      convertGeoJsonListToDict(locationGeoJsonList)
    )
  ).toEqual(locationGeoJsonList);
});
