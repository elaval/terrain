import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
declare var google:any;


@Injectable()
export class ShapeCollectionService {
  collection = {}
  metricsData = {
    area:0,
    distance:0
  }

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
    this.substractMetrics(shape);
    this.collection = _.omit(this.collection, [id]);
  }

  addMetrics(shape) {
    if(shape.type=='rectangle' || shape.type=='polygon') {
      this.metricsData.area += this.getArea(shape);
    } else if (shape.type=='polyline') {
      this.metricsData.distance += this.getDistance(shape);
    }

    this.metricsSubject.next(this.metricsData);
  }

  substractMetrics(shape) {
    if(shape.type=='rectangle' || shape.type=='polygon') {
      this.metricsData.area -= this.getArea(shape);
    } else if (shape.type=='polyline') {
      this.metricsData.distance -= this.getDistance(shape);
    }
    this.metricsSubject.next(this.metricsData);

  }

  getDistance(polyline) {
    const distance = google.maps.geometry.spherical.computeLength(polyline.getPath());

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
