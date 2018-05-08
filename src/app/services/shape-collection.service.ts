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


  constructor() { }

  add(shape) {
    const id = uuid();
    shape._id = id;
    this.collection[id] = shape;
    this.addMetrics(shape);
  }

  remove(shape) {
    const id = shape._id;
    this.collection = _.omit(this.collection, [id]);
    this.substractMetrics(shape);

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
  

}
