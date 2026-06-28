import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getRoyaltySettings, saveSettings, RoyaltySettings } from "@/lib/settings";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');

    if (!session || !adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getRoyaltySettings();
    return NextResponse.json({ settings }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch royalty settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');

    if (!session || !adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data: RoyaltySettings = await req.json();

    await saveSettings({
      royalty: {
        platformCommission: Number(data.platformCommission),
        minPayoutThreshold: Number(data.minPayoutThreshold),
        payoutSchedule: data.payoutSchedule,
        autoApprovePayouts: Boolean(data.autoApprovePayouts)
      }
    });

    return NextResponse.json({ success: true, message: "Royalty settings saved" }, { status: 200 });
  } catch (error: any) {
    console.error("Update royalty settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
