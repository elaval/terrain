# Terrain
Basic POC of a Web application with the folowing features

* Authentication (using Auth0)
* Maps & editable objects (polygons, rectangles & polylines) using Leaflet
* Basic builtin calculation (polygons & rectangles area, polylines length)
* Basic data from external Microservices using Webtask (simulates calculation of water & sprinkles for the given area & distance input)
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
git clone xxx terrain
cd terrain
npm install
```

Clone the repo or download it from the Angular quickstart page in Auth0's documentation. Install the Angular CLI and the dependencies for the app.

```bash
npm install -g @angular/cli
cd 01-Login
npm install
```

The development server that comes with the Angular CLI can be used to serve the application.

```bash
npm start
```

The application will be served at `http://localhost:3000`.

> **Note:** The default Angular CLI port is `4200`, but Auth0 samples use port `3000` instead.


