import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-infopanel',
  templateUrl: './infopanel.component.html',
  styleUrls: ['./infopanel.component.css']
})
export class InfopanelComponent implements OnInit {
  @Input()
  data;

  constructor() { }

  ngOnInit() {
  }

}
