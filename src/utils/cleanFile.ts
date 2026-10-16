// Prepares a picked file for upload. Two problems this solves on iPhone:
//  1. File paths with spaces ("Freelancer Canvas Template 2.pdf") are copied to a plain-named file.
//  2. Newer Expo's fetch rejects the old { uri, name, type } form in FormData instantly, so on newer
//     expo-file-system we attach a real File object instead.
// Returns { uri, name, type, part }. Append `part` to your FormData.

export type PickedLike = { uri: string; name?: string; mimeType?: string; type?: string };
// part is what goes into FormData: a File object on newer Expo, or { uri, name, type } on older ones.
export type CleanFile = { uri: string; name: string; type: string; part: any };

const MIME: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  heic: "image/heic",
};

export async function prepareFile(f: PickedLike, fallbackName: string): Promise<CleanFile> {
  const rawName = f.name || fallbackName;
  const dot = rawName.lastIndexOf(".");
  const ext = (dot >= 0 ? rawName.slice(dot + 1) : "").toLowerCase() || "jpg";
  const base = (dot >= 0 ? rawName.slice(0, dot) : rawName).replace(/[^A-Za-z0-9_-]+/g, "_").slice(0, 40) || "document";
  const name = `${base}.${ext}`;
  const type = f.mimeType || f.type || MIME[ext] || "application/octet-stream";

  let uri = f.uri;
  let part: any = { uri, name, type };
  try {
    const FS: any = require("expo-file-system");
    const dest = `${Date.now()}-${Math.floor(Math.random() * 1000000)}-${name}`;
    if (FS.File && FS.Paths) {
      // newer expo-file-system
      const target = new FS.File(FS.Paths.cache, dest);
      new FS.File(f.uri).copy(target);
      uri = target.uri;
      part = target;
    } else if (FS.copyAsync && FS.cacheDirectory) {
      // older expo-file-system
      uri = FS.cacheDirectory + dest;
      await FS.copyAsync({ from: f.uri, to: uri });
      part = { uri, name, type };
    }
  } catch (e: any) {
    if (__DEV__) console.log("[upload] couldn't copy the file, sending the original:", e?.message);
  }
  if (__DEV__) console.log("[upload] file", name, type, uri);
  return { uri, name, type, part };
}