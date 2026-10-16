// The server validates location.address, location.city and location.country on every facility save,
// but it isn't clear how it wants them in a multipart form. These are the shapes to try, in order.
// tryLocations() sends the first one, and moves on to the next only if the server still complains
// about the location.

export function locationVariants(address: string, city: string, state: string, country: string): Record<string, string>[] {
  const a = address.trim();
  const c = city.trim();
  const s = state.trim() || c;
  const k = country.trim() || "Nigeria";
  const flat = { locationAddress: a, locationCity: c, locationState: s, locationCountry: k };
  return [
    {
      ...flat,
      "location[address]": a,
      "location[city]": c,
      "location[state]": s,
      "location[country]": k,
    },
    { ...flat, location: JSON.stringify({ address: a, city: c, state: s, country: k }) },
    {
      ...flat,
      "location.address": a,
      "location.city": c,
      "location.state": s,
      "location.country": k,
    },
  ];
}

export async function tryLocations<T>(
  send: (locationTexts: Record<string, string>) => Promise<T>,
  address: string,
  city: string,
  state: string,
  country: string
): Promise<T> {
  const variants = locationVariants(address, city, state, country);
  let last: any;
  for (let i = 0; i < variants.length; i++) {
    try {
      const result = await send(variants[i]);
      if (__DEV__) console.log("[location] accepted with variant", i);
      return result;
    } catch (e: any) {
      last = e;
      if (__DEV__) console.log("[location] variant", i, "failed:", e?.message);
      if (!/location/i.test(String(e?.message ?? ""))) throw e;
    }
  }
  throw last;
}