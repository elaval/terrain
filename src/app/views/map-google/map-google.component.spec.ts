import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapGoogleComponent } from './map-google.component';

describe('MapGoogleComponent', () => {
  let component: MapGoogleComponent;
  let fixture: ComponentFixture<MapGoogleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapGoogleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
