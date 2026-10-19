"use client";

import { FormEvent, useState } from "react";
import "./LeadForm.css";

type LeadInterest = "subscription" | "one-off-order" | "question";

type FormState = "idle" | "sending" | "success" | "error";

function getAttribution() {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("utm_source") || "",
    campaign: params.get("utm_campaign") || "",
    ad: params.get("utm_content") || params.get("ad_id") || "",
    medium: params.get("utm_medium") || "",
    term: params.get("utm_term") || "",
    clickId: params.get("yclid") || params.get("gclid") || params.get("fbclid") || "",
    page: window.location.pathname,
    landingUrl: window.location.href,
    referrer: document.referrer || "direct",
  };
}

export default function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState<LeadInterest>("one-off-order");
  const [comment, setComment] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          interest,
          comment: comment.trim(),
          attribution: getAttribution(),
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setState("error");
        setMessage(result.error || "Не удалось отправить заявку. Проверьте данные и попробуйте ещё раз.");
        return;
      }

      setState("success");
      setMessage("Спасибо! Заявка принята. Мы скоро свяжемся с вами.");
      setName("");
      setPhone("");
      setInterest("one-off-order");
      setComment("");
    } catch {
      setState("error");
      setMessage("Не удалось связаться с сервером. Проверьте интернет и нажмите «Отправить» ещё раз.");
    }
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <label className="lead-form__field">
        <span>Ваше имя *</span>
        <input
          autoComplete="name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={100}
          
        />
      </label>

      <label className="lead-form__field">
        <span>Телефон *</span>
        <input
          autoComplete="tel"
          inputMode="tel"
          name="phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          maxLength={30}
          required
          placeholder="+375 29 123-45-67"
          aria-describedby="lead-phone-help"
        />
       
      </label>

      <label className="lead-form__field">
        <span>Что вас интересует? *</span>
        <select name="interest" value={interest} onChange={(event) => setInterest(event.target.value as LeadInterest)} required>
          <option value="subscription">Подписка на кофе</option>
          <option value="one-off-order">Разовый заказ</option>
          <option value="question">Задать вопрос</option>
        </select>
      </label>

      <label className="lead-form__field">
        <span>Комментарий</span>
        <textarea
          name="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="Любимые вкусы, удобное время для звонка…"
        />
      </label>
 
      <button className="lead-form__submit" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Отправляем…" : "Отправить заявку"}
      </button>

      {message && (
        <p className={`lead-form__message lead-form__message--${state}`} role="status" aria-live="polite">
          {message}
        </p>
      )}
      <p className="lead-form__privacy">Нажимая кнопку, вы соглашаетесь на обработку данных для ответа на заявку.</p>
    </form>
  );
}
