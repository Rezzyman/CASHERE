import { Body, Controller, Get, Post } from '@nestjs/common';
import { ModerationService } from '../services/moderation.service';

@Controller('/v1/moderation')
export class ModerationController {
  constructor(private readonly mod: ModerationService) {}
  @Get('queue') queue() { return this.mod.queue(); }
  @Post('approve') approve(@Body() body: any) { return this.mod.approve(body.listing_id); }
  @Post('reject') reject(@Body() body: any) { return this.mod.reject(body.listing_id, body.reason || 'policy'); }
}
