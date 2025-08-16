import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TrackingService } from '../services/tracking.service';

@Controller('/v1/track')
export class TrackingController {
  constructor(private readonly t: TrackingService) {}
  @Get('link') link(@Query('listing_id') listing_id: string, @Query('source') source = 'share') { return this.t.createLink(listing_id, source); }
  @Post('click') click(@Body() body: any) { return this.t.click(body.token, body.source || 'unknown'); }
  @Get('stats/:listing_id') stats(@Param('listing_id') listing_id: string) { return this.t.stats(listing_id); }
}
