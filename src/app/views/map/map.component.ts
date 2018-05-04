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
  
  area;
  distance;

  drawOptions: any;
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 30, attribution: '...' })
    ],
    zoom: 17,
    center: latLng(32.80285514121506, -96.89847404253672)
  };

  shapeCollection = new ShapeCollection();

  drawnItems: L.FeatureGroup;  // Feature group that contains all drawn items
 

  
  constructor(
    private zone: NgZone,
    private shapesService: ShapesService
  ) { }

  ngOnInit() {

  }

  onMapReady(map: Map) {
    console.log("MAP");

    this.drawnItems = L.featureGroup().addTo(map);
    const googleLayer = new L.TileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
      attribution: 'google'
    });

    const osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib });

    L.control.layers(
      {
        'osm': osm.addTo(map),

        "google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
            attribution: 'google'
        })
      },
      {'drawlayer': this.drawnItems },
      { position: 'topleft', collapsed: false }
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

    // Add layers that have been saved
    const layers = this.shapesService.restoreLayers();

    layers.forEach(layer => {
      console.log((layer instanceof L.Rectangle) )
      layer.addTo(this.drawnItems);
    });

    this.updateMetrics()

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
      'zoomend': displayPos,
      'moveend': displayPos,
    })


  }

  updateMetrics() {
    const layers = this.drawnItems.getLayers();
    const metrics = this.shapesService.calculateMetrics(layers);

    // We need to use zone.run, to make sure that Angular updates the properties 
    this.zone.run(() => {
      this.area = L.GeometryUtil.readableArea(metrics.area, false);
      this.distance = L.GeometryUtil['readableDistance'](metrics.length, "yard");
    })

  }


  saveLayers() {
    const layers = this.drawnItems.getLayers();
    this.shapesService.saveLayers(layers);
  }



}

