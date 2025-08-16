import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Pressable, TextInput, FlatList } from 'react-native';
import { ClerkProvider, SignInButton } from '@clerk/clerk-expo';
import { StatusBar } from 'expo-status-bar';

const pk = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const API = process.env.API_URL || 'http://localhost:4000';

function Listings() {
  const [title, setTitle] = useState('Nintendo Switch');
  const [desc, setDesc] = useState('Neon, 2019');
  const [price, setPrice] = useState('15000');
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const load = async () => {
    const j = await fetch(API + '/v1/listings').then(r=>r.json());
    setListings(j);
    const o = await fetch(API + '/v1/orders?limit=20').then(r=>r.json());
    setOrders(o);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    const r1 = await fetch(API + '/v1/items', { method:'POST', headers:{ 'Content-Type':'application/json', 'X-Device-Id':'rn-dev' }, body: JSON.stringify({ title, description: desc, category:'electronics', condition:'good', media:[], seller_id:'seller-demo' }) });
    const item = await r1.json();
    await fetch(API + '/v1/listings', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ item_id: item.id, title, description: desc, category:'electronics', price_cents: Number(price), seller_id:'seller-demo' }) });
    await load();
  };

  const buy = async (l: any) => {
    const o = await fetch(API + '/v1/orders', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ listing_id: l.id, payment_method_id:'pm_mock', buyer_id:'buyer-demo', seller_id:'seller-demo' }) }).then(r=>r.json());
    await fetch(API + '/v1/locker/reserve', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ order_id: o.id }) });
    await load();
  };

  const accept = async (o: any) => { await fetch(API + '/v1/orders/'+o.id+'/accept', { method:'POST' }); await load(); };
  const dispute = async (o: any) => { await fetch(API + '/v1/orders/'+o.id+'/dispute', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ reason:'not as described' }) }); await load(); };
  const inspection = async (o: any) => {
    await fetch(API + '/v1/evidence/inspection', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ order_id: o.id, video_url: 'https://example.com/demo-inspection.mp4' }) });
    await load();
  };

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Create a listing</Text>
      <TextInput value={title} onChangeText={setTitle} placeholder="Title" style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:8 }} />
      <TextInput value={desc} onChangeText={setDesc} placeholder="Description" style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:8 }} />
      <TextInput value={price} onChangeText={setPrice} placeholder="Price (cents)" keyboardType="numeric" style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:8 }} />
      <Pressable onPress={create} style={{ backgroundColor:'#111', padding:12, borderRadius:12 }}><Text style={{ color:'#fff', textAlign:'center', fontWeight:'700' }}>Create</Text></Pressable>

      <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '700' }}>Listings</Text>
      <FlatList data={listings} keyExtractor={(i)=>i.id} renderItem={({item}) => (
        <View style={{ borderWidth:1, borderColor:'#eee', borderRadius:12, padding:12, marginVertical:6 }}>
          <Text style={{ fontWeight:'700' }}>{item.title}</Text>
          <Text style={{ opacity:0.7 }}>{item.description}</Text>
          <Text>${(item.price_cents/100).toFixed(2)}</Text>
          <View style={{ flexDirection:'row', gap:8, marginTop:8 }}>
            <Pressable onPress={()=>buy(item)} style={{ backgroundColor:'#111', padding:10, borderRadius:10 }}>
              <Text style={{ color:'#fff' }}>Buy (demo)</Text>
            </Pressable>
          </View>
        </View>
      )} />

      <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '700' }}>Orders</Text>
      <FlatList data={orders} keyExtractor={(i)=>i.id} renderItem={({item}) => (
        <View style={{ borderWidth:1, borderColor:'#eee', borderRadius:12, padding:12, marginVertical:6 }}>
          <Text style={{ fontWeight:'700' }}>Order {item.id.slice(0,8)} — {item.status}</Text>
          <Text style={{ opacity:0.7, marginTop:4 }}>{item.accept_deadline ? 'Auto‑accept: ' + new Date(item.accept_deadline).toLocaleTimeString() : ''}</Text>
          <View style={{ flexDirection:'row', gap:8, marginTop:8 }}>
            <Pressable onPress={()=>inspection(item)} style={{ backgroundColor:'#555', padding:10, borderRadius:10 }}>
              <Text style={{ color:'#fff' }}>Inspection</Text>
            </Pressable>
            <Pressable onPress={()=>accept(item)} style={{ backgroundColor:'#0d8936', padding:10, borderRadius:10 }}>
              <Text style={{ color:'#fff' }}>Accept</Text>
            </Pressable>
            <Pressable onPress={()=>dispute(item)} style={{ backgroundColor:'#b00020', padding:10, borderRadius:10 }}>
              <Text style={{ color:'#fff' }}>Dispute</Text>
            </Pressable>
          </View>
        </View>
      )} />
    </View>
  );
}

function Body() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, padding: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: '700' }}>Don't get me beat up.{"\n"}Ditch the meetup.</Text>
        <Text style={{ marginTop: 8, opacity: 0.7 }}>Lockers + escrow + digital title. Atlanta pilot.</Text>
        <View style={{ height: 16 }} />
        {pk ? <SignInButton /> : <Text style={{ opacity:0.7 }}>Guest mode</Text>}
        <Listings />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function App() {
  return pk ? <ClerkProvider publishableKey={pk}><Body /></ClerkProvider> : <Body />;
}
