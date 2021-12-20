# NFT map generator

Request a new map to be generated with `latitude` and `longitude` params, for example `http://localhost:3000/maps?lat=45.3579&lng=9.4427`

The server will user Playwright to start a browser in headless mode, inject the `base.html` content into the page and then inject the script to generate the map with the requested coordinates.

The image is saved as `map.png` and also returned as a response to the browser, you can change the `path` where it's saved or disable saving on disk.

You can customize the size of the image by changing both the css inside `base.html` and the viewport/screen properties of the headless browser spawned by playwright.

For the demo I'm using OpenLayers map because it doesn't require an API key but you can use any library you want because at the end of the day it's rendering HTML and saving the screenshot of the page.