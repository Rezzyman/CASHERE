import { Injectable } from '@nestjs/common';

type QueueItem = { type: 'listing'; id: string; seller_id: string; reason: string };

@Injectable()
export class ModerationService {
  private queueItems: QueueItem[] = [];
  private banned = ['weapon', 'drugs', 'stolen', 'fake id', 'counterfeit'];
  private deviceVelocity = new Map<string, { count: number; ts: number }>();

  checkText(text: string, deviceOrUser: string) {
    const lower = (text || '').toLowerCase();
    const flagged = this.banned.some(k => lower.includes(k));
    const now = Date.now();
    const rec = this.deviceVelocity.get(deviceOrUser) || { count: 0, ts: now };
    if (now - rec.ts > 5 * 60 * 1000) { rec.count = 0; rec.ts = now; }
    rec.count++;
    this.deviceVelocity.set(deviceOrUser, rec);
    const velocityFlag = rec.count > 5;
    return { flagged: flagged || velocityFlag, reasons: { keywords: flagged, velocity: velocityFlag } };
  }

  enqueue(item: QueueItem) { this.queueItems.unshift(item); }
  queue() { return this.queueItems; }
  approve(listing_id: string) { this.queueItems = this.queueItems.filter(i => i.id !== listing_id); return { ok: true, listing_id }; }
  reject(listing_id: string, reason: string) { this.queueItems = this.queueItems.filter(i => i.id !== listing_id); return { ok: true, listing_id, reason }; }
}
