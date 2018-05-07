import { TestBed, inject } from '@angular/core/testing';

import { ShapeCollectionService } from './shape-collection.service';

describe('ShapeCollectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShapeCollectionService]
    });
  });

  it('should be created', inject([ShapeCollectionService], (service: ShapeCollectionService) => {
    expect(service).toBeTruthy();
  }));
});
