import { Injectable } from '@nestjs/common';

type Zone = { id: string; name: string; lat: number; lng: number; radius_km: number };

function haversine(lat1:number, lon1:number, lat2:number, lon2:number) {
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

@Injectable()
export class ZonesService {
  private zones: Zone[] = [
    { id: 'ATL-MID', name: 'Midtown', lat: 33.7838, lng: -84.3833, radius_km: 3 },
    { id: 'ATL-DTN', name: 'Downtown', lat: 33.7550, lng: -84.3900, radius_km: 3 },
    { id: 'ATL-BKY', name: 'Buckhead', lat: 33.8487, lng: -84.3733, radius_km: 5 }
  ];
  list() { return this.zones; }
  nearestZoneId(lat:number, lng:number) {
    let best = this.zones[0]; let bestD = Infinity;
    for (const z of this.zones) { const d = haversine(lat,lng,z.lat,z.lng); if (d < bestD) { bestD = d; best = z; } }
    return best.id;
  }
}
