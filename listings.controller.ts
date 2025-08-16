import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { TitleService } from '../services/title.service';
import { ModerationService } from '../services/moderation.service';

type Listing = { id: string; item_id: string; category?: string; price_cents: number; status: string; title?: string; description?: string; condition?: string; cash_tag_id?: string; seller_id?: string; };

@Controller('/v1/listings')
export class ListingsController {
  private listings: Listing[] = [];
  constructor(private readonly titles: TitleService, private readonly mod: ModerationService) {}

  @Post()
  create(@Body() body: any) {
    const id = uuid();
    const seller_id = body.seller_id || 'seller-demo';
    const snapshot = this.titles.createNewSnapshot({ listing_id: id, item_id: body.item_id, title: body.title, description: body.description, category: body.category, price_cents: body.price_cents, seller_id });
    const flagged = this.mod.checkText((body.title||'') + ' ' + (body.description||''), seller_id).flagged;
    const status = flagged ? 'pending_review' : 'active';
    const rec: Listing = { id, ...body, seller_id, cash_tag_id: snapshot.title_id, status };
    this.listings.unshift(rec);
    if (flagged) this.mod.enqueue({ type:'listing', id, seller_id, reason:'heuristics' });
    return rec;
  }

  @Get()
  list(@Query() query: any) {
    const { category, status } = query;
    let res = this.listings;
    if (category) res = res.filter((l) => l.category === category);
    if (status) res = res.filter((l) => l.status === status);
    return res;
  }
}
