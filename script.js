import { supabase, isSupabaseConfigured } from './src/config/supabase.js';
import { createBooking as createSupabaseBooking } from './src/services/crud.js';

// Resolve all asset paths dynamically for Vite production bundling
const images = import.meta.glob('./src/assets/**/*', { eager: true, import: 'default' });
const resolveAsset = (path) => images[path] || path;

const categories = [
  { slug: 'wedding', name: 'Weddings', image: './src/assets/hero-wedding.jpg', blurb: 'Grand mandaps, floral stages & sangeet nights.' },
  { slug: 'birthday', name: 'Birthdays', image: './src/assets/cat-birthday.jpg', blurb: 'First birthdays, milestone bashes, themed setups.' },
  { slug: 'haldi', name: 'Haldi & Mehndi', image: './src/assets/cat-haldi.jpg', blurb: 'Marigold magic, jhoolas & vibrant drapes.' },
  { slug: 'baby-shower', name: 'Baby Showers', image: './src/assets/cat-babyshower.jpg', blurb: 'Pastel dreams, balloon arches, dessert tables.' },
  { slug: 'engagement', name: 'Engagements', image: './src/assets/cat-engagement.jpg', blurb: 'Romantic rose arches & candlelit stages.' },
  { slug: 'corporate', name: 'Corporate', image: './src/assets/cat-corporate.jpg', blurb: 'Product launches, conferences & brand stages.' },
  { slug: 'anniversary', name: 'Anniversaries', image: './src/assets/cat-anniversary.jpg', blurb: 'Intimate candle dinners & rose surprises.' },
];

const EVENT_CATEGORIES = [
  { slug: 'all', name: 'All' },
  { slug: 'wedding', name: 'Weddings' },
  { slug: 'birthday', name: 'Birthdays' },
  { slug: 'haldi', name: 'Haldi & Mehndi' },
  { slug: 'baby-shower', name: 'Baby Showers' },
  { slug: 'engagement', name: 'Engagements' },
  { slug: 'corporate', name: 'Corporate' },
  { slug: 'anniversary', name: 'Anniversaries' },
];

const galleryItems = [
  { image: './src/assets/hero-wedding.jpg', category: 'wedding', title: 'Grand Mandap Setup' },
  { image: './src/assets/cat-birthday.jpg', category: 'birthday', title: 'Birthday Luxe Corner' },
  { image: './src/assets/cat-haldi.jpg', category: 'haldi', title: 'Haldi & Mehndi Styling' },
  { image: './src/assets/cat-babyshower.jpg', category: 'baby-shower', title: 'Pink Balloon Garden' },
  { image: './src/assets/cat-engagement.jpg', category: 'engagement', title: 'Rose Arch Installation' },
  { image: './src/assets/cat-corporate.jpg', category: 'corporate', title: 'Corporate Stage Setup' },
  { image: './src/assets/cat-anniversary.jpg', category: 'anniversary', title: 'Candlelit Anniversary Table' },
  { image: './src/assets/prop-arch.jpg', category: 'wedding', title: 'Circular Floral Arch' },
  { image: './src/assets/gallery-haldi-jhoola.png', category: 'haldi', title: 'Marigold Jhoola Swing' },
];

// Resolve the images within categories and galleryItems in place
categories.forEach(item => { if (item.image) item.image = resolveAsset(item.image); });
galleryItems.forEach(item => { if (item.image) item.image = resolveAsset(item.image); });

const packages = [
  { tier: 'Essential', price: '₹ 15,000 onwards', highlights: ['Balloon arch or backdrop drape', 'Floral centerpiece (1)', 'Name / age foil letters', 'On-site setup & teardown'], accent: false },
  { tier: 'Signature', price: '₹ 45,000 onwards', highlights: ['Themed backdrop + floral cascade', 'Balloon garland (custom palette)', 'Cake & dessert table styling', 'Fairy lights & candles', 'Photo-op prop (neon / marquee)'], accent: true },
  { tier: 'Luxe', price: '₹ 1,20,000 onwards', highlights: ['Full floral wall + arch', 'Custom stage / mandap build', 'Chandeliers & pin-spot lighting', 'Throne / lounge seating', 'Dedicated event coordinator'], accent: false },
];

function loadTestimonials() {
  const raw = window.localStorage.getItem('sky_decors_testimonials_v2');
  if (!raw) {
    const defaults = [
      { id: 't1', quote: 'Sky Decors turned our mandap into a fairytale. Every guest was speechless.', name: 'Aarti & Rohan' },
      { id: 't2', quote: 'The pastel setup was straight out of Pinterest. Worth every rupee.', name: 'Priya S.' },
      { id: 't3', quote: 'The rooftop candle dinner was pure magic. Highly recommend!', name: 'Meera & Vikas' },
      { id: 't4', quote: 'Professional, on-time, and the floral install went viral on LinkedIn.', name: 'Nikhil (Corp.)' },
    ];
    window.localStorage.setItem('sky_decors_testimonials_v2', JSON.stringify(defaults));
    return defaults;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveTestimonials(list) {
  window.localStorage.setItem('sky_decors_testimonials_v2', JSON.stringify(list));
}

function loadProducts() {
  const raw = window.localStorage.getItem('sky_decors_products_v2');
  if (!raw) {
    const defaults = [
      { id: 'throne', name: 'Royal Gold Throne', image: './src/assets/prop-arch.jpg', price: 3500, tag: 'Seating', eventCategory: 'wedding' },
      { id: 'neon', name: 'Neon Love Sign', image: './src/assets/prop-neon.jpg', price: 1800, tag: 'Lighting', eventCategory: 'all' },
      { id: 'floral-wall', name: 'Rose Floral Wall (8x8ft)', image: './src/assets/prop-floralwall.jpg', price: 6500, tag: 'Backdrop', eventCategory: 'wedding' },
      { id: 'marquee', name: 'Marquee LOVE Letters', image: './src/assets/prop-marquee.jpg', price: 4200, tag: 'Lighting', eventCategory: 'all' },
      { id: 'arch', name: 'Gold Circle Floral Arch', image: './src/assets/prop-arch.jpg', price: 5500, tag: 'Backdrop', eventCategory: 'wedding' },
      { id: 'cake-stand', name: '3-Tier Gold Cake Stand', image: './src/assets/prop-arch.jpg', price: 900, tag: 'Tableware', eventCategory: 'all' },
      { id: 'rustic-arch', name: 'Rustic Wooden Arch', image: './src/assets/prop-rustic-arch.png', price: 4800, tag: 'Backdrop', eventCategory: 'wedding' },
      { id: 'chandelier', name: 'Luxury Crystal Chandelier', image: './src/assets/prop-chandelier.png', price: 2500, tag: 'Lighting', eventCategory: 'all' },
    ];
    const resolvedDefaults = defaults.map(item => ({ ...item, image: resolveAsset(item.image) }));
    window.localStorage.setItem('sky_decors_products_v2', JSON.stringify(resolvedDefaults));
    return resolvedDefaults;
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed.map((item) => ({
      ...item,
      image: resolveAsset(item.image),
      eventCategory: item.eventCategory || 'all',
    }));
  } catch {
    return [];
  }
}

function saveProducts(list) {
  window.localStorage.setItem('sky_decors_products_v2', JSON.stringify(list));
}

const faqs = [
  { question: 'Do you support custom themes?', answer: 'Yes, every project can be tailored to match your preferred colours, style, and venue.' },
  { question: 'How do I book an appointment?', answer: 'You can reach out through email or Instagram and we will arrange a consultation.' },
  { question: 'What is included in a decor package?', answer: 'Each package includes design, setup, styling elements, and dismantling support.' },
];

const navItems = [
  { href: 'index.html', label: 'Home' },
  { href: 'gallery.html', label: 'Gallery' },
  { href: 'services.html', label: 'Services' },
  { href: 'props.html', label: 'Props' },
  { href: 'about.html', label: 'About' },
  { href: 'contact.html', label: 'Contact' },
  { href: 'booking.html', label: 'Book Now' },
];

const contactLinks = [
  { label: 'Call us', value: '+91 90000 00000', href: 'tel:+919000000000', icon: '☎' },
  { label: 'WhatsApp', value: 'Chat instantly', href: 'https://wa.me/919000000000', icon: '💬' },
  { label: 'Email', value: 'hello@skydecors.in', href: 'mailto:hello@skydecors.in', icon: '✉' },
  { label: 'Instagram', value: '@sky_decors_props', href: 'https://www.instagram.com/sky_decors_props', icon: '📸' },
];

function getCurrentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return path === 'index.html' || path === '' ? 'home' : path.replace('.html', '');
}

function getPageTitle(page) {
  const titles = {
    home: 'Sky Decors & Props',
    gallery: 'Gallery — Sky Decors & Props',
    services: 'Services — Sky Decors & Props',
    props: 'Props Catalog — Sky Decors & Props',
    about: 'About — Sky Decors & Props',
    contact: 'Contact — Sky Decors & Props',
    booking: 'Book Your Event — Sky Decors & Props',
    admin: 'Admin — Sky Decors & Props',
  };
  return titles[page] || titles.home;
}

function renderShell(content) {
  document.title = getPageTitle(getCurrentPage());
  document.body.innerHTML = `
    <header class="site-header">
      <div class="container nav-bar">
        <a href="index.html" class="brand">
          <span class="brand-mark">✦</span>
          <span>Sky Decors &amp; Props</span>
        </a>
        <button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="site-nav" aria-label="Primary navigation">
          ${navItems.map((item) => {
            const active = item.href === 'index.html' ? getCurrentPage() === 'home' : getCurrentPage() === item.href.replace('.html', '');
            return `<a href="${item.href}" class="${active ? 'active' : ''}">${item.label}</a>`;
          }).join('')}
        </nav>
      </div>
    </header>
    <main class="page-main">${content}</main>
    <footer class="site-footer">
      <div class="container footer-row">
        <p>© 2026 Sky Decors & Props. Crafted with elegance.</p>
        <a href="index.html">Back to top</a>
      </div>
    </footer>
  `;

  initMobileNav();
  attachPageHandlers();
}

function renderHomePage() {
  return `
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <div class="hero-text">
          <p class="eyebrow">Sky Decors &amp; Props</p>
          <h1 class="hero-title">Turning moments <br /> into <span class="hero-title-accent">magic.</span></h1>
          <p>Bespoke event decoration & premium props rental — from intimate anniversaries to grand weddings. Designed to be photographed. Remembered forever.</p>
          <div class="hero-actions">
            <a href="booking.html" class="btn btn-gold">Book Your Event</a>
            <a href="gallery.html" class="btn btn-outline">View Gallery</a>
          </div>
        </div>
      </div>
    </section>

    <section class="stats">
      <div class="container stats-grid">
        <div><strong>500+</strong><span>Events decorated</span></div>
        <div><strong>4.9★</strong><span>Google rating</span></div>
        <div><strong>8 yrs</strong><span>Of experience</span></div>
        <div><strong>100+</strong><span>Unique props</span></div>
      </div>
    </section>

    <section class="page-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">What we decorate</p>
          <h2>Every celebration, elevated.</h2>
          <p>From marigold-drenched haldis to marble-white weddings, every setup is tailored to the mood and the frame.</p>
        </div>
        <div class="card-grid">
          ${categories.map((item) => `
            <article class="card">
              <div class="card-image"><img src="${item.image}" alt="${item.name}" /></div>
              <div class="card-body">
                <h3>${item.name}</h3>
                <p>${item.blurb}</p>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="page-section section-alt">
      <div class="container process-grid">
        <div>
          <p class="eyebrow">How we work</p>
          <h2>A studio experience, from mood board to magic hour.</h2>
          <p>Every event begins with a conversation and ends with tears of joy — the good kind.</p>
        </div>
        <ol class="process-list">
          <li><strong>01. Consult</strong><span>Share your date, venue, vibe, and Pinterest boards.</span></li>
          <li><strong>02. Design</strong><span>We craft a bespoke mood board and styling reference.</span></li>
          <li><strong>03. Deliver</strong><span>Our team installs, styles, and dismantles — you just enjoy.</span></li>
          <li><strong>04. Delight</strong><span>Every guest becomes your photographer.</span></li>
        </ol>
      </div>
    </section>

    <section class="page-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Recently decorated</p>
          <h2>Straight from our studio.</h2>
        </div>
        <div class="gallery-grid">
          ${galleryItems.slice(0, 8).map((item) => `
            <button class="gallery-card" type="button">
              <div class="thumb"><img src="${item.image}" alt="${item.title}" /></div>
              <div class="gallery-title">${item.title}</div>
            </button>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="page-section section-dark">
      <div class="container">
        <div class="section-heading centered">
          <p class="eyebrow">Client love</p>
          <h2>Loved by hundreds of hosts.</h2>
        </div>
        <div class="testimonial-grid">
          ${loadTestimonials().map((item) => `
            <article class="testimonial">
              <div class="stars">★★★★★</div>
              <p>“${item.quote}”</p>
              <strong>${item.name}</strong>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="page-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">FAQs</p>
          <h2>Questions we often hear.</h2>
        </div>
        <div class="faq-list">
          ${faqs.map((item) => `
            <div class="faq-item">
              <h3>${item.question}</h3>
              <p>${item.answer}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="page-section">
      <div class="container contact-card">
        <h2>Let’s make it unforgettable.</h2>
        <p>Tell us about your event and we’ll get back within 24 hours with a custom quote and mood board.</p>
        <div class="cta-row"><a href="booking.html" class="btn btn-gold">Start Your Enquiry</a></div>
      </div>
    </section>
  `;
}

function renderGalleryPage() {
  return `
    <section class="page-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Portfolio</p>
          <h2>The gallery.</h2>
          <p class="page-intro">A curated glimpse into the setups we’ve styled — filter by event type below.</p>
        </div>

        <div class="filter-row">
          ${EVENT_CATEGORIES.map((cat) => `<button class="filter-chip ${cat.slug === 'all' ? 'active' : ''}" type="button" data-filter="${cat.slug}">${cat.name}</button>`).join('')}
        </div>

        <div class="gallery-grid" id="gallery-grid"></div>
      </div>
    </section>
    <div class="lightbox hidden" id="lightbox" role="dialog" aria-modal="true">
      <div class="lightbox-content">
        <button class="lightbox-close" id="lightbox-close" type="button" aria-label="Close preview">×</button>
        <img id="lightbox-image" src="" alt="Preview" />
      </div>
    </div>
  `;
}

function renderServicesPage() {
  return `
    <section class="page-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Services</p>
          <h2>Packages for every scale.</h2>
          <p class="page-intro">Three curated tiers to get you started. Every setup is customised — pricing shown is a starting reference.</p>
        </div>
        <div class="package-grid">
          ${packages.map((item) => `
            <article class="package-card ${item.accent ? 'featured' : ''}">
              <h3>${item.tier}</h3>
              <div class="price">${item.price}</div>
              <ul>
                ${item.highlights.map((highlight) => `<li>${highlight}</li>`).join('')}
              </ul>
              <a href="booking.html" class="btn ${item.accent ? 'btn-gold' : 'btn-burgundy'}" style="margin-top: 1.2rem;">Enquire</a>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="page-section section-alt">
      <div class="container">
        <div class="section-heading centered">
          <p class="eyebrow">Event types</p>
          <h2>We specialise in these celebrations.</h2>
        </div>
        <div class="event-grid">
          ${categories.map((item) => `
            <article class="event-card card">
              <div class="card-image"><img src="${item.image}" alt="${item.name}" /></div>
              <div class="card-body">
                <h3>${item.name}</h3>
                <p>${item.blurb}</p>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderAboutPage() {
  return `
    <section class="page-section">
      <div class="container">
        <div class="page-card about-grid">
          <div>
            <p class="eyebrow">Our story</p>
            <h1>We design memories, one setup at a time.</h1>
            <p>Sky Decors & Props began in 2018 with a simple obsession — that every celebration deserves a setting as beautiful as its story. Eight years and 500+ events later, we still start every project the same way: with a mood board, a candid conversation, and coffee.</p>
            <p>From intimate haldi mornings to 800-guest weddings, our in-house team of florists, carpenters, lighting techs, and stylists handles every detail, so you never have to lift a garland.</p>
            <a href="booking.html" class="btn btn-gold" style="margin-top:0.6rem;">Work with us</a>
          </div>
          <div class="card-image" style="height: 100%; min-height: 360px; border-radius: 1.5rem; overflow: hidden;">
            <img src="./assets/hero-wedding.jpg" alt="Studio" />
          </div>
        </div>
      </div>
    </section>

    <section class="page-section section-alt">
      <div class="container">
        <div class="card-grid">
          <article class="page-card">
            <h3>Bespoke</h3>
            <p>No two setups repeat. Every event is designed from scratch to your vibe.</p>
          </article>
          <article class="page-card">
            <h3>In-house</h3>
            <p>Florists, carpenters, lighting — our full team, never third-party.</p>
          </article>
          <article class="page-card">
            <h3>On time</h3>
            <p>We install before your guests arrive and teardown after they leave. Guaranteed.</p>
          </article>
        </div>
      </div>
    </section>
  `;
}

function renderPropsPage() {
  return `
    <section class="page-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Rentals</p>
          <h2>Props catalog.</h2>
          <p class="page-intro">Rent individual props by the day, or bundle them with a decoration package. Prices are per day, subject to availability.</p>
        </div>

        <div class="filter-row">
          ${EVENT_CATEGORIES.map((cat) => '<button class="filter-chip ' + (cat.slug === 'all' ? 'active' : '') + '" type="button" data-filter="' + cat.slug + '">' + cat.name + '</button>').join('')}
        </div>

        <div class="prop-grid" id="prop-grid"></div>
      </div>
    </section>
  `;
}

function renderContactPage() {
  return `
    <section class="page-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Get in touch</p>
          <h2>Say hello.</h2>
          <p class="page-intro">Reach us the way you prefer — we usually reply within a few hours during working days.</p>
        </div>

        <div class="contact-grid">
          ${contactLinks.map((item) => `
            <a class="contact-link" href="${item.href}" target="${item.href.startsWith('http') ? '_blank' : ''}" rel="noreferrer">
              <div class="contact-icon">${item.icon}</div>
              <div>
                <div class="eyebrow" style="margin-bottom: 0.25rem;">${item.label}</div>
                <div style="font-weight: 700; color: var(--burgundy);">${item.value}</div>
              </div>
            </a>
          `).join('')}
        </div>

        <div class="page-card" style="margin-top: 1.2rem;">
          <div class="eyebrow">Studio</div>
          <h3>Hyderabad, Telangana</h3>
          <p>Serving Hyderabad, Secunderabad, and destination events pan-India.</p>
        </div>
      </div>
    </section>
  `;
}

function renderBookingPage() {
  return `
    <section class="page-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Book an event</p>
          <h2>Tell us the vision.</h2>
          <p class="page-intro">Share a few details and we’ll craft a bespoke proposal — no obligation.</p>
        </div>

        <div id="booking-success" class="form-success hidden">
          <h2>Enquiry received!</h2>
          <p>Thank you for reaching out. Our team will get back within 24 hours with a mood board and quote.</p>
        </div>

        <form id="booking-form" class="form-shell">
          <div class="form-grid">
            <div class="field-group">
              <label class="field-label" for="name">Your name</label>
              <input class="form-input" id="name" name="name" type="text" />
              <p class="field-error" data-error-for="name"></p>
            </div>
            <div class="field-group">
              <label class="field-label" for="phone">Phone</label>
              <input class="form-input" id="phone" name="phone" type="tel" />
              <p class="field-error" data-error-for="phone"></p>
            </div>
            <div class="field-group full">
              <label class="field-label" for="email">Email</label>
              <input class="form-input" id="email" name="email" type="email" />
              <p class="field-error" data-error-for="email"></p>
            </div>
            <div class="field-group">
              <label class="field-label" for="eventType">Event type</label>
              <select class="form-select" id="eventType" name="eventType">
                <option value="">Select...</option>
                ${EVENT_CATEGORIES.filter((cat) => cat.slug !== 'all').map((cat) => `<option value="${cat.name}">${cat.name}</option>`).join('')}
                <option value="Other">Other</option>
              </select>
              <p class="field-error" data-error-for="eventType"></p>
            </div>
            <div class="field-group">
              <label class="field-label" for="eventDate">Event date</label>
              <input class="form-input" id="eventDate" name="eventDate" type="date" />
              <p class="field-error" data-error-for="eventDate"></p>
            </div>
            <div class="field-group full">
              <label class="field-label" for="venue">Venue / city</label>
              <input class="form-input" id="venue" name="venue" type="text" />
              <p class="field-error" data-error-for="venue"></p>
            </div>
            <div class="field-group">
              <label class="field-label" for="budget">Budget range</label>
              <select class="form-select" id="budget" name="budget">
                <option value="">Select...</option>
                <option>Under ₹25k</option>
                <option>₹25k – ₹75k</option>
                <option>₹75k – ₹2L</option>
                <option>₹2L – ₹5L</option>
                <option>₹5L+</option>
              </select>
              <p class="field-error" data-error-for="budget"></p>
            </div>
            <div class="field-group">
              <label class="field-label" for="package">Preferred package</label>
              <select class="form-select" id="package" name="package">
                <option value="">Not sure yet</option>
                ${packages.map((item) => `<option>${item.tier}</option>`).join('')}
                <option>Custom / Bespoke</option>
              </select>
              <p class="field-error" data-error-for="package"></p>
            </div>
            <div class="field-group full">
              <label class="field-label" for="notes">Additional notes / references</label>
              <textarea class="form-textarea" id="notes" name="notes" rows="5" placeholder="Colour palette, Pinterest links, dietary notes for dessert table, etc."></textarea>
            </div>
            <div class="field-group full" style="margin-top:0.5rem;">
              <button type="submit" class="btn btn-gold">Send Enquiry</button>
              <p class="form-help">We reply within 24 hours. No spam, ever.</p>
            </div>
          </div>
        </form>
      </div>
    </section>
  `;
}

function renderAdminPage() {
  const authed = window.sessionStorage.getItem('sky_admin_auth_v1') === '1';
  const activeTab = window.sessionStorage.getItem('sky_admin_tab') || 'dashboard';
  const bookingFilter = window.sessionStorage.getItem('sky_admin_filter') || 'all';
  const propFilter = window.sessionStorage.getItem('sky_admin_prop_filter') || 'all';

  if (!authed) {
    return `
      <section class="page-section">
        <div class="auth-card">
          <p class="eyebrow">Admin access</p>
          <h2>Sky Admin</h2>
          <p class="page-intro">Enter the admin PIN to continue.</p>
          <form id="admin-auth-form">
            <div class="field-group">
              <label class="field-label" for="admin-pin">PIN</label>
              <input class="form-input" id="admin-pin" name="pin" type="password" placeholder="••••••" />
            </div>
            <button class="btn btn-gold" style="margin-top: 1rem; width: 100%;">Sign in with PIN</button>
          </form>
          <div style="margin-top: 1.2rem; text-align: center; color: var(--muted); font-size: 0.85rem; font-family: sans-serif;">— OR —</div>
          <button id="admin-google-login-btn" class="btn btn-outline" style="margin-top: 1.2rem; width: 100%; border: 1px solid var(--border); color: var(--text); background: white; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 500; border-radius: 999px; cursor: pointer; padding: 0.6rem 1rem;">
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.844 2.078-1.796 2.717v2.258h2.909c1.702-1.567 2.683-3.874 2.683-6.616z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.185l-2.91-2.258c-.805.54-1.836.859-3.046.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.93 6.002 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.705A5.41 5.41 0 0 1 3.6 9c0-.594.102-1.17.284-1.705V4.963H.957A8.993 8.993 0 0 0 0 9c0 1.543.391 3.013.957 4.332l3.007-2.627z" fill="#FBBC05"/>
              <path d="M9 3.579c1.32 0 2.508.454 3.44 1.345l2.582-2.58C13.46 1.055 11.427 0 9 0 6.002 0 2.438 2.07 1.047 5.068l3.007 2.332c.708-2.127 2.692-3.711 5.036-3.711z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
          <p class="form-help" style="margin-top: 1.5rem;">Demo PIN: sky2026</p>
        </div>
      </section>
    `;
  }

  const bookings = loadBookings();
  const pending = bookings.filter((item) => item.status === 'pending').length;
  const confirmed = bookings.filter((item) => item.status === 'confirmed').length;
  const month = new Date().getMonth();
  const thisMonth = bookings.filter((item) => new Date(item.createdAt).getMonth() === month).length;

  const contentByTab = {
    dashboard: `
      <div class="admin-card">
        <h3>Dashboard</h3>
        <p>Overview of your studio.</p>
        <div class="stat-grid" style="margin-top: 1rem;">
          <div class="page-card"><div class="eyebrow">Total enquiries</div><h2>${bookings.length}</h2></div>
          <div class="page-card"><div class="eyebrow">Pending</div><h2>${pending}</h2></div>
          <div class="page-card"><div class="eyebrow">Confirmed</div><h2>${confirmed}</h2></div>
          <div class="page-card"><div class="eyebrow">This month</div><h2>${thisMonth}</h2></div>
        </div>
      </div>
      <div class="admin-card">
        <h3>Latest enquiries</h3>
        ${bookings.length === 0 ? '<p class="page-intro">No enquiries yet. Try submitting the booking form.</p>' : `
          <div class="table-card">
            <table>
              <thead><tr><th>Client</th><th>Event</th><th>Status</th></tr></thead>
              <tbody>
                ${bookings.slice(0, 5).map((item) => `
                  <tr>
                    <td>${item.name}<br /><small>${item.email}</small></td>
                    <td>${item.eventType}<br /><small>${item.eventDate}</small></td>
                    <td>${statusBadge(item.status)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `,
    bookings: `
      <div class="admin-card">
        <h3>Bookings</h3>
        <p>Manage enquiries, confirm dates, close events.</p>
        <div class="admin-actions">
          ${['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((value) => `<button type="button" class="filter-chip ${bookingFilter === value ? 'active' : ''}" data-admin-filter="${value}">${value}</button>`).join('')}
        </div>
        <div class="table-card">
          <table>
            <thead><tr><th>Client</th><th>Event</th><th>Budget</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${filterBookings(bookings, bookingFilter).map((item) => `
                <tr>
                  <td>${item.name}<br /><small>${item.email}<br />${item.phone}</small></td>
                  <td>${item.eventType}<br /><small>${item.venue}</small><br /><small>${item.package || '—'}</small></td>
                  <td>${item.budget}</td>
                  <td>${statusBadge(item.status)}</td>
                  <td>
                    <div class="admin-actions">
                      <button type="button" class="btn btn-muted" data-booking-action="confirmed" data-booking-id="${item.id}">Confirm</button>
                      <button type="button" class="btn btn-muted" data-booking-action="in-progress" data-booking-id="${item.id}">Start</button>
                      <button type="button" class="btn btn-muted" data-booking-action="completed" data-booking-id="${item.id}">Done</button>
                      <button type="button" class="btn btn-muted" data-booking-action="cancelled" data-booking-id="${item.id}">Cancel</button>
                      <button type="button" class="btn btn-burgundy" data-booking-action="delete" data-booking-id="${item.id}">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `,
    props: `
      <div class="admin-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div>
            <h3>Props Inventory</h3>
            <p>Add, edit, or delete props from the catalog.</p>
          </div>
          <button type="button" class="btn btn-gold" id="admin-add-prop-btn">Add Prop</button>
        </div>

        <div class="admin-actions" style="margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${EVENT_CATEGORIES.map((cat) => `<button type="button" class="filter-chip ${propFilter === cat.slug ? 'active' : ''}" data-admin-prop-filter="${cat.slug}">${cat.name}</button>`).join('')}
        </div>

        <div id="prop-form-container" class="admin-form-container hidden">
          <!-- Form will be injected dynamically -->
        </div>

        <div class="table-card" id="prop-list-table">
          <table>
            <thead><tr><th>Image</th><th>Name</th><th>Type / Tag</th><th>Event Category</th><th>Price</th><th>Actions</th></tr></thead>
            <tbody>
              ${(propFilter === 'all' ? loadProducts() : loadProducts().filter((item) => item.eventCategory === propFilter)).map((item) => `
                <tr>
                  <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;" /></td>
                  <td><strong>${item.name}</strong></td>
                  <td>${item.tag}</td>
                  <td><span class="status-pill" style="background: var(--blush); color: var(--burgundy); text-transform: none; font-size: 0.8rem;">${EVENT_CATEGORIES.find((c) => c.slug === item.eventCategory)?.name || item.eventCategory}</span></td>
                  <td>₹${item.price.toLocaleString('en-IN')}</td>
                  <td>
                    <div class="admin-actions" style="margin: 0;">
                      <button type="button" class="btn btn-muted" data-prop-edit-id="${item.id}">Edit</button>
                      <button type="button" class="btn btn-burgundy" data-prop-delete-id="${item.id}">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `,
    comments: `
      <div class="admin-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div>
            <h3>Client Testimonials</h3>
            <p>Add, edit, or delete testimonials displayed on the home page.</p>
          </div>
          <button type="button" class="btn btn-gold" id="admin-add-comment-btn">Add Testimonial</button>
        </div>

        <div id="comment-form-container" class="admin-form-container hidden">
          <!-- Form will be injected dynamically -->
        </div>

        <div class="table-card" id="comment-list-table">
          <table>
            <thead><tr><th>Client Name</th><th>Quote / Comment</th><th>Actions</th></tr></thead>
            <tbody>
              ${loadTestimonials().map((item) => `
                <tr>
                  <td style="white-space: nowrap;"><strong>${item.name}</strong></td>
                  <td>“${item.quote}”</td>
                  <td>
                    <div class="admin-actions" style="margin: 0;">
                      <button type="button" class="btn btn-muted" data-comment-edit-id="${item.id}">Edit</button>
                      <button type="button" class="btn btn-burgundy" data-comment-delete-id="${item.id}">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `,
  }[activeTab] || contentByTab.dashboard;

  return `
    <section class="admin-shell">
      <aside class="admin-sidebar">
        <a href="index.html" class="brand"><span class="brand-mark">✦</span><span>Sky Admin</span></a>
        <div class="admin-nav">
          <button type="button" class="${activeTab === 'dashboard' ? 'active' : ''}" data-admin-tab="dashboard">Dashboard</button>
          <button type="button" class="${activeTab === 'bookings' ? 'active' : ''}" data-admin-tab="bookings">Bookings</button>
          <button type="button" class="${activeTab === 'props' ? 'active' : ''}" data-admin-tab="props">Props</button>
          <button type="button" class="${activeTab === 'comments' ? 'active' : ''}" data-admin-tab="comments">Comments</button>
        </div>
        <button type="button" class="btn btn-muted" id="admin-logout">Sign out</button>
      </aside>
      <div class="admin-content">${contentByTab}</div>
    </section>
  `;
}

function loadBookings() {
  const raw = window.localStorage.getItem('sky_decors_bookings_v1');
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookings(list) {
  window.localStorage.setItem('sky_decors_bookings_v1', JSON.stringify(list));
}

function addBooking(data) {
  const list = loadBookings();
  const booking = {
    id: window.crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    ...data,
  };
  saveBookings([booking, ...list]);
}

async function persistBooking(data) {
  if (isSupabaseConfigured) {
    try {
      await createSupabaseBooking({
        user_id: null,
        order_number: `ENQ-${Date.now()}`,
        status: 'pending',
        subtotal: 0,
        discount: 0,
        shipping_fee: 0,
        total: 0,
        notes: JSON.stringify(data),
      });
      return true;
    } catch (error) {
      console.warn('Supabase booking sync failed; using local storage fallback.', error);
    }
  }

  addBooking(data);
  return false;
}

function updateBookingStatus(id, status) {
  const list = loadBookings().map((item) => (item.id === id ? { ...item, status } : item));
  saveBookings(list);
}

function deleteBooking(id) {
  const list = loadBookings().filter((item) => item.id !== id);
  saveBookings(list);
}

function filterBookings(bookings, filter) {
  if (filter === 'all') return bookings;
  return bookings.filter((item) => item.status === filter);
}

function statusBadge(status) {
  const map = {
    pending: { label: 'Pending', className: 'status-pending' },
    confirmed: { label: 'Confirmed', className: 'status-confirmed' },
    'in-progress': { label: 'In progress', className: 'status-in-progress' },
    completed: { label: 'Completed', className: 'status-completed' },
    cancelled: { label: 'Cancelled', className: 'status-cancelled' },
  };
  const entry = map[status] || map.pending;
  return `<span class="status-pill ${entry.className}">${entry.label}</span>`;
}


function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

function attachPageHandlers() {
  const page = getCurrentPage();

  if (page === 'gallery') {
    initGalleryPage();
  }

  if (page === 'props') {
    initPropsPage();
  }

  if (page === 'booking') {
    initBookingPage();
  }

  if (page === 'admin') {
    initAdminPage();
  }
}

function initGalleryPage() {
  const grid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const closeButton = document.getElementById('lightbox-close');
  const filters = Array.from(document.querySelectorAll('.filter-chip'));

  let activeFilter = 'all';

  function renderGallery() {
    const items = activeFilter === 'all' ? galleryItems : galleryItems.filter((item) => item.category === activeFilter);
    grid.innerHTML = items.map((item) => `
      <button class="gallery-card" type="button" data-image="${item.image}" data-title="${item.title}">
        <div class="thumb"><img src="${item.image}" alt="${item.title}" /></div>
        <div class="gallery-title">${item.title}</div>
      </button>
    `).join('');
  }

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      filters.forEach((chip) => chip.classList.toggle('active', chip === button));
      renderGallery();
    });
  });

  grid.addEventListener('click', (event) => {
    const card = event.target.closest('.gallery-card');
    if (!card) return;
    lightboxImage.src = card.dataset.image;
    lightboxImage.alt = card.dataset.title;
    lightbox.classList.remove('hidden');
  });

  closeButton.addEventListener('click', () => lightbox.classList.add('hidden'));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.classList.add('hidden');
    }
  });

  renderGallery();
}

function initPropsPage() {
  const grid = document.getElementById('prop-grid');
  const filters = Array.from(document.querySelectorAll('.filter-chip'));

  let activeFilter = 'all';

  function renderProps() {
    const allProducts = loadProducts();
    const items = activeFilter === 'all' 
      ? allProducts 
      : allProducts.filter((item) => item.eventCategory === activeFilter || item.eventCategory === 'all');
      
    grid.innerHTML = items.map((item) => `
      <article class="prop-card">
        <div class="card-image"><img src="${item.image}" alt="${item.name}" /></div>
        <div class="card-body">
          <div class="eyebrow">${item.tag} ${item.eventCategory !== 'all' ? `• ${EVENT_CATEGORIES.find(c => c.slug === item.eventCategory)?.name || item.eventCategory}` : ''}</div>
          <h3>${item.name}</h3>
          <p>₹ ${item.price.toLocaleString('en-IN')} / day</p>
          <a href="booking.html" class="btn btn-burgundy" style="margin-top: 1rem;">Enquire</a>
        </div>
      </article>
    `).join('');
  }

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      filters.forEach((chip) => chip.classList.toggle('active', chip === button));
      renderProps();
    });
  });

  renderProps();
}

function initBookingPage() {
  const form = document.getElementById('booking-form');
  const success = document.getElementById('booking-success');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const values = Object.fromEntries(data.entries());
    const errors = {};

    if (!String(values.name || '').trim()) errors.name = 'Please enter your name';
    if (!String(values.phone || '').trim()) errors.phone = 'Please enter a phone number';
    if (!String(values.email || '').trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'Enter a valid email';
    if (!String(values.eventType || '').trim()) errors.eventType = 'Select an event type';
    if (!String(values.eventDate || '').trim()) errors.eventDate = 'Pick a date';
    if (!String(values.venue || '').trim()) errors.venue = 'Where is the event?';
    if (!String(values.budget || '').trim()) errors.budget = 'Choose a budget';

    document.querySelectorAll('.field-error').forEach((item) => {
      item.textContent = '';
    });

    if (Object.keys(errors).length) {
      Object.entries(errors).forEach(([key, message]) => {
        const target = document.querySelector(`[data-error-for="${key}"]`);
        if (target) target.textContent = message;
      });
      return;
    }

    await persistBooking({
      name: String(values.name).trim(),
      email: String(values.email).trim(),
      phone: String(values.phone).trim(),
      eventType: String(values.eventType).trim(),
      eventDate: String(values.eventDate).trim(),
      venue: String(values.venue).trim(),
      budget: String(values.budget).trim(),
      package: String(values.package || '').trim(),
      notes: String(values.notes || '').trim(),
    });

    form.classList.add('hidden');
    success.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initAdminPage() {
  const authForm = document.getElementById('admin-auth-form');
  if (authForm) {
    authForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const pin = new FormData(authForm).get('pin');
      if (String(pin).trim() === 'sky2026') {
        window.sessionStorage.setItem('sky_admin_auth_v1', '1');
        renderPage();
      }
    });
  }

  const googleLoginBtn = document.getElementById('admin-google-login-btn');
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
      if (!isSupabaseConfigured) {
        alert("Supabase is not configured. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable Google Login.");
        return;
      }
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + '/admin.html',
          },
        });
        if (error) throw error;
      } catch (err) {
        alert("Google Login error: " + err.message);
      }
    });
  }

  const logoutButton = document.getElementById('admin-logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      window.sessionStorage.removeItem('sky_admin_auth_v1');
      if (isSupabaseConfigured) {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.warn("Supabase signOut error:", e);
        }
      }
      renderPage();
    });
  }

  document.querySelectorAll('[data-admin-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      window.sessionStorage.setItem('sky_admin_tab', button.dataset.adminTab);
      renderPage();
    });
  });

  document.querySelectorAll('[data-booking-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.bookingId;
      const action = button.dataset.bookingAction;
      if (action === 'delete') {
        if (window.confirm('Delete this enquiry?')) {
          deleteBooking(id);
          renderPage();
        }
        return;
      }
      updateBookingStatus(id, action);
      renderPage();
    });
  });

  document.querySelectorAll('[data-admin-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      window.sessionStorage.setItem('sky_admin_filter', button.dataset.adminFilter || 'all');
      renderPage();
    });
  });

  document.querySelectorAll('[data-admin-prop-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      window.sessionStorage.setItem('sky_admin_prop_filter', button.dataset.adminPropFilter || 'all');
      renderPage();
    });
  });

  const addPropBtn = document.getElementById('admin-add-prop-btn');
  const propFormContainer = document.getElementById('prop-form-container');
  const propListTable = document.getElementById('prop-list-table');

  function renderPropForm(editingProp = null) {
    if (!propFormContainer) return;
    propFormContainer.innerHTML = `
      <form id="admin-prop-form" class="form-shell" style="max-width: 600px; margin-bottom: 2rem; background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <input type="hidden" name="id" id="prop-id" value="${editingProp ? editingProp.id : ''}" />
        <h4 style="margin-bottom: 1.2rem; font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--burgundy);">${editingProp ? 'Edit Prop Details' : 'Add New Prop to Catalog'}</h4>
        <div class="form-grid">
          <div class="field-group" style="display: flex; flex-direction: column;">
            <label class="field-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 0.35rem;" for="prop-name">Prop Name</label>
            <input class="form-input" style="padding: 0.6rem; border: 1px solid var(--border); border-radius: 0.5rem;" id="prop-name" name="name" type="text" value="${editingProp ? editingProp.name : ''}" required />
          </div>
          <div class="field-group" style="display: flex; flex-direction: column;">
            <label class="field-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 0.35rem;" for="prop-tag">Type / Tag</label>
            <select class="form-select" style="padding: 0.6rem; border: 1px solid var(--border); border-radius: 0.5rem; background: white;" id="prop-tag" name="tag" required>
              <option value="Seating" ${editingProp && editingProp.tag === 'Seating' ? 'selected' : ''}>Seating</option>
              <option value="Lighting" ${editingProp && editingProp.tag === 'Lighting' ? 'selected' : ''}>Lighting</option>
              <option value="Backdrop" ${editingProp && editingProp.tag === 'Backdrop' ? 'selected' : ''}>Backdrop</option>
              <option value="Tableware" ${editingProp && editingProp.tag === 'Tableware' ? 'selected' : ''}>Tableware</option>
            </select>
          </div>
          <div class="field-group" style="display: flex; flex-direction: column;">
            <label class="field-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 0.35rem;" for="prop-event-category">Event Category</label>
            <select class="form-select" style="padding: 0.6rem; border: 1px solid var(--border); border-radius: 0.5rem; background: white;" id="prop-event-category" name="eventCategory" required>
              ${EVENT_CATEGORIES.map((cat) => `
                <option value="${cat.slug}" ${editingProp && editingProp.eventCategory === cat.slug ? 'selected' : ''}>${cat.name}</option>
              `).join('')}
            </select>
          </div>
          <div class="field-group" style="display: flex; flex-direction: column;">
            <label class="field-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 0.35rem;" for="prop-price">Price (₹ / day)</label>
            <input class="form-input" style="padding: 0.6rem; border: 1px solid var(--border); border-radius: 0.5rem;" id="prop-price" name="price" type="number" value="${editingProp ? editingProp.price : ''}" required />
          </div>
          <div class="field-group" style="display: flex; flex-direction: column;">
            <label class="field-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 0.35rem;" for="prop-image">Image URL</label>
            <input class="form-input" style="padding: 0.6rem; border: 1px solid var(--border); border-radius: 0.5rem;" id="prop-image" name="image" type="text" value="${editingProp ? editingProp.image : resolveAsset('./src/assets/prop-arch.jpg')}" required />
          </div>
          <div class="field-group full" style="display: flex; gap: 1rem; margin-top: 1rem;">
            <button type="submit" class="btn btn-gold" style="padding: 0.6rem 1.5rem; border-radius: 999px;">${editingProp ? 'Save Changes' : 'Add Prop'}</button>
            <button type="button" class="btn btn-outline" id="admin-prop-cancel" style="padding: 0.6rem 1.5rem; border-radius: 999px; background: transparent; border: 1px solid var(--muted); color: var(--muted);">Cancel</button>
          </div>
        </div>
      </form>
    `;
    propFormContainer.classList.remove('hidden');
    if (propListTable) propListTable.classList.add('hidden');

    document.getElementById('admin-prop-cancel').addEventListener('click', () => {
      propFormContainer.classList.add('hidden');
      if (propListTable) propListTable.classList.remove('hidden');
    });

    document.getElementById('admin-prop-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const data = new FormData(form);
      const id = data.get('id');
      const name = data.get('name');
      const tag = data.get('tag');
      const eventCategory = data.get('eventCategory');
      const price = parseFloat(data.get('price'));
      const image = data.get('image');

      const products = loadProducts();
      if (id) {
        const index = products.findIndex((p) => p.id === id);
        if (index > -1) {
          products[index] = { id, name, tag, eventCategory, price, image };
        }
      } else {
        const newId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || window.crypto.randomUUID();
        products.push({ id: newId, name, tag, eventCategory, price, image });
      }

      saveProducts(products);
      renderPage();
    });
  }

  if (addPropBtn) {
    addPropBtn.addEventListener('click', () => renderPropForm());
  }

  document.querySelectorAll('[data-prop-edit-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.propEditId;
      const prop = loadProducts().find((p) => p.id === id);
      if (prop) renderPropForm(prop);
    });
  });

  document.querySelectorAll('[data-prop-delete-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.propDeleteId;
      if (window.confirm('Are you sure you want to delete this prop?')) {
        const products = loadProducts().filter((p) => p.id !== id);
        saveProducts(products);
        renderPage();
      }
    });
  });

  const addCommentBtn = document.getElementById('admin-add-comment-btn');
  const commentFormContainer = document.getElementById('comment-form-container');
  const commentListTable = document.getElementById('comment-list-table');

  function renderCommentForm(editingComment = null) {
    if (!commentFormContainer) return;
    commentFormContainer.innerHTML = `
      <form id="admin-comment-form" class="form-shell" style="max-width: 600px; margin-bottom: 2rem; background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <input type="hidden" name="id" id="comment-id" value="${editingComment ? editingComment.id : ''}" />
        <h4 style="margin-bottom: 1.2rem; font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--burgundy);">${editingComment ? 'Edit Testimonial' : 'Add New Testimonial'}</h4>
        <div class="form-grid">
          <div class="field-group full" style="display: flex; flex-direction: column;">
            <label class="field-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 0.35rem;" for="comment-name">Client Name(s)</label>
            <input class="form-input" style="padding: 0.6rem; border: 1px solid var(--border); border-radius: 0.5rem;" id="comment-name" name="name" type="text" value="${editingComment ? editingComment.name : ''}" required />
          </div>
          <div class="field-group full" style="display: flex; flex-direction: column;">
            <label class="field-label" style="font-weight: 600; font-size: 0.85rem; margin-bottom: 0.35rem;" for="comment-quote">Quote / Comment</label>
            <textarea class="form-textarea" style="padding: 0.6rem; border: 1px solid var(--border); border-radius: 0.5rem;" id="comment-quote" name="quote" rows="4" required>${editingComment ? editingComment.quote : ''}</textarea>
          </div>
          <div class="field-group full" style="display: flex; gap: 1rem; margin-top: 1rem;">
            <button type="submit" class="btn btn-gold" style="padding: 0.6rem 1.5rem; border-radius: 999px;">${editingComment ? 'Save Changes' : 'Add Testimonial'}</button>
            <button type="button" class="btn btn-outline" id="admin-comment-cancel" style="padding: 0.6rem 1.5rem; border-radius: 999px; background: transparent; border: 1px solid var(--muted); color: var(--muted);">Cancel</button>
          </div>
        </div>
      </form>
    `;
    commentFormContainer.classList.remove('hidden');
    if (commentListTable) commentListTable.classList.add('hidden');

    document.getElementById('admin-comment-cancel').addEventListener('click', () => {
      commentFormContainer.classList.add('hidden');
      if (commentListTable) commentListTable.classList.remove('hidden');
    });

    document.getElementById('admin-comment-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const data = new FormData(form);
      const id = data.get('id');
      const name = data.get('name');
      const quote = data.get('quote');

      const testimonials = loadTestimonials();
      if (id) {
        const index = testimonials.findIndex((t) => t.id === id);
        if (index > -1) {
          testimonials[index] = { id, name, quote };
        }
      } else {
        const newId = 't-' + Date.now();
        testimonials.push({ id: newId, name, quote });
      }

      saveTestimonials(testimonials);
      renderPage();
    });
  }

  if (addCommentBtn) {
    addCommentBtn.addEventListener('click', () => renderCommentForm());
  }

  document.querySelectorAll('[data-comment-edit-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.commentEditId;
      const comment = loadTestimonials().find((t) => t.id === id);
      if (comment) renderCommentForm(comment);
    });
  });

  document.querySelectorAll('[data-comment-delete-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.commentDeleteId;
      if (window.confirm('Are you sure you want to delete this testimonial?')) {
        const testimonials = loadTestimonials().filter((t) => t.id !== id);
        saveTestimonials(testimonials);
        renderPage();
      }
    });
  });
}

function renderPage() {
  const page = getCurrentPage();
  if (page === 'home') {
    renderShell(renderHomePage());
  } else if (page === 'gallery') {
    renderShell(renderGalleryPage());
  } else if (page === 'services') {
    renderShell(renderServicesPage());
  } else if (page === 'about') {
    renderShell(renderAboutPage());
  } else if (page === 'props') {
    renderShell(renderPropsPage());
  } else if (page === 'contact') {
    renderShell(renderContactPage());
  } else if (page === 'booking') {
    renderShell(renderBookingPage());
  } else if (page === 'admin') {
    renderShell(renderAdminPage());
  } else {
    renderShell(renderHomePage());
  }
}

async function checkSupabaseSession() {
  if (isSupabaseConfigured) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.sessionStorage.setItem('sky_admin_auth_v1', '1');
      }
    } catch (e) {
      console.warn("Failed checking Supabase session:", e);
    }
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  await checkSupabaseSession();
  renderPage();
});

window.addEventListener('storage', (event) => {
  if (
    event.key === 'sky_decors_products_v2' || 
    event.key === 'sky_decors_testimonials_v2' || 
    event.key === 'sky_decors_bookings_v1'
  ) {
    renderPage();
  }
});
