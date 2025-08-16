import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { EscrowService } from './escrow.service';

type Order = {
  id: string;
  listing_id: string;
  buyer_id?: string;
  seller_id?: string;
  payment_intent_id?: string;
  status: 'auth_hold' | 'captured' | 'refunded' | 'canceled' | 'disputed';
  reason?: string;
  created_at: string;
  picked_up_at?: string;
  inspection_done?: boolean;
  inspection_video_url?: string;
  accept_deadline?: string;
};

@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private timers = new Map<string, NodeJS.Timeout>();

  constructor(private readonly escrow: EscrowService) {}

  create(listing_id: string, buyer_id: string, seller_id: string) {
    const o: Order = { id: uuid(), listing_id, buyer_id, seller_id, status: 'auth_hold', created_at: new Date().toISOString() };
    this.orders.unshift(o);
    return o;
  }

  list(limit = 50) { return this.orders.slice(0, limit); }
  get(id: string) { return this.orders.find(o => o.id === id); }

  markPickedUp(order_id: string) {
    const o = this.get(order_id);
    if (!o) return;
    o.picked_up_at = new Date().toISOString();
    const ms = parseInt(process.env.AUTO_ACCEPT_MS || '60000', 10);
    const deadline = new Date(Date.now() + ms).toISOString();
    o.accept_deadline = deadline;
    this.scheduleAutoAccept(o.id, ms);
    return o;
  }

  scheduleAutoAccept(order_id: string, ms: number) {
    this.clearTimer(order_id);
    const t = setTimeout(async () => {
      const o = this.get(order_id);
      if (!o) return;
      if (o.status !== 'auth_hold') return;
      try {
        await this.escrow.capture(order_id);
        o.status = 'captured';
      } catch (e) {}
    }, ms);
    this.timers.set(order_id, t);
  }

  clearTimer(order_id: string) {
    const t = this.timers.get(order_id);
    if (t) clearTimeout(t);
    this.timers.delete(order_id);
  }

  updateStatus(id: string, status: Order['status'], reason?: string) {
    const o = this.get(id);
    if (o) {
      o.status = status;
      if (reason) o.reason = reason;
      if (status !== 'auth_hold') this.clearTimer(id);
    }
    return o;
  }

  setInspection(order_id: string, video_url?: string) {
    const o = this.get(order_id);
    if (!o) return { ok: false, message: 'Order not found' };
    o.inspection_done = true;
    if (video_url) o.inspection_video_url = video_url;
    return { ok: true, order: o };
  }
}
