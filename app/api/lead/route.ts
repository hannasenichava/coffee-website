
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type Attribution = {
  source?: string;
  campaign?: string;
  ad?: string;
  medium?: string;
  term?: string;
  click_id?: string;
  page?: string;
  landing_url?: string;
  referrer?: string;
};

type LeadBody = {
  name?: string;
  phone?: string;
  interest?: "subscription" | "one-off-order" | "question";
  comment?: string;
  attribution?: Attribution;
  source?: string;
  campaign?: string;
  ad?: string;
  medium?: string;
  term?: string;
  click_id?: string;
  page?: string;
  landing_url?: string;
  referrer?: string;
};

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Telegram is optional; saving the lead must still work without it.
  if (!token || !chatId) return;

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Telegram notification failed: ${response.status}`);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadBody;

    const name = body.name?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const interest = body.interest;
    const comment = body.comment?.trim() ?? "";
    const attribution = body.attribution ?? {};

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    if (
      !["subscription", "one-off-order", "question"].includes(
        interest ?? ""
      )
    ) {
      return NextResponse.json(
        { error: "Invalid interest" },
        { status: 400 }
      );
    }

    // Basic validation for a Belarusian phone number.
    const normalizedPhone = phone.replace(/[^\d+]/g, "");
    if (!/^\+?375\d{9}$/.test(normalizedPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid Belarusian phone number" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Prevent repeated submissions with the same phone within 10 minutes.
    const tenMinutesAgo = new Date(
      Date.now() - 10 * 60 * 1000
    ).toISOString();

    const { data: existingLead, error: duplicateError } = await supabase
      .from("leads")
      .select("id")
      .eq("phone", normalizedPhone)
      .gte("created_at", tenMinutesAgo)
      .limit(1)
      .maybeSingle();

    if (duplicateError) {
      console.error("Supabase duplicate check failed:", duplicateError);
      return NextResponse.json(
        { error: "Could not check existing submissions" },
        { status: 500 }
      );
    }

    if (existingLead) {
      return NextResponse.json(
        { error: "A request with this phone was already submitted recently" },
        { status: 409 }
      );
    }

    const lead = {
      name,
      phone: normalizedPhone,
      interest,
      comment,
      source: attribution.source ?? body.source ?? "",
      campaign: attribution.campaign ?? body.campaign ?? "",
      ad: attribution.ad ?? body.ad ?? "",
      medium: attribution.medium ?? body.medium ?? "",
      term: attribution.term ?? body.term ?? "",
      click_id: attribution.click_id ?? body.click_id ?? "",
      page: attribution.page ?? body.page ?? "",
      landing_url: attribution.landing_url ?? body.landing_url ?? "",
      referrer: attribution.referrer ?? body.referrer ?? "",
    };

    const { error: insertError } = await supabase
      .from("leads")
      .insert(lead);

    if (insertError) {
      console.error("Supabase insert failed:", insertError);
      return NextResponse.json(
        { error: "Could not save your request" },
        { status: 500 }
      );
    }

    const telegramMessage = [
      "☕ New Quarta website request",
      `Name: ${name}`,
      `Phone: ${normalizedPhone}`,
      `Interest: ${interest}`,
      `Comment: ${comment || "—"}`,
      `Source: ${lead.source || "—"}`,
    ].join("\n");

    try {
      await sendTelegramNotification(telegramMessage);
    } catch (telegramError) {
      // The lead is already saved; a Telegram failure should not lose it.
      console.error("Telegram notification error:", telegramError);
    }

    return NextResponse.json(
      { success: true, message: "Request submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
