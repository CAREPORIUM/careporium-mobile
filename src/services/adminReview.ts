import { api } from "@/services/api";
import { AdminKind } from "@/types/admin";
import { log, short } from "@/services/adminMap";

// Approve or reject one document. The request body isn't in the Swagger
// summary, so a few likely shapes are tried and the first one the server
// accepts wins. Fix the first entry once the real body is confirmed.
export async function reviewDocument(
  kind: AdminKind,
  id: string,
  field: string,
  status: "verified" | "rejected",
  comment: string
): Promise<void> {
  const folder = kind === "worker" ? "workers" : "facilities";
  const path = `/api/admin/v1/${folder}/${id}/documents`;
  const variants: Record<string, unknown>[] = [
    { documentType: field, verificationStatus: status, verificationComment: comment },
    { documentType: field, status, comment },
    { document: field, verificationStatus: status, verificationComment: comment },
  ];
  let lastError: any;
  for (const body of variants) {
    try {
      const res = await api(path, { method: "PATCH", body });
      log("review ok", short(body), short(res, 200));
      return;
    } catch (e: any) {
      lastError = e;
      log("review failed", e?.status, e?.message, short(body));
      // 401, 403, 404 and 5xx are not body problems, so stop trying.
      if (e?.status && e.status !== 400 && e.status !== 422) break;
    }
  }
  throw lastError;
}