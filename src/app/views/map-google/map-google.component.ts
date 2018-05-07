import { Component, OnInit, NgZone } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@google/maps';
import { ShapeCollectionService } from '../../services/shape-collection.service';
import * as d3 from "d3";
import {} from '@types/googlemaps';

declare var google:any;

@Component({
  selector: 'app-map-google',
  templateUrl: './map-google.component.html',
  styleUrls: ['./map-google.component.css']
})
export class MapGoogleComponent implements OnInit {
  metrics: { area: number; distance: number; };
  drawingManager: any;
  title: string = 'My first AGM project';
  lat: number = 33.391054663683704;
  lng: number = -97.14901305211244;
  zoom: number = 18;
  mapTypeControlOptions = {};

  selectedShape;
  
  constructor(
    private shapeCollectionService:ShapeCollectionService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.shapeCollectionService.metrics.subscribe(metrics => {
      this.zone.run(() => this.metrics = metrics);
    })


    
  }

  mapReady(map) {
    this.mapTypeControlOptions = {
      //style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      //position: google.maps.ControlPosition.LEFT_CENTER
    }

    const infoPanelEl = d3.select("div.infopanel").node();
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(infoPanelEl);

    const deleteBtnEl = d3.select("button#delete").node()
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(deleteBtnEl);

    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon', 'polyline', 'rectangle']
      },
      rectangleOptions: {
        fillColor: 'green',
        fillOpacity: 0.5,
        strokeWeight: 5,
        clickable: true,
        editable: true,
        draggable: true
      },
      polygonOptions: {
        fillColor: 'green',
        fillOpacity: 0.5,
        strokeWeight: 5,
        clickable: true,
        editable: true,
        draggable: true
      },
      polylineOptions: {
        strokeColor:'#AAAAAA',
        strokeWeight: 8,
        clickable: true,
        editable: true,
        draggable: true
      }
    });
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'rectanglecomplete', (rectangle) => {
      var bounds = rectangle.getBounds();
    });

    google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
      const newShape = event.overlay;
      newShape.type = event.type;

      this.shapeCollectionService.add(newShape)

      // Switch back to non-drawing mode after drawing a shape.
      drawingManager.setDrawingMode(null);
      // Add an event listener that selects the newly-drawn shape when the user
      // mouses down on it.
      google.maps.event.addListener(newShape, 'click', (e) => {
          if (e.vertex !== undefined) {
              if (newShape.type === google.maps.drawing.OverlayType.POLYGON) {
                  var path = newShape.getPaths().getAt(e.path);
                  path.removeAt(e.vertex);
                  if (path.length < 3) {
                      newShape.setMap(null);
                  }
              }
              if (newShape.type === google.maps.drawing.OverlayType.POLYLINE) {
                  var path = newShape.getPath();
                  path.removeAt(e.vertex);
                  if (path.length < 2) {
                      newShape.setMap(null);
                  }
              }
          }
          this.setSelection(newShape);
      });
      this.setSelection(newShape);
              
      const dm = drawingManager;
      const m = map;
      if (event.type == 'circle') {
        var radius = event.overlay.getRadius();
      }
    });
  }

  setSelection (shape) {
    this.clearSelection();
    shape.setEditable(true);
    this.selectColor(shape.get('fillColor') || shape.get('strokeColor'));
    
    this.selectedShape = shape;
  }

  clearSelection () {
    if (this.selectedShape) {
      if (this.selectedShape.type !== 'marker') {
          this.selectedShape.setEditable(false);
      }
      this.selectedShape = null;
    }
  }

  selectColor (color) {

  }

  deleteSelectedShape () {
    if (this.selectedShape) {
      this.shapeCollectionService.remove(this.selectedShape);

      this.selectedShape.setMap(null);
    }
  }

  numberFormat(number) {
    const formatter = d3.format(",.0f");

    return formatter(number);
  }

}
