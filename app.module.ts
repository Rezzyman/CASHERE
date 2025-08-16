import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ListingsController } from './listings.controller';
import { OrdersController } from './orders.controller';
import { LockerController } from './locker.controller';
import { TitleController } from './title.controller';
import { PayoutsController } from './payouts.controller';
import { EvidenceController } from './evidence.controller';
import { ModerationController } from './moderation.controller';
import { AdminController } from './admin.controller';
import { ZonesController } from './zones.controller';
import { TrackingController } from './tracking.controller';
import { TrustController } from './trust.controller';

import { LockerService } from '../services/locker.service';
import { EscrowService } from '../services/escrow.service';
import { TitleService } from '../services/title.service';
import { PayoutsService } from '../services/payouts.service';
import { OrdersService } from '../services/orders.service';
import { ModerationService } from '../services/moderation.service';
import { TrustService } from '../services/trust.service';
import { ZonesService } from '../services/zones.service';
import { TrackingService } from '../services/tracking.service';

@Module({
  imports: [],
  controllers: [
    ItemsController, ListingsController, OrdersController, LockerController, TitleController,
    PayoutsController, EvidenceController, ModerationController, AdminController, ZonesController,
    TrackingController, TrustController
  ],
  providers: [
    LockerService, EscrowService, TitleService, PayoutsService, OrdersService,
    ModerationService, TrustService, ZonesService, TrackingService
  ],
})
export class AppModule {}
