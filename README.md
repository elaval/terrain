# Terrain
Basic POC of a Web application with the folowing features

* Authentication (using [Auth0](https://auth0.com/))
* Maps & editable objects (polygons, rectangles & polylines) using [Leaflet](https://leafletjs.com/)
* Basic builtin calculation (polygons & rectangles area, polylines length)
* Basic data from external Microservices using [Webtask](https://webtask.io/) (simulates calculation of water & sprinkles for the given area & distance input)
This sample demonstrates how to add authentication to an Angular application using Auth0's Lock widget from the hosted login page. The sample uses the Angular CLI.
* Responsive

![alt text](https://media.giphy.com/media/8vI1CDKpgw5lDhEzcF/giphy.gif)

## Live version

[http://demo.firstmakers.com/terrain](http://demo.firstmakers.com/terrain)

This site is hosted in an Amazon S3 Bucket and is directly built & updated using [travis-ci](http://travis-ci.org) when  changes are pushed to the repository.

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


