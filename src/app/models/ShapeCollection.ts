import { ShapeOptions, Shape } from "./Shape";

export class ShapeCollection {
    shapes:Shape[] = [];

    constructor() {

    }

    addShape(options: ShapeOptions) {
        const newShape = new Shape(options);

        this.shapes.push(newShape);
    }

    toString() {
        return JSON.stringify(this.toArray());
    }

    toArray() {
        const shapesArray = this.shapes.map(d => d.toObject());

        return shapesArray;
    }
}