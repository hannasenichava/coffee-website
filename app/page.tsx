import LeadForm from "@/components/LeadForm";

const coffees = [
  {
    name: "Эфиопия · Иргачефф",
    notes: "Бергамот, белые цветы, цитрус",
    roast: "Светлая обжарка",
    price: 32,
    origin: "ETHIOPIA",
    number: "01",
    image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=85",
    className: "ethiopia",
  },
  {
    name: "Колумбия · Уила",
    notes: "Карамель, красное яблоко",
    roast: "Сбалансированный вкус",
    price: 29,
    origin: "COLOMBIA",
    number: "02",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85",
    className: "colombia",
  },
  {
    name: "Бразилия · Серрадо",
    notes: "Тёмный шоколад, фундук",
    roast: "Для эспрессо",
    price: 26,
    origin: "BRAZIL",
    number: "03",
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1000&q=85",
    className: "brazil",
  },
];

export default function Home() {
  return (
    <main>
      <header className="header">
        <a className="logo" href="#top" aria-label="Кварта — главная">
          кварта<span>®</span>
        </a>

        <nav aria-label="Основная навигация">
          <a href="#coffee">Наш кофе</a>
          <a href="#story">Наша история</a>
          <a href="#delivery">Подписка</a>
        </nav>

        <a className="header-cta" href="#order">
          Найти свой кофе <span>↗</span>
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            МИНСК · СПЕЦИАЛЬНАЯ ОБЖАРКА
          </p>

          <h1>
            Момент,
            <br />
            который
            <br />
            <em>твой.</em>
          </h1>

          <p className="intro">
            Кофе, созданный не на бегу. Отбираем зёрна и
            обжариваем небольшими партиями, чтобы в твоей чашке было больше,
            чем просто кофе.
          </p>

          <div className="hero-actions">
            <a className="button" href="#coffee">
              Открыть коллекцию <span>↗</span>
            </a>
            <span className="hero-note">Свежая обжарка каждую неделю</span>
          </div>

          
        </div>

        <div className="hero-visual">
          <img
            className="hero-photo"
            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1800&q=90"
            alt="Свежеприготовленный specialty coffee в мягком утреннем свете"
            fetchPriority="high"
          />
          <div className="hero-photo-shade" />

          <div className="hero-stamp">
            <span>К</span>
            <small>КУЛЬТУРА<br />КОФЕ</small>
          </div>

          <div className="hero-photo-caption">
            <span>01 — DAILY RITUAL</span>
            <span>EST. MINSK · 2019</span>
          </div>

          <div className="hero-side-note">COFFEE, WITH INTENTION</div>
        </div>

        <div className="hero-index">
          <span>01</span>
          <span className="hero-index-line" />
          <span>03</span>
        </div>
      </section>

      <section className="ticker" aria-label="Наш подход">
        <div className="ticker-track">
          {Array.from({ length: 2 }).map((_, index) => (
            <div className="ticker-group" key={index} aria-hidden={index === 1}>
              <span>МАЛЕНЬКИЕ ПАРТИИ</span>
              <span className="ticker-star">✳</span>
              <span>БОЛЬШОЙ ВКУС</span>
              <span className="ticker-star">✳</span>
              <span>СВЕЖАЯ ОБЖАРКА</span>
              <span className="ticker-star">✳</span>
              <span>СВОЙ РИТМ</span>
              <span className="ticker-star">✳</span>
            </div>
          ))}
        </div>
      </section>

      <section className="coffee-section" id="coffee">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / КОЛЛЕКЦИЯ</p>
            <h2>
              Три характера.
              <br />
              <em>Один ритуал.</em>
            </h2>
          </div>

          <div className="section-heading-note">
            <span className="heading-note-mark">↘</span>
            <p>
              Выбирай не по правилам.
              <br />
              Выбирай по ощущениям.
            </p>
          </div>
        </div>

        <div className="products">
          {coffees.map((coffee) => (
            <article className="product" key={coffee.name}>
              <a
                className={`product-image ${coffee.className}`}
                href="#order"
                aria-label={`Заказать кофе ${coffee.name}`}
              >
                <img src={coffee.image} alt={`${coffee.name} — specialty coffee`} loading="lazy" />
                <span className="product-index">{coffee.number} / 03</span>
                <span className="product-origin">{coffee.origin}</span>
                <span className="product-arrow" aria-hidden="true">↗</span>
              </a>

              <div className="product-info">
                <p className="product-roast">{coffee.roast}</p>
                <h3>{coffee.name}</h3>
                <p className="product-notes">{coffee.notes}</p>

                <div className="product-bottom">
                  <div>
                    <strong>{coffee.price}</strong>
                    <span className="price-currency"> BYN</span>
                    <span className="price-weight"> / 250 г</span>
                  </div>
                  <a href="#order" aria-label={`Заказать ${coffee.name}`}>
                    Выбрать <span>↗</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="collection-footer">
          <span>СВЕЖАЯ ОБЖАРКА · НЕБОЛЬШИЕ ПАРТИИ</span>
          <span>СДЕЛАНО В МИНСКЕ, С ЗАБОТОЙ О ВКУСЕ</span>
        </div>
      </section>

      <section className="subscription" id="delivery">
        <div className="subscription-image">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85"
            alt="Кофе и утренний ритуал"
            loading="lazy"
          />
          <span className="subscription-image-label">YOUR MONTHLY RITUAL</span>
        </div>

        <div className="subscription-copy">
          <p className="eyebrow eyebrow-light">02 / ПОДПИСКА</p>
          <h2>
            Пусть хороший
            <br />
            кофе <em>будет.</em>
          </h2>
          <p className="subscription-description">
            Два разных сорта каждый месяц. Новые вкусы, любимые ритуалы
            и никаких внезапно закончившихся зёрен.
          </p>

          <div className="subscription-details">
            <div>
              <span>В КОРОБКЕ</span>
              <strong>2 × 250 г</strong>
            </div>
            <div>
              <span>ДОСТАВКА</span>
              <strong>Включена</strong>
            </div>
          </div>

          <div className="subscription-bottom">
            <div className="subscription-price">
              <strong>54</strong>
              <span>BYN / месяц</span>
            </div>
            <a className="button button-light" href="#order">
              Выбрать подписку <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="story" id="story">
        <div className="story-top">
          <p className="eyebrow">03 / ЗА БРЕНДОМ</p>
          <span className="story-number">2019 — НАШЕ ВРЕМЯ</span>
        </div>

        <div className="story-grid">
          <h2>
            Всё началось
            <br />
            с любви
            <br />
            <em>к деталям.</em>
          </h2>

          <div className="story-copy">
            <p className="story-lead">Мы — Аня и Дима.</p>
            <p>
              Когда-то мы работали бариста и постоянно искали тот самый вкус.
              В 2019 году начали обжаривать сами — по 5 кг за раз, внимательно
              и без спешки.
            </p>
            <p>
              Для нас хороший кофе — не сложные слова на упаковке. Это
              удовольствие, которое хочется повторить завтра.
            </p>
            <a className="text-link" href="#order">
              Попробовать нашу обжарку <span>↗</span>
            </a>
          </div>
        </div>

        <div className="story-image">
          <img
            src="https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=1800&q=85"
            alt="Кофейная культура и работа с кофе"
            loading="lazy"
          />
          <div className="story-image-overlay">
            <span>НЕ СПЕША.</span>
            <span>СО ВКУСОМ.</span>
            <span>С ЛЮБОВЬЮ К ДЕЛУ.</span>
          </div>
        </div>
      </section>

      <section className="order-section" id="order">
        <div className="order-heading">
          <p className="eyebrow">ТВОЙ СЛЕДУЮЩИЙ ЛЮБИМЫЙ КОФЕ</p>
          <h2>
            Начнём с <em>чашки?</em>
          </h2>
          <p>
            Расскажи, что тебе нравится. Поможем подобрать кофе или оформить
            подписку.
          </p>
        </div>
        <div className="order-form">
          <LeadForm />
        </div>
        
      </section>

      <footer className="footer">
        <a className="logo footer-logo" href="#top">
          кварта<span>®</span>
        </a>
        <p>Хороший кофе. Свой ритм. Минск, с 2019.</p>
        <a className="footer-top" href="#top">
          Наверх ↑
        </a>
        <span className="footer-copy">© КВАРТА 2026</span>
      </footer>
    </main>
  );
}