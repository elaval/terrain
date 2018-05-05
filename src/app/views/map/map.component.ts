import { Component, OnInit, NgZone } from '@angular/core';
import { tileLayer, latLng, Map, Polyline } from 'leaflet';
import * as L from 'leaflet';
import { Shape } from '../../models/Shape';
import { LeafletEvent } from 'leaflet';
import { ShapeCollection } from '../../models/ShapeCollection';
import { ShapesService } from '../../services/shapes.service';
import * as d3 from 'd3';
import { POLYLINE_SHAPE_OPTIONS } from '../../config';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  margin = {
    top:50
  }

  data = {
    area:0,
    distance:0,
    formatedArea:"",
    formatedDistance:"",
    weeklyWater: 0,
    numSprinklers: 0
  }
 

  drawOptions: any;
  options = {
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
    this.localizeDrawTooltips();
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
        'street': openStreetMap,
        "sat": mapbox.addTo(map),
        "google sat" : google

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
      // Hide these components
      marker:false,
      circle:false,
      circlemarker:false,
      

      polyline : {
        allowIntersection: false,
        shapeOptions: POLYLINE_SHAPE_OPTIONS,
        title: "Irrigation line"
      },
      polygon: {
          allowIntersection: false,
          showArea: true
      },
      rectangle: {
        allowIntersection: true,

        showArea:true
      },
      toolbar: {
        buttons: {
          polyline: 'Draw an irrigation line'
        }

      }
    
    }

    this.drawOptions = {
      'position': 'topright',
      'draw': drawOptions,
      'edit': editOptions
    };

    // Create a new control with an information panel
    const info = new L.Control({
      position:"bottomright"
    });

    info.onAdd = function (map) {
      return  <HTMLElement>document.querySelector("#infopanel");
    };

    info.addTo(map);
  }

  /**
   * Modify standard Leaflet Draw tooltip texts 
   */
  localizeDrawTooltips() {
    (L as any).drawLocal.draw.toolbar.buttons.polyline = 'Draw an irrigation line';
    (L as any).drawLocal.draw.toolbar.buttons.rectangle = 'Draw plot rectangular area';
    (L as any).drawLocal.draw.toolbar.buttons.polygon = 'Draw plot area';
    (L as any).drawLocal.draw.toolbar.buttons.polygon = 'Draw plot area';

    (L as any).drawLocal.draw.handlers.polyline.tooltip = {
      start: 'Click to start drawing irrigation line.',
      cont: 'Click to continue drawing irrigation line.',
      end: 'Click last point to finish irrigation line.'
    };

    (L as any).drawLocal.draw.handlers.polygon.tooltip = {
      start: 'Click to start drawing plot area.',
      cont: 'Click to continue drawing plot area.',
      end: 'Click first point to close this plot area.'
    };

    (L as any).drawLocal.draw.handlers.rectangle.tooltip = {
				start: 'Click and drag to draw rectangular plot area.'
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

      // Change map zoom / position to fit existing shapes
      const drawnBounds = this.drawnItems.getBounds();
      drawnBounds.isValid() ? map.fitBounds(this.drawnItems.getBounds()) : null;
    })
  }

  /**
   * Calculate metrics (area & distance) for current rectangles, polygons and polylines
   */
  updateMetrics() {
    const layers = this.drawnItems.getLayers();
    this.shapesService.calculateMetrics(layers)
    .then((metrics:any) => {
      // We need to use zone.run, to make sure that Angular updates the properties 
      this.zone.run(() => {
        // Transform are units into non-metric units
        this.data.area = metrics.area;
        this.data.formatedArea = L.GeometryUtil.readableArea(metrics.area, false);

        // Transform distance into non-metric units
        this.data.distance = metrics.distance;
        this.data.formatedDistance = L.GeometryUtil['readableDistance'](metrics.distance, "yard");
        this.data.weeklyWater = Math.round(metrics.smartMetrics.dailyWater * 7);
        this.data.numSprinklers = metrics.smartMetrics.numSprinklers;

      })
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

