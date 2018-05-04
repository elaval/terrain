import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import * as d3 from 'd3';

@Injectable()
export class ShapesService {


  constructor() { }

  saveLayers(layers: L.Layer[]) {
    const shapesJson = layers.map( layer => {
        if (layer instanceof L.Rectangle) {
          return {type: 'rectangle', latLngs: layer.getLatLngs()};
        } else if (layer instanceof L.Polygon) {
          return {type: 'polygon', latLngs: layer.getLatLngs()};
        } else if (layer instanceof L.Polyline) {
          return {type: 'polyline', latLngs: layer.getLatLngs()};
        } else {
          return null
        }
    })

    const shapesString = JSON.stringify(shapesJson);

    localStorage.setItem("shapes", shapesString);

  }

  // Retrieves the shapes that have bees stored in localStorage as JSON strings and
  // converts them into layers
  restoreLayers() {
    return new Promise((resolve,reject) => {
      let layers = [];
      const shapesString = localStorage.getItem("shapes");
      const shapes:any[] = shapesString &&  shapesString !== undefined ? JSON.parse(shapesString) : null;
  
      if (shapes) {
        layers = this.shapes2Layers(shapes);
        resolve(layers);
      } else {
        // If not data has been saved, we load demo data
        const dataPromise:any = d3.json('assets/demo.json');
        dataPromise.then((shapes => {
          layers = this.shapes2Layers(shapes);
          resolve(layers);
        }));
        
      }
    
    } )

  }

  shapes2Layers(shapes) {
    const layers = shapes.map(d => {
      const type = d.type;
      let layer = null;
      switch (type) {
        case 'rectangle':
          layer = L.rectangle(d.latLngs);
          break;        
        case 'polygon':
          layer = L.polygon(d.latLngs);
          break;        
        case 'polyline':
          layer = L.polyline(d.latLngs, {color: '#AAAAAA', weight:2});
          break;
        default:
          break;
      }
      return layer;
    })

    return layers
  }



  calculateMetrics(layers) {
    let area = 0;
    let length = 0;

    layers.forEach(layer => {
      const type = this.getLayerType(layer);

      if (type == 'rectangle' || type == 'polygon') {
        area += L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
      }

      if (type == 'polyline') {
        length += this.getPolyLineLength(layer);
      }

    })

    return {'area' : area, 'length': length}
  }


  getPolyLineLength(layer) {
    let distance = 0; // distance in meters
    let previousPoint = null;

    layer.getLatLngs().forEach(point => {
      previousPoint = previousPoint || point;  // if it is the first point, we make it equal to the first
      distance += point.distanceTo(previousPoint);
    })

    return distance;
  }

  getLayerType = function(layer) {

    if (layer instanceof L.Circle) {
        return 'circle';
    }

    if (layer instanceof L.Marker) {
        return 'marker';
    }

    if (layer instanceof L.Rectangle) {
      return 'rectangle';
    }

    if ((layer instanceof L.Polygon) && ! (layer instanceof L.Rectangle)) {
      return 'polygon';
    }

    if ((layer instanceof L.Polyline) && ! (layer instanceof L.Polygon)) {
        return 'polyline';
    }

  };


}
