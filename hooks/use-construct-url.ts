import { env } from "@/lib/env";

export default function useConstructUrl(key: string): string {
  const url = `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${key}`;
  return url;
}
