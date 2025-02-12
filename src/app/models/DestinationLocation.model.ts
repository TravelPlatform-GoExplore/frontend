import { LatLngLiteral } from "leaflet";
import { PoiLocation } from "./PoiLocation.model"

export class DestinationLocation {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public imageUrl: string,
        public recommendedDays: number,
        public centerLat: number,
        public centerLng: number,
        public listPOI: PoiLocation[],
        public centerLocation: LatLngLiteral
    ){}
    

    public toString(): string {
        return this.name;
    }
}