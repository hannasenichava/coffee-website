import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";



type Interest = "subscription" | "one-off-order" | "question";
type Attribution = {
  source?: unknown;
  campaign?: unknown;
  ad?: unknown;
  medium?: unknown;
  term?: unknown;
  clickId?: unknown;
  page?: unknown;
  landingUrl?: unknown;
  referrer?: unknown;
};

type LeadBody = {
  name?: unknown;
  phone?: unknown;
  interest?: unknown;
  comment?: unknown;
  attribution?: Attribution;
};

const VALID_INTERESTS = new Set<Interest>(["subscription", "one-off-order", "question"]);
const TEN_MINUTES_MS = 10 * 60 * 1000;
async function sendTelegramNotification(lead: {
  name: string;
  phone: string;
  interest: string;
  comment: string;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram is not configured.");
    return;
  }

  const escapeHtml = (value: string) =>
    value.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const interestLabels: Record<string, string> = {
    subscription: "Подписка на кофе",
    "one-off-order": "Разовый заказ",
    question: "Вопрос",
  };

  const message = [
    "☕ <b>Новая заявка — Кварта</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Телефон:</b> ${escapeHtml(lead.phone)}`,
    `<b>Интерес:</b> ${escapeHtml(interestLabels[lead.interest] ?? lead.interest)}`,
    `<b>Комментарий:</b> ${escapeHtml(lead.comment || "Не указан")}`,
  ].join("\n");

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      console.error("Telegram notification failed:", await response.text());
    }
  } catch (error) {
    console.error("Could not send Telegram notification:", error);
  }
}

function getDatabase() {
  const directory = path.join(process.cwd(), "data");
  mkdirSync(directory, { recursive: true });
  const file = path.join(directory, "leads.sqlite");
  const globalForDb = globalThis as typeof globalThis & { quartaLeadDb?: Database.Database };

  if (!globalForDb.quartaLeadDb) {
    const db = new Database(file);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        interest TEXT NOT NULL,
        comment TEXT NOT NULL DEFAULT '',
        source TEXT NOT NULL DEFAULT '',
        campaign TEXT NOT NULL DEFAULT '',
        ad TEXT NOT NULL DEFAULT '',
        medium TEXT NOT NULL DEFAULT '',
        term TEXT NOT NULL DEFAULT '',
        click_id TEXT NOT NULL DEFAULT '',
        page TEXT NOT NULL DEFAULT '',
        landing_url TEXT NOT NULL DEFAULT '',
        referrer TEXT NOT NULL DEFAULT '',
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_leads_phone_created_at ON leads(phone, created_at);
    `);
    globalForDb.quartaLeadDb = db;
  }
  return globalForDb.quartaLeadDb;
}

function normalizeBelarusPhone(value: string): string | null {
  let digits = value.replace(/\D/g, "");
  // Accept international +375XXXXXXXXX, local 80XXXXXXXXX, or national XXXXXXXXX.
  if (digits.startsWith("80") && digits.length === 11) digits = `375${digits.slice(2)}`;
  else if (digits.length === 9) digits = `375${digits}`;
  return /^375\d{9}$/.test(digits) ? `+${digits}` : null;
}

function safeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  let body: LeadBody;

  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Некорректный формат данных" },
      { status: 400 }
    );
  }

  const name = safeText(body.name, 100);
  const rawPhone = safeText(body.phone, 30);
  const phone = normalizeBelarusPhone(rawPhone);
  const interest = body.interest;
  const comment = safeText(body.comment, 2000);
  const attribution = body.attribution ?? {};

  if (name.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Введите имя (не менее 2 символов)." },
      { status: 400 }
    );
  }

  if (!phone) {
    return NextResponse.json(
      {
        ok: false,
        error: "Введите корректный белорусский номер, например +375 29 123-45-67.",
      },
      { status: 400 }
    );
  }

  if (
    typeof interest !== "string" ||
    !VALID_INTERESTS.has(interest as Interest)
  ) {
    return NextResponse.json(
      { ok: false, error: "Выберите, что вас интересует." },
      { status: 400 }
    );
  }

  const db = getDatabase();
  const now = Date.now();
  const cutoff = now - TEN_MINUTES_MS;

  try {
    const saveLead = db.transaction(() => {
      const duplicate = db
        .prepare(
          "SELECT id FROM leads WHERE phone = ? AND created_at >= ? LIMIT 1"
        )
        .get(phone, cutoff);

      if (duplicate) return false;

      db.prepare(`
        INSERT INTO leads (
          name, phone, interest, comment, source, campaign, ad, medium, term,
          click_id, page, landing_url, referrer, created_at
        ) VALUES (
          @name, @phone, @interest, @comment, @source, @campaign, @ad, @medium, @term,
          @click_id, @page, @landing_url, @referrer, @created_at
        )
      `).run({
        name,
        phone,
        interest,
        comment,
        source: safeText(attribution.source, 200),
        campaign: safeText(attribution.campaign, 200),
        ad: safeText(attribution.ad, 200),
        medium: safeText(attribution.medium, 200),
        term: safeText(attribution.term, 200),
        click_id: safeText(attribution.clickId, 300),
        page: safeText(attribution.page, 500),
        landing_url: safeText(attribution.landingUrl, 2000),
        referrer: safeText(attribution.referrer, 2000),
        created_at: now,
      });

      return true;
    });

    const saved = saveLead.immediate();

    if (!saved) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Заявка с этим номером уже отправлена. Подождите 10 минут — мы свяжемся с вами.",
        },
        { status: 409 }
      );
    }

    // Сначала сохраняем заявку, затем отправляем уведомление в Telegram.
    await sendTelegramNotification({
      name,
      phone,
      interest,
      comment,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to save Quarta lead:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          "Не удалось сохранить заявку на сервере. Попробуйте ещё раз чуть позже.",
      },
      { status: 500 }
    );
  }
}
