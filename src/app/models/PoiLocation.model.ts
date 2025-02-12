import { LatLngLiteral } from "leaflet";

export interface PoiLocation {
    id: number
    name: string
    description: string
    imageUrl: string
    lat: number
    lng: number,
    location: {
        lat: number,
        lng: number
    }
  }