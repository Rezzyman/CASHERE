"use client";
import useSWR from "swr";
import { Button, Card, Table, Tag } from "@cashere/ui";

const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const fetcher = (url: string) => fetch(url).then(r=>r.json());

export default function Admin() {
  const { data: overview, mutate } = useSWR(api + "/v1/admin/overview", fetcher);
  if (!overview) return <main style={{ padding: 24 }}>Loading…</main>;

  const queue = overview.moderation_queue || [];
  const orders = overview.orders || [];
  const trust = overview.trust || [];
  const zones = overview.zones || [];
  const analytics = overview.analytics || { links: [] };

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h1>Admin Console</h1>

      <section style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:16 }}>
        <Card title="Moderation Queue">
          {queue.length === 0 ? <div>No items</div> : (
            <Table columns={["Type","Listing","Seller","Actions"]} rows={queue.map((q:any)=>[
              q.type, q.id, q.seller_id,
              <div style={{ display:'flex', gap:8 }}>
                <Button onClick={async () => { await fetch(api + "/v1/moderation/approve", { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ listing_id:q.id }) }); mutate(); }}>Approve</Button>
                <Button variant="danger" onClick={async () => { await fetch(api + "/v1/moderation/reject", { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ listing_id:q.id, reason:'policy' }) }); mutate(); }}>Reject</Button>
              </div>
            ])} />
          )}
        </Card>

        <Card title="Zones">
          <Table columns={["ID","Name","Center","Radius (km)"]} rows={zones.map((z:any)=>[z.id, z.name, `${z.lat.toFixed(3)}, ${z.lng.toFixed(3)}`, z.radius_km])} />
        </Card>
      </section>

      <section style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, marginTop:16 }}>
        <Card title="Orders (latest 50)">
          <Table columns={["Order","Status","Reason","Pickup","Deadline"]} rows={orders.map((o:any)=>[
            o.id.slice(0,8),
            <Tag tone={o.status==='captured'?'success':o.status==='disputed'?'danger':'default'}>{o.status}</Tag>,
            o.reason || '',
            o.picked_up_at ? new Date(o.picked_up_at).toLocaleTimeString() : '',
            o.accept_deadline ? new Date(o.accept_deadline).toLocaleTimeString() : ''
          ])} />
        </Card>
        <Card title="Trust">
          <Table columns={["User","Trust","Completed","Disputed","KYC"]} rows={(trust||[]).map((t:any)=>[
            t.user_id, t.trust_score, t.completed, t.disputed, t.kyc_level
          ])} />
        </Card>
      </section>

      <section style={{ marginTop:16 }}>
        <Card title="Cross-post Links">
          <Table columns={["Token","Listing","Source","Clicks"]} rows={(analytics.links||[]).map((l:any)=>[l.token, l.listing_id, l.source, l.clicks])} />
        </Card>
      </section>
    </main>
  );
}
