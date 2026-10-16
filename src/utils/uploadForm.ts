import { getToken } from "@/services/api";
import { prepareFile, PickedLike } from "@/utils/cleanFile";

// Sends a multipart form (text fields + files). Phones differ in which way of attaching a file their
// fetch accepts, so this tries four ways in turn and stops at the first one the phone lets through.
// It logs each attempt in Metro as "[upload] ...". Once we know which way works, the others can go.

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://careporium-backend.onrender.com";

export type FileField = { field: string; file: PickedLike; fallbackName: string };

type Strategy = { label: string; useExpoFetch: boolean; kind: "file" | "uri" | "blob" };
const STRATEGIES: Strategy[] = [
  { label: "expo fetch + File", useExpoFetch: true, kind: "file" },
  { label: "global fetch + File", useExpoFetch: false, kind: "file" },
  { label: "global fetch + uri", useExpoFetch: false, kind: "uri" },
  { label: "expo fetch + blob", useExpoFetch: true, kind: "blob" },
];

function getExpoFetch(): typeof fetch | null {
  try {
    return require("expo/fetch").fetch as typeof fetch;
  } catch {
    return null;
  }
}

export async function uploadForm(
  path: string,
  method: "POST" | "PUT",
  texts: Record<string, string>,
  files: FileField[],
  auth = true
): Promise<any> {
  const prepared = [];
  for (const f of files) prepared.push({ field: f.field, p: await prepareFile(f.file, f.fallbackName) });

  const headers: Record<string, string> = { Accept: "application/json" };
  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const expoFetch = getExpoFetch();
  let lastError = "";

  for (const s of STRATEGIES) {
    const doFetch = s.useExpoFetch ? expoFetch : fetch;
    if (!doFetch) continue;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 120000);
    try {
      const form = new FormData();
      Object.entries(texts).forEach(([k, v]) => form.append(k, v));
      for (const { field, p } of prepared) {
        if (s.kind === "file") {
          form.append(field, p.part);
        } else if (s.kind === "uri") {
          form.append(field, { uri: p.uri, name: p.name, type: p.type } as any);
        } else {
          const blob = await (await fetch(p.uri)).blob();
          (form as any).append(field, blob, p.name);
        }
      }
      const started = Date.now();
      const res = await doFetch(`${BASE_URL}${path}`, { method, headers, body: form as any, signal: controller.signal as any });
      let json: any = null;
      try {
        json = await res.json();
      } catch {}
      if (__DEV__) console.log("[upload]", s.label, "->", res.status, "in", Date.now() - started, "ms", JSON.stringify(json)?.slice(0, 200));
      if (!res.ok) throw new ServerReply(json?.message ?? `The server refused the upload (error ${res.status}).`);
      return json;
    } catch (e: any) {
      if (e instanceof ServerReply) throw new Error(e.message); // the server answered: stop trying
      lastError = `${e?.name ?? "Error"}: ${e?.message ?? e}`;
      if (__DEV__) console.log("[upload]", s.label, "failed on the phone:", lastError);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error(`This phone couldn't send the files (${lastError}).`);
}

class ServerReply extends Error {}