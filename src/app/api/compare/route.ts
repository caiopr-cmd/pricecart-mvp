import { NextResponse } from "next/server";

type StoreKey = "maxi" | "metro" | "provigo" | "superc";

type IncomingItem = {
  query: string;
  parsed?: { qty?: number; unit?: string };
};

type CatalogProduct = {
  id: string;
  name: string;
  keywords: string[];
  unit: string; // unit for unitPrice display, e.g., kg, L, each
  prices: Record<StoreKey, number>; // unit price
};

const CATALOG: CatalogProduct[] = [
  {
    id: "p_chicken_breast",
    name: "Chicken Breast (Boneless Skinless)",
    keywords: ["chicken", "breast", "boneless", "skinless"],
    unit: "kg",
    prices: { maxi: 13.99, metro: 16.50, provigo: 15.99, superc: 14.99 },
  },
  {
    id: "p_eggs_12",
    name: "Eggs (12)",
    keywords: ["eggs", "12", "dozen"],
    unit: "each",
    prices: { maxi: 4.79, metro: 5.29, provigo: 5.49, superc: 4.49 },
  },
  {
    id: "p_greek_yogurt",
    name: "Greek Yogurt (Plain)",
    keywords: ["greek", "yogurt", "yoghurt"],
    unit: "each",
    prices: { maxi: 4.29, metro: 3.99, provigo: 4.49, superc: 4.19 },
  },
  {
    id: "p_bananas",
    name: "Bananas",
    keywords: ["banana", "bananas"],
    unit: "lb",
    prices: { maxi: 1.39, metro: 1.59, provigo: 1.69, superc: 1.29 },
  },
  {
    id: "p_milk_2l",
    name: "Milk (2L)",
    keywords: ["milk", "2l", "2 l", "lactose"],
    unit: "each",
    prices: { maxi: 5.49, metro: 5.29, provigo: 5.69, superc: 5.39 },
  },
  {
    id: "p_bread",
    name: "Bread (Loaf)",
    keywords: ["bread", "loaf"],
    unit: "each",
    prices: { maxi: 3.29, metro: 3.99, provigo: 4.29, superc: 3.49 },
  },
  {
    id: "p_lettuce",
    name: "Lettuce (Romaine)",
    keywords: ["lettuce", "romaine", "salad"],
    unit: "each",
    prices: { maxi: 2.79, metro: 3.49, provigo: 3.29, superc: 2.99 },
  },
];

function norm(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreMatch(query: string, product: CatalogProduct) {
  const q = norm(query);
  const tokens = q.split(" ").filter(Boolean);
  if (!tokens.length) return 0;

  let hit = 0;
  for (const t of tokens) {
    if (product.keywords.some((k) => k.includes(t) || t.includes(k))) hit += 1;
  }
  // Simple confidence: token hit ratio, with a small boost for direct name overlap
  const nameBoost = norm(product.name).includes(tokens[0]) ? 0.1 : 0;
  return Math.min(1, hit / Math.max(2, tokens.length) + nameBoost);
}

function pickBestProduct(query: string) {
  let best: { p: CatalogProduct; score: number } | null = null;
  for (const p of CATALOG) {
    const s = scoreMatch(query, p);
    if (!best || s > best.score) best = { p, score: s };
  }
  return best;
}

function bestAndSecond(prices: Record<StoreKey, number>) {
  const sorted = (Object.entries(prices) as [StoreKey, number][])
    .sort((a, b) => a[1] - b[1]);
  return { best: sorted[0], second: sorted[1] };
}

type PricedItem = {
  bestStore?: StoreKey;
  match?: { name?: string };
};

function buildPlan(items: PricedItem[], maxStores: number) {
  const plan: Record<StoreKey, string[]> = { maxi: [], metro: [], provigo: [], superc: [] };

  for (const it of items) {
    const s = it.bestStore;
    const name = it.match?.name;
    if (!s || !name) continue;
    plan[s].push(name);
  }

  const used = (Object.keys(plan) as StoreKey[]).filter((s) => plan[s].length);
  
  // If within limit, done
  if (used.length <= maxStores) return { plan, used };

  // Naive compression: keep the cheapest single store overall for overflow items.
  // Replace later with your real optimizer (minimize delta while reducing store count).
  return { plan, used };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const incoming: IncomingItem[] = Array.isArray(body.items) ? body.items : [];
  const maxStores = Math.min(4, Math.max(1, Number(body.maxStores || 2)));
  const strategy = body.strategy === "min_stores" ? "min_stores" : "min_total";

  // TODO: Replace mock catalog with DB queries:
  // 1) match incoming.query -> canonical product(s) (fuzzy / embeddings / trigram)
  // 2) fetch latest unit_price per store (and source_url, last_seen_at)
  // 3) compute best store + savings + cart optimization

  const items = incoming.map((it) => {
    const pick = pickBestProduct(it.query);
    const confidence = pick?.score ?? 0;
    const needsReview = confidence < 0.45;

    const prices = pick ? pick.p.prices : ({ } as any);

    const { best, second } = pick ? bestAndSecond(prices) : { best: null, second: null };

    const bestStore = best ? best[0] : undefined;
    const bestUnitPrice = best ? best[1] : undefined;
    const savingsVsNext = best && second ? (second[1] - best[1]) : undefined;

    const mappedPrices: any = {};
    if (pick) {
      (Object.keys(pick.p.prices) as StoreKey[]).forEach((s) => {
        mappedPrices[s] = {
          price: pick.p.prices[s],
          unit: pick.p.unit,
          unitPrice: pick.p.prices[s],
          url: undefined,
        };
      });
    }

    return {
      query: it.query,
      parsed: it.parsed,
      match: pick
        ? { productId: pick.p.id, name: pick.p.name, confidence, needsReview }
        : undefined,
      prices: mappedPrices,
      bestStore,
      bestUnitPrice,
      savingsVsNext,
    };
  });

  // Totals per store
  const stores: StoreKey[] = ["maxi", "metro", "provigo", "superc"];
  const perStoreTotals: Record<StoreKey, number> = { maxi: 0, metro: 0, provigo: 0, superc: 0 };

  for (const s of stores) {
    let total = 0;
    for (const it of items) {
      const p = it.prices?.[s];
      if (p?.unitPrice != null) total += p.unitPrice;
    }
    perStoreTotals[s] = round2(total);
  }

  const bestSingleStore = stores
    .map((s) => ({ store: s, total: perStoreTotals[s] }))
    .sort((a, b) => a.total - b.total)[0];

  const worstSingleStore = stores
    .map((s) => ({ store: s, total: perStoreTotals[s] }))
    .sort((a, b) => b.total - a.total)[0];

  // Mixed total (best per item)
  let mixedTotal = 0;
  for (const it of items) {
    if (it.bestUnitPrice != null) mixedTotal += it.bestUnitPrice;
  }
  mixedTotal = round2(mixedTotal);

  const { plan, used } = buildPlan(items, maxStores);

  // If user chose "min_stores", we bias toward best single store when maxStores=1
  const bestMixedTotal = (strategy === "min_stores" && maxStores === 1)
    ? bestSingleStore.total
    : mixedTotal;

  const bestMixedStoresUsed = (strategy === "min_stores" && maxStores === 1)
    ? [bestSingleStore.store]
    : used.slice(0, maxStores);

  const response = {
    lastUpdated: new Date().toISOString(),
    items,
    cart: {
      perStoreTotals,
      bestSingleStore,
      bestMixed: {
        total: bestMixedTotal,
        storesUsed: bestMixedStoresUsed,
        plan,
      },
      estimatedSavingsVsWorst: round2(worstSingleStore.total - bestMixedTotal),
    },
  };

  return NextResponse.json(response);
}

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
