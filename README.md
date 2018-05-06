# Terrain
Basic POC of a Web application with the folowing features

* Authentication (using [Auth0](https://auth0.com/))
* Maps & editable objects (polygons, rectangles & polylines) using [Leaflet](https://leafletjs.com/)
* Basic internal calculations for _area_ (polygons & rectangles) and _length/distance_ (polylines)
* Basic data from external Microservices using [Webtask](https://webtask.io/) 
* Responsive (for use on desktop or mobile browsers)

![alt text](https://media.giphy.com/media/8vI1CDKpgw5lDhEzcF/giphy.gif)

## Live version

[http://demo.firstmakers.com/terrain](http://demo.firstmakers.com/terrain)

This site is hosted on an Amazon S3 Bucket and is built & updated using Continous Integration (CI) using [travis-ci](http://travis-ci.org) (when changes are pushed to the repository, a new built is triggered and copied into the S3 bucket).

## External microservice
We demonstrate the use of Microservices with a simple REST API that recieves as input an _area_ and _distance_ and returns the amount of daily water required to irrigate the land area (*dailyWater*)  and the number of sprinklers required for irrigation lines with the given distance (*numSprinklers*).  _Note: Calculations are simulated for demo purposes only._

[https://wt-867ca35bffcc22ad4896795f6d081535-0.sandbox.auth0-extend.com/irrigationMetrics?area=500&distance=2400](https://wt-867ca35bffcc22ad4896795f6d081535-0.sandbox.auth0-extend.com/irrigationMetrics?area=500&distance=2400)

```json
{"dailyWater":411.8419383587934,"numSprinklers":800}
```
This information is displayed in an _Information Panel_ on the map

![Information Panel](https://raw.githubusercontent.com/elaval/terrain/master/src/assets/readme_assets/infopanel.png)

## Running the application locally

You need Angular CLI to build & run this code
```bash
npm install -g @angular/cli
```

Clone the repository to a local directory & install dependencies
```bash
git clone https://github.com/elaval/terrain.git terrain
cd terrain
npm install
```

The development server that comes with the Angular CLI can be used to serve the application.

```bash
npm start
```

The application will be served at `http://localhost:3000`.

> **Note:** The default Angular CLI port is `4200`, but in this demo with npm start we use port `3000` instead.


