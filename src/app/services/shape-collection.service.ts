import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';
import * as d3 from "d3";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SMART_METRICS_URL } from '../config';
declare var google:any;


@Injectable()
export class ShapeCollectionService {
  collection = {};

  metricsData = {
    "area":0,
    "distance":0
  };

  metricsSubject = new BehaviorSubject(this.metricsData);
  metrics = this.metricsSubject.asObservable();


  constructor() { 
  }

  add(shape) {
    const id = uuid();
    shape._id = id;
    this.collection[id] = shape;
    this.storeCollection();
    this.addMetrics(shape);
  }

  remove(shape) {
    const id = shape._id;
    this.collection = _.omit(this.collection, [id]);
    this.storeCollection();
    this.substractMetrics(shape);

  }

  editShape(shape) {
    this.storeCollection();
    this.updateMetrics();
  }

  addMetrics(shape) {
    if(shape.type=='rectangle' || shape.type=='polygon') {
      this.metricsData.area += this.getArea(shape);
    } else if (shape.type=='polyline') {
      this.metricsData.distance += this.getDistance(shape);
    }

    this.updateMetrics();
  }

  substractMetrics(shape) {
    if(shape.type=='rectangle' || shape.type=='polygon') {
      this.metricsData.area -= this.getArea(shape);
    } else if (shape.type=='polyline') {
      this.metricsData.distance -= this.getDistance(shape);
    }
    this.updateMetrics();
  }

  getDistance(shape) {
    let distance = 0;

    if (shape.type=='polyline') {
      distance = google.maps.geometry.spherical.computeLength(shape.getPath());
    }
    return distance;
  }

  getArea(shape) {
    let area = 0;
    if (shape.type == 'polygon') {
      area = google.maps.geometry.spherical.computeArea(shape.getPath())
    } else if (shape.type == 'rectangle') {
      area = this.computeRectangleArea(shape);
    }
    
    return area;
  }

  updateMetrics() {
    let area = 0;
    let distance = 0;

    _.each(this.collection, (shape, id) => {
      area += this.getArea(shape);
      distance += this.getDistance(shape);
    })

    let metrics = {
      "area": area,
      "distance": distance
    }

    const request:any = d3.json(`${SMART_METRICS_URL}?area=${area}&distance=${distance}`);
    request
    .then(data => {
      this.metricsSubject.next(<any>{'area' : area, 'distance': distance, 'smartMetrics':data});
    })

  }


  computeRectangleArea(rectangle) {
    const bounds = rectangle.getBounds()
    if (!bounds) {
      return 0;
    }
    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();
    var southWest = new google.maps.LatLng(sw.lat(), sw.lng());
    var northEast = new google.maps.LatLng(ne.lat(), ne.lng());
    var southEast = new google.maps.LatLng(sw.lat(), ne.lng());
    var northWest = new google.maps.LatLng(ne.lat(), sw.lng());
    return google.maps.geometry.spherical.computeArea([northEast, northWest, southWest, southEast]);
  };
  

  storeCollection() {
    const plainObjectCollection = _.map(this.collection, (shape, id) => {
      return this.toObject(shape);
    })
    localStorage.setItem("gmapCollection", JSON.stringify(plainObjectCollection));
  }

  retrieveCollection() {
    const plainObjectCollection = JSON.parse(localStorage.getItem("gmapCollection") || "{}");
    
    _.each(plainObjectCollection, (object) => {
      if (object && object._id) {
        this.collection[object._id] = this.toShape(object);
      }
    })

    return _.map(this.collection, d => d);
  }

  collection2Overlays() {
    const overlays = _.map(this.collection, (shape, id) => {
      if (shape.type = "polygon") {
        return new google.maps.Polygon({
        
        });
      }
    })

  }

  toObject(shape) {
    if (shape.type == "rectangle") {
      const bounds = shape.getBounds();

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const n = ne.lat();
      const e = ne.lng();
      const s = sw.lat();
      const w = sw.lng();

      return {
        type: shape.type,
        _id: shape._id,
        bounds : {
          north: n,
          east: e,
          south: s,
          west: w
        }
      }
    } else if (shape.type == "polygon") {
      const latLngs = shape.getPath().getArray().map(d => {
        return {lat: d.lat(), lng:d.lng()};
      });
      return {
        type: shape.type,
        _id: shape._id,
        latLngs : latLngs
      } 
    } else if (shape.type == "polyline") {
      const latLngs = shape.getPath().getArray().map(d => {
        return {lat: d.lat(), lng:d.lng()};
      });
      return {
        type: shape.type,
        _id: shape._id,
        latLngs : latLngs
      } 
    }
  }

  toShape(object) {
    if (object.type == "rectangle") {
      const shape =  new google.maps.Rectangle({
        bounds : object.bounds,
        fillColor: 'green',
        fillOpacity: 0.5,
        strokeWeight: 5,
        clickable: true,
        editable: false,
        draggable: true
      });

      shape._id = object._id;
      shape.type = object.type;
      return shape;
    } if (object.type == "polygon") {
      const shape =  new google.maps.Polygon({
        path : object.latLngs,
        fillColor: 'green',
        fillOpacity: 0.5,
        strokeWeight: 5,
        clickable: true,
        editable: false,
        draggable: true
      });

      shape._id = object._id;
      shape.type = object.type;
      return shape;
    } if (object.type == "polyline") {
      const shape =  new google.maps.Polyline({
        path : object.latLngs,
        strokeColor:'#AAAAAA',
        strokeWeight: 8,
        clickable: true,
        editable: false,
        draggable: true
      });

      shape._id = object._id;
      shape.type = object.type;
      return shape;
    }
  }
}
