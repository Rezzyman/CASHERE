import { Injectable } from '@nestjs/common';

type Link = { token: string; listing_id: string; source: string; clicks: number; bySource: Record<string, number> };

@Injectable()
export class TrackingService {
  private links = new Map<string, Link>();
  private byListing = new Map<string, string[]>();

  createLink(listing_id: string, source: string) {
    const token = Math.random().toString(36).slice(2, 10);
    const link: Link = { token, listing_id, source, clicks: 0, bySource: {} };
    this.links.set(token, link);
    const list = this.byListing.get(listing_id) || [];
    list.push(token);
    this.byListing.set(listing_id, list);
    return { token, url: `https://cashere.link/l/${token}`, listing_id, source };
  }

  click(token: string, source: string) {
    const l = this.links.get(token);
    if (!l) return { ok: false };
    l.clicks += 1;
    l.bySource[source] = (l.bySource[source] || 0) + 1;
    return { ok: true, token };
  }

  stats(listing_id: string) {
    const tokens = this.byListing.get(listing_id) || [];
    const rows = tokens.map(t => this.links.get(t)).filter(Boolean) as Link[];
    const total = rows.reduce((a, b) => a + b.clicks, 0);
    return { listing_id, total_clicks: total, links: rows };
  }

  dump() { return { links: Array.from(this.links.values()), byListing: Array.from(this.byListing.entries()) }; }
}
