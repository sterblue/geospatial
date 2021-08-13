import { getEgm96Offset } from "..";

describe("EGM96", () => {
  test("Base", async () => {
    expect(await getEgm96Offset(45, 0)).toBeCloseTo(47.29);
  }, 60000);
  test("Bourgogne", async () => {
    expect(await getEgm96Offset(46.880655, 3.461807)).toBeCloseTo(
      48.405095908105594
    );
  }, 60000);
  test("Cote d'ivoire", async () => {
    expect(await getEgm96Offset(5.332077, -4.395542)).toBeCloseTo(
      24.857435511765203
    );
  }, 60000);
});
