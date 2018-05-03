import { Component, OnInit, NgZone } from '@angular/core';
import { tileLayer, latLng, Map } from 'leaflet';
import * as L from 'leaflet';
import { Shape } from '../../models/Shape';
import { LeafletEvent } from 'leaflet';
import { ShapeCollection } from '../../models/ShapeCollection';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  area: number;
  drawOptions: any;
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 30, attribution: '...' })
    ],
    zoom: 18,
    center: latLng(32.8011432, -96.8789132)
  };

  shapeCollection = new ShapeCollection();
 

  
  constructor(private zone: NgZone) { }

  ngOnInit() {

  }

  onMapReady(map: Map) {
    console.log("MAP");

    const drawnItems = L.featureGroup().addTo(map);
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
      {'drawlayer': drawnItems },
      { position: 'topleft', collapsed: false }
    ).addTo(map);


    const editOptions:any = {
      featureGroup: drawnItems,
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

    const storedShapes = JSON.parse(localStorage.getItem("shapes"));

    console.log(storedShapes);

    
    //L.polyline(storedLine.latlngs).addTo(drawnItems);

    map.on(L.Draw.Event.CREATED,  (event: LeafletEvent) => {
      var layer = event['layer'];

      this.shapeCollection.addShape({type: event['layerType'], layer:layer});
      localStorage.setItem("shapes", this.shapeCollection.toString());

      if (event['layerType'] == "polyline") {
        const newPolyline = new Polyline(layer);

        const stringRep = newPolyline.toString();

        localStorage.setItem("line", stringRep);

        let prevLatLng = null;
        layer.getLatLngs().forEach((d => {
          prevLatLng = prevLatLng || d;

          console.log(d.distanceTo(prevLatLng));

        }))
      }


      const geoData = layer.toGeoJSON();

      //const newGeoLayer = L.geoJSON(geoData).addTo(drawnItems);

          // define rectangle geographical bounds
    const bounds:any = [[32.8011432, -96.8789132], [32.8001422, -96.8779112]];

    // add rectangle passing bounds and some basic styles
    L.rectangle(bounds, {color: "red", weight: 1}).addTo(drawnItems);

      if (event['layerType'] == "rectangle") {
        const latlongs = layer.getLatLngs();

        // Add marker programatically:
        L.marker([32.8011432, -96.8789132]).addTo(drawnItems);

        layer.bindPopup('A popup!');
    

        this.zone.run(() => {
          this.area = L.GeometryUtil.geodesicArea(latlongs[0]);
        })
      }
    });



  }



}

