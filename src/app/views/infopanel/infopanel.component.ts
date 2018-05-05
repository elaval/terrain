import { Component, OnInit, Input } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-infopanel',
  templateUrl: './infopanel.component.html',
  styleUrls: ['./infopanel.component.css']
})
export class InfopanelComponent implements OnInit {
  @Input()
  data;

  numFormatter = d3.format(",");

  constructor() { }

  ngOnInit() {
  }

}
