import { Controller, Get, Param } from '@nestjs/common';
import { TrustService } from '../services/trust.service';

@Controller('/v1/trust')
export class TrustController {
  constructor(private readonly trust: TrustService) {}
  @Get(':user_id') get(@Param('user_id') user_id: string) { return this.trust.get(user_id); }
}
