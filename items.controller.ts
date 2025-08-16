import { Body, Controller, Post, Headers } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ModerationService } from '../services/moderation.service';

@Controller('/v1/items')
export class ItemsController {
  constructor(private readonly mod: ModerationService) {}

  @Post()
  createItem(@Body() body: any, @Headers('x-device-id') deviceId?: string) {
    const id = uuid();
    const seller_id = body.seller_id || 'seller-demo';
    const moderation = this.mod.checkText(body.title + ' ' + (body.description||''), deviceId || 'unknown');
    return { id, ...body, seller_id, status: moderation.flagged ? 'pending_review' : 'listed', moderation };
  }
}
