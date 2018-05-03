export interface ShapeOptions {
    type:String;
    layer: any
}

/**
 * Base class to manage terrain shapes (polylines, polygons, rectangles)
 */
export class Shape {
    latlngs: any;
    type: String;

    constructor(options:ShapeOptions) {
        this.type = options.type;
        this.latlngs = options.layer.getLatLngs();
    }

    toString() {
        return JSON.stringify(this.toObject());
    }

    toObject() {
        const objectRepresentation = {
            "type" : this.type,
            "latLngs": this.latlngs
        }

        return objectRepresentation;
    }
}