"use server";

export async function verifyInviteCode(code: string) {
  const adminCode = process.env.ADMIN_INVITE_CODE;
  
  if (!adminCode) {
    console.warn("ADMIN_INVITE_CODE is not set in .env.local. Allowing all signups for now.");
    return { success: true };
  }

  if (code !== adminCode) {
    return { error: "Invalid Invite Code" };
  }

  return { success: true };
}
