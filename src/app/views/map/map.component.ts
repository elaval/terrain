import { Component, OnInit, NgZone } from '@angular/core';
import { tileLayer, latLng, Map, Polyline } from 'leaflet';
import * as L from 'leaflet';
import { Shape } from '../../models/Shape';
import { LeafletEvent } from 'leaflet';
import { ShapeCollection } from '../../models/ShapeCollection';
import { ShapesService } from '../../services/shapes.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  margin = {
    top:50
  }
  area;
  distance;

  drawOptions: any;
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 30, attribution: '...' })
    ],
    zoom: 18,
    center: latLng(33.391054663683704,  -97.14901305211244)
  };


  shapeCollection = new ShapeCollection();

  drawnItems: L.FeatureGroup;  // Feature group that contains all drawn items
 

  
  constructor(
    private zone: NgZone,
    private shapesService: ShapesService
  ) { }

  ngOnInit() {
    const windowSize = document.body.getBoundingClientRect().height;
    d3.select("div[leaflet]").style("height", `${windowSize-this.margin.top}px`);
  }

  onMapReady(map: Map) {

    // The map is ready, we will configure some additional layers & drawing options
    this.configureStartupLayers(map);
    this.retsoreSavedLayers(map);
    this.configureEventHandlers(map)
  }

  /**
   * Set layers & controls on the map
   */
  configureStartupLayers(map) {
    this.drawnItems = L.featureGroup().addTo(map);

    // Configure control layers (panel that allows to choose the base layer)
    const openStreetMap = L.tileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 30
    })

    const mapbox = L.tileLayer(
      'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWxhdmFsIiwiYSI6ImNqZ3JzdzhlMjA0OWkyd24xMGh2Nmp3ZjIifQ.LF8Unpt13Tmea5l6YyANRg', {
          tileSize: 512,
          zoomOffset: -1,
          attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 30
    });

    const google = new L.TileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
      attribution: 'google',
      maxZoom: 30
    });

    L.control.layers(
      {
        'street': openStreetMap.addTo(map),
        "sat": mapbox,
        "google" : google

      },
      {},//{'drawlayer': this.drawnItems },
      { position: 'bottomleft', collapsed: false }
    ).addTo(map);


    const editOptions:any = {
      featureGroup: this.drawnItems,
      poly: {
          allowIntersection: true
      }    
    }

    const drawOptions:any = {
 
      marker:false,
      circle:false,
      circlemarker:false,
      

      polyline : {
        allowIntersection: true,
        shapeOptions: {
          color: '#AAAAAA'
        }
      },
      polygon: {
          allowIntersection: false,
          showArea: true
      },
      rectangle: {
        allowIntersection: true,

        showArea:true
      }
    
    }

    this.drawOptions = {
      'position': 'topright',
      'draw': drawOptions,
      'edit': editOptions
    };
  }

  /**
   * Handle events (when items are created, edited, deleted, ...)
   * @param map 
   */
  configureEventHandlers(map) {
    map.on(L.Draw.Event.CREATED,  (event: LeafletEvent) => {
      var layer = event['layer'];

      // This might be redundatnt, but we beed to add the layer to the featureGroup in order to save tha last item
      this.drawnItems.addLayer(layer);

      this.updateMetrics();
      this.saveLayers();
    });

    map.on(L.Draw.Event.EDITED, (event: L.DrawEvents.Edited) => {
      this.updateMetrics();
      this.saveLayers();
    })

    map.on(L.Draw.Event.DELETED, (event: L.DrawEvents.Edited) => {
      this.updateMetrics();
      this.saveLayers();
    })

    const displayPos = (e) => {
      console.log(map.getZoom(), map.getCenter())
    }
    
    map.on({
      // Used as configuration helpers
      'zoomend': displayPos,
      'moveend': displayPos,
    })
  }

  /**
   * Get back to life shapes that have been saved
   * @param map 
   */
  retsoreSavedLayers(map) {
    // Add layers that have been saved
    this.shapesService.restoreLayers()
    .then((layers:any[]) => {
      layers.forEach(layer => {
        layer.addTo(this.drawnItems);
      });
      this.updateMetrics();
    })
  }

  /**
   * Calculate metrics (area & distance) for current rectangles, polygons and polylines
   */
  updateMetrics() {
    const layers = this.drawnItems.getLayers();
    const metrics = this.shapesService.calculateMetrics(layers);

    // We need to use zone.run, to make sure that Angular updates the properties 
    this.zone.run(() => {
      // Transform are units into non-metric units
      this.area = L.GeometryUtil.readableArea(metrics.area, false);

      // Transform distance into non-metric units
      this.distance = L.GeometryUtil['readableDistance'](metrics.length, "yard");
    })

  }

  /**
   * Save existing shapes into persistent storage (localStorage for the demo)
   */
  saveLayers() {
    const layers = this.drawnItems.getLayers();
    this.shapesService.saveLayers(layers);
  }

}

