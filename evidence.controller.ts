import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';

@Controller('/v1/evidence')
export class EvidenceController {
  constructor(private readonly orders: OrdersService) {}
  @Post('inspection')
  inspection(@Body() body: any) { return this.orders.setInspection(body.order_id, body.video_url); }
}
