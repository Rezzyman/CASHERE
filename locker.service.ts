import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { OrdersService } from './orders.service';
import { ZonesService } from './zones.service';

interface LockerAdapter {
  reserve(order_id: string, zone_id: string): { reservation_id: string; token: string; zone_id: string; status: 'reserved' };
  open(reservation_id: string, token: string): { ok: boolean; reservation_id?: string; status?: string; message?: string; order_id?: string };
}

class VirtualLockerAdapter implements LockerAdapter {
  private reservations = new Map<string, any>();
  reserve(order_id: string, zone_id: string) {
    const reservation_id = uuid();
    const token = 'LOCK-' + Math.random().toString(36).slice(2, 10).toUpperCase();
    this.reservations.set(reservation_id, { reservation_id, order_id, zone_id, token, status: 'reserved' });
    return { reservation_id, token, zone_id, status: 'reserved' as const };
  }
  open(reservation_id: string, token: string) {
    const rec = this.reservations.get(reservation_id);
    if (!rec || rec.token !== token) return { ok: false, message: 'Invalid token or reservation' };
    rec.status = 'opened';
    return { ok: true, reservation_id, status: rec.status, order_id: rec.order_id };
  }
}

class TTLockAdapter implements LockerAdapter {
  private reservations = new Map<string, any>();
  reserve(order_id: string, zone_id: string) {
    const reservation_id = uuid();
    const token = 'TTL-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    this.reservations.set(reservation_id, { reservation_id, order_id, zone_id, token, status: 'reserved' });
    return { reservation_id, token, zone_id, status: 'reserved' as const };
  }
  open(reservation_id: string, token: string) {
    const rec = this.reservations.get(reservation_id);
    if (!rec || rec.token !== token) return { ok: false, message: 'Invalid token or reservation' };
    rec.status = 'opened';
    return { ok: true, reservation_id, status: rec.status, order_id: rec.order_id };
  }
}

@Injectable()
export class LockerService {
  private adapter: LockerAdapter;
  constructor(private readonly orders: OrdersService, private readonly zones: ZonesService) {
    const provider = (process.env.LOCKER_PROVIDER || 'virtual').toLowerCase();
    this.adapter = provider === 'ttlock' ? new TTLockAdapter() : new VirtualLockerAdapter();
  }
  reserve(order_id: string, zone_id?: string) {
    const zid = zone_id || this.zones.nearestZoneId(33.7488, -84.3880); // default ATL coords
    return this.adapter.reserve(order_id, zid);
  }
  open(reservation_id: string, token: string) {
    const res = this.adapter.open(reservation_id, token);
    if (res.ok && res.order_id) this.orders.markPickedUp(res.order_id);
    return res;
  }
}
