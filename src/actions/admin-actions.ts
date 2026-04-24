"use server";

import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

async function checkAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized");
  }
}

async function uploadFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ensure upload directory exists
  const uploadDir = path.join(process.cwd(), "public/uploads/ads");
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  return `/uploads/ads/${fileName}`;
}

export async function updateAdSettings(formData: FormData) {
  await checkAdmin();

  const existing = await db.query.siteSettings.findFirst();

  // Helper to get image URL (either new upload or keep existing)
  const getImageUrl = async (fileName: string, dbField: string) => {
    const file = formData.get(fileName) as File;
    const uploadedUrl = await uploadFile(file);
    return uploadedUrl || (existing ? (existing as any)[dbField] : null);
  };

  const data: any = {
    adHeadline: formData.get("adHeadline") as string,
    adTargetUrl: formData.get("adTargetUrl") as string,
    adBottom1Target: formData.get("adBottom1Target") as string,
    adBottom2Target: formData.get("adBottom2Target") as string,
    adBottom3Target: formData.get("adBottom3Target") as string,
    adSideLeftTarget: formData.get("adSideLeftTarget") as string,
    adSideRightTarget: formData.get("adSideRightTarget") as string,
    updatedAt: new Date(),
  };

  // Process uploads
  data.adBannerUrl = await getImageUrl("adBannerFile", "adBannerUrl");
  data.adSideLeftUrl = await getImageUrl("adSideLeftFile", "adSideLeftUrl");
  data.adSideRightUrl = await getImageUrl("adSideRightFile", "adSideRightUrl");
  data.adBottom1Url = await getImageUrl("adBottom1File", "adBottom1Url");
  data.adBottom2Url = await getImageUrl("adBottom2File", "adBottom2Url");
  data.adBottom3Url = await getImageUrl("adBottom3File", "adBottom3Url");

  if (existing) {
    await db.update(siteSettings)
      .set(data)
      .where(eq(siteSettings.id, existing.id));
  } else {
    await db.insert(siteSettings).values(data);
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard/admin/ads");
  revalidatePath("/[code]", "page");
}
