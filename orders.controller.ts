import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EscrowService } from '../services/escrow.service';
import { OrdersService } from '../services/orders.service';
import { TrustService } from '../services/trust.service';

@Controller('/v1/orders')
export class OrdersController {
  constructor(private readonly escrow: EscrowService, private readonly orders: OrdersService, private readonly trust: TrustService) {}

  @Post()
  async create(@Body() body: any) {
    const { listing_id, payment_method_id } = body;
    const order = this.orders.create(listing_id, body.buyer_id || 'buyer-demo', body.seller_id || 'seller-demo');
    const pi = await this.escrow.authHold(order.id, listing_id, payment_method_id);
    order.payment_intent_id = pi;
    return order;
  }

  @Get()
  list(@Query('limit') limit?: string) {
    return this.orders.list(limit ? parseInt(limit) : 50);
  }

  @Post(':id/accept')
  async accept(@Param('id') id: string) {
    await this.escrow.capture(id);
    const o = this.orders.updateStatus(id, 'captured');
    if (o) this.trust.onOrderResolved(o.seller_id || 'seller-demo', true);
    return o;
  }

  @Post(':id/dispute')
  async dispute(@Param('id') id: string, @Body() body: any) {
    const { reason } = body;
    await this.escrow.freeze(id);
    const o = this.orders.updateStatus(id, 'disputed', reason);
    if (o) this.trust.onOrderResolved(o.seller_id || 'seller-demo', false);
    return o;
  }
}
