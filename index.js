const { chromium } = require("playwright");
const fs = require("fs");
const express = require("express");
const app = express();
const baseHtml = fs.readFileSync("./base.html", "utf-8");

const PORT = 3000;

const generateMapScript = (lat = 51.5072, lng = -0.1276) => {
  return `
    var map = new ol.Map({
      target: "map",
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([${lng}, ${lat}]),
        zoom: 13,
      }),
    });
  `.trim();
};

async function generateMap(lat, lng) {
  const mapScript = generateMapScript(lat, lng);
  const browser = await chromium.launch(); // Or 'firefox' or 'webkit'.
  const page = await browser.newPage({
    viewport: {
      height: 300,
      width: 300,
    },
    screen: {
      height: 300,
      width: 300,
    },
  });
  await page.setContent(baseHtml);
  await page.addScriptTag({
    content: mapScript,
  });
  await page.waitForLoadState("networkidle");
  const imageBuffer = await page.screenshot({
    type: "png",
    path: "./map.png",
    fullPage: true,
  });
  await page.close();
  await browser.close();
  return imageBuffer;
}

app.get("/maps", async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const data = await generateMap(lat, lng);
    const img = Buffer.from(data, "base64");
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Length", img.length);
    res.status(201).end(img);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
