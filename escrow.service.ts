import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class EscrowService {
  private stripe: Stripe | null;
  private holds = new Map<string, string>();
  private frozen = new Set<string>();

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY;
    this.stripe = key ? new Stripe(key, { apiVersion: '2024-06-20' }) : null;
  }

  async authHold(order_id: string, listing_id: string, payment_method_id: string) {
    if (!this.stripe) {
      const pi = 'pi_' + Math.random().toString(36).slice(2, 10);
      this.holds.set(order_id, pi);
      return pi;
    }
    const intent = await this.stripe.paymentIntents.create({
      amount: 2500,
      currency: 'usd',
      payment_method: payment_method_id,
      confirm: true,
      capture_method: 'manual'
    });
    this.holds.set(order_id, intent.id);
    return intent.id;
  }

  async capture(order_id: string) {
    if (this.frozen.has(order_id)) throw new Error('Order is frozen due to dispute');
    const id = this.holds.get(order_id);
    if (!id) throw new Error('No auth hold');
    if (!this.stripe) { this.holds.delete(order_id); return true; }
    await this.stripe.paymentIntents.capture(id);
    this.holds.delete(order_id);
    return true;
  }

  async freeze(order_id: string) { this.frozen.add(order_id); }
}
