import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { ulid } from 'ulidx';

type Snapshot = {
  title_id: string;
  snapshot_uri: string;
  snapshot_hash: string;
  anchor_tx_id?: string | null;
  created_at: string;
};

@Injectable()
export class TitleService {
  private snapshots = new Map<string, Snapshot>();

  getSnapshot(title_id: string) {
    if (!this.snapshots.has(title_id)) {
      const payload = JSON.stringify({ title_id, example: true, evidence: [] });
      const snapshot_hash = crypto.createHash('sha256').update(payload).digest('hex');
      const snap: Snapshot = {
        title_id,
        snapshot_uri: `memory://${title_id}`,
        snapshot_hash,
        anchor_tx_id: null,
        created_at: new Date().toISOString()
      };
      this.snapshots.set(title_id, snap);
    }
    return this.snapshots.get(title_id);
  }

  createNewSnapshot(data: Record<string, unknown>) {
    const title_id = ulid();
    const payload = JSON.stringify(data);
    const snapshot_hash = crypto.createHash('sha256').update(payload).digest('hex');
    const snap: Snapshot = {
      title_id,
      snapshot_uri: `memory://${title_id}`,
      snapshot_hash,
      anchor_tx_id: null,
      created_at: new Date().toISOString()
    };
    this.snapshots.set(title_id, snap);
    return snap;
  }

  getAnchorStatus() {
    const hashes = Array.from(this.snapshots.values()).map(s => s.snapshot_hash).sort();
    const root = crypto.createHash('sha256').update(hashes.join('|')).digest('hex');
    const tx_id = '0x' + crypto.randomBytes(16).toString('hex');
    return { merkle_root: root, anchored_at: new Date().toISOString(), tx_id, count: hashes.length };
  }
}
