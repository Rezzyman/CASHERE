import { Controller, Get } from '@nestjs/common';
import { ModerationService } from '../services/moderation.service';
import { OrdersService } from '../services/orders.service';
import { TrustService } from '../services/trust.service';
import { ZonesService } from '../services/zones.service';
import { TrackingService } from '../services/tracking.service';

@Controller('/v1/admin')
export class AdminController {
  constructor(private readonly mod: ModerationService, private readonly orders: OrdersService, private readonly trust: TrustService, private readonly zones: ZonesService, private readonly tracking: TrackingService) {}
  @Get('overview')
  overview() { return { moderation_queue: this.mod.queue(), orders: this.orders.list(50), trust: this.trust.dump(), zones: this.zones.list(), analytics: this.tracking.dump() }; }
}
