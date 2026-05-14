# IP Routing Visualization — Design Spec

**Date:** 2026-05-14  
**Status:** Approved

## Summary

Add an `/networks/ip-routing` page that teaches hop-by-hop packet routing through step-by-step interactive animation. Two tabs — Simple and Real World — share the same UI shell but use different topology data.

## Architecture

- **Route:** `src/app/(topics)/networks/ip-routing/page.tsx`
- **Component:** `src/components/networks/IPRouting.tsx`
- **Pattern:** Mirrors `TCPHandshakeVisualizer.tsx` — static `STEPS` data array, `stepIndex` state, prev/next buttons
- No Three.js; pure CSS/Tailwind animation for packet movement

## Tabs

### Simple Tab
```
PC → Router A → Router B → Server
```
4 nodes, 3 hops. Each step explains which routing table entry matched and why.

Steps:
1. Initial state — PC has a packet destined for 10.0.2.5
2. PC → Router A — default route (0.0.0.0/0)
3. Router A → Router B — specific route (10.0.2.0/24 matched over 10.0.0.0/8)
4. Router B → Server — directly connected (10.0.2.0/24)
5. Server receives packet

### Real World Tab
```
PC → Home Router → ISP Router → Backbone → CDN Edge → Server
```
5 nodes, 4 hops. Each step adds real-world context (NAT, BGP AS numbers, anycast).

Steps:
1. Initial state — PC sends packet to 104.21.0.1
2. PC → Home Router — default route; NAT replaces private IP with public IP
3. Home Router → ISP Router — ISP's upstream route
4. ISP → Backbone — BGP peering, AS3356
5. Backbone → CDN Edge — anycast routing finds nearest PoP
6. CDN Edge → Server — origin pull

## Per-Step UI Layout

```
┌─────────────────────────────────────────┐
│  [Node] ──●──→ [Node] ──── [Node]       │  ← topology bar, packet animates
├─────────────────────────────────────────┤
│  Routing Table (current router)         │  ← table with matched row highlighted
│  Destination   | Next Hop  | Interface  │
│  10.0.2.0/24  | 10.0.1.2  | eth1  ← HL │
│  0.0.0.0/0    | 10.0.0.1  | eth0       │
├─────────────────────────────────────────┤
│  Headline (bold)                        │  ← KO/EN
│  Description text                       │
├─────────────────────────────────────────┤
│           [← Prev]  [Next →]            │
└─────────────────────────────────────────┘
```

## Key CS Concepts Conveyed

- Routing table lookup: longest prefix match wins
- Default route (0.0.0.0/0) as fallback
- Hop-by-hop: each router only knows the next hop, not the full path
- Real World: NAT, BGP, anycast (brief mention, not deep-dive)

## Bilingual

All step text has `headlineKo/headlineEn` and `descKo/descEn` fields, same as existing components. Reads from `useLanguage()` context.

## Files to Create/Modify

| Action | File |
|--------|------|
| Create | `src/app/(topics)/networks/ip-routing/page.tsx` |
| Create | `src/components/networks/IPRouting.tsx` |
| Modify | `src/app/(topics)/networks/page.tsx` — set `href: "/networks/ip-routing"` for IP Routing entry |
