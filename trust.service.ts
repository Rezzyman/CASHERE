import { Injectable } from '@nestjs/common';

type Trust = { user_id: string; trust_score: number; completed: number; disputed: number; kyc_level: number };

@Injectable()
export class TrustService {
  private map = new Map<string, Trust>();
  get(user_id: string) {
    if (!this.map.has(user_id)) this.map.set(user_id, { user_id, trust_score: 60, completed: 0, disputed: 0, kyc_level: 1 });
    return this.map.get(user_id);
  }
  onOrderResolved(user_id: string, success: boolean) {
    const t = this.get(user_id)!;
    if (success) t.completed += 1; else t.disputed += 1;
    t.trust_score = 50 + t.completed * 5 - t.disputed * 15 + (t.kyc_level >= 2 ? 10 : 0);
    if (t.trust_score > 100) t.trust_score = 100; if (t.trust_score < 0) t.trust_score = 0;
    return t;
  }
  dump() { return Array.from(this.map.values()); }
}
