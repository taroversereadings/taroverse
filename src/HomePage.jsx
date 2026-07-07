import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from './SEO';
import hero1Url from '../public/images/hero1.jpg';
import hero2Url from '../public/images/hero2.jpg';
import hero3Url from '../public/images/hero3.jpg';
import logoUrl from '../public/images/logo.jpeg';
import aboutUrl from '../public/images/about.jpg';
import service1Url from '../public/images/service1.jpg';
import service2Url from '../public/images/service2.jpg';
import service3Url from '../public/images/service3.jpg';

const servicePricing = {
  single: {
    id: 'single',
    label: 'Single Card Insight',
    amount: 499,
    duration: '15 mins',
    description: 'Private booking confirmation',
    calendly: 'https://calendly.com/shivangiarora424/tarot-reading?month=2026-06'
  },
  three: {
    id: 'three',
    label: 'Three-Card Spread',
    amount: 999,
    duration: '30 mins',
    description: 'Private booking confirmation',
    calendly: 'https://calendly.com/shivangiarora424/new-meeting?month=2026-06'
  },
  deep: {
    id: 'deep',
    label: 'Deep Insight Session',
    amount: 1499,
    duration: '60 mins',
    description: 'Private booking confirmation',
    calendly: 'https://calendly.com/shivangiarora424/new-meeting-1?month=2026-06'
  },
  love: {
    id: 'love',
    label: 'Love Spell Manifestation',
    amount: 1999,
    duration: 'Instant access',
    description: 'Unlock the Love Spell Manifestation portal',
    calendly: '',
    portal: true
  },
  career: {
    id: 'career',
    label: 'Career Manifestation',
    amount: 1999,
    duration: 'Instant access',
    description: 'Unlock the Career Manifestation portal',
    calendly: '',
    portal: true
  },
  money: {
    id: 'money',
    label: 'Money Manifestation',
    amount: 1999,
    duration: 'Instant access',
    description: 'Unlock the Money Manifestation portal',
    calendly: '',
    portal: true
  }
};

const RAZORPAY_ORDER_ENDPOINT = import.meta.env.VITE_RAZORPAY_ORDER_ENDPOINT || '/create-order';
const RECORD_PAYMENT_ENDPOINT = import.meta.env.VITE_RECORD_PAYMENT_ENDPOINT || '/record-payment';

const testimonials = [
  { text: 'The reading felt so comforting and clear. I left with new confidence and a beautiful sense of calm.', author: 'Ananya, Mumbai' },
  { text: 'Beautiful, trustworthy guidance. The session was gentle and yet incredibly insightful.', author: 'Kavita, Delhi' },
  { text: 'A wonderful experience that left me feeling grounded and ready for the next chapter.', author: 'Rohan, Bangalore' },
  { text: "Such a gentle and precise reading — it touched on things I hadn't yet named. Truly healing.", author: 'Meera, Pune' },
  { text: 'Clear guidance with compassionate delivery. I felt seen and left with a grounded plan.', author: 'Ankit, Jaipur' },
  { text: 'Warm, insightful, and surprisingly accurate. The reading opened a new perspective for me.', author: 'Priya, Bengaluru' }
];

const sections = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'manifestations', label: 'Manifestations' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'schedule', label: 'Schedule' }
];

const currencyRates = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.009,
  AED: 0.044,
  AUD: 0.017,
  CAD: 0.016,
  SGD: 0.017,
  CHF: 0.011,
  JPY: 1.7,
  ARS: 1.8,
  BYN: 0.046,
  CLP: 9.5,
  CRC: 7.5,
  ZAR: 0.21,
  PHP: 0.76,
  NGN: 7.9,
  KES: 1.6,
  JMD: 1.9,
  TTD: 0.08,
  BBD: 0.02,
  BZD: 0.02
};

const localeCurrencyMap = {
  US: 'USD',
  CA: 'CAD',
  GB: 'GBP',
  AU: 'AUD',
  NZ: 'NZD',
  IN: 'INR',
  IE: 'EUR',
  ZA: 'ZAR',
  NG: 'NGN',
  KE: 'KES',
  PH: 'PHP',
  MT: 'EUR',
  CY: 'EUR',
  JM: 'JMD',
  TT: 'TTD',
  BB: 'BBD',
  BZ: 'BZD',
  DE: 'EUR',
  FR: 'EUR',
  ES: 'EUR',
  IT: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  AT: 'EUR',
  FI: 'EUR',
  CH: 'CHF',
  JP: 'JPY',
  SG: 'SGD',
  AE: 'AED',
  SA: 'AED',
  RU: 'RUB',
  BY: 'BYN',
  AR: 'ARS',
  CL: 'CLP',
  CR: 'CRC',
  CN: 'CNY'
};

const fixedPriceOverrides = {
  USD: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  EUR: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  GBP: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  CAD: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  AUD: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  NZD: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  SGD: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  CHF: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  AED: {
    single: 200,
    three: 400,
    deep: 600,
    love: 400,
    career: 400,
    money:500,
  },
  ZAR: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  ARS: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  BYN: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  CLP: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  CRC: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  JMD: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  TTD: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  BBD: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  BZD: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  RUB: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  },
  CNY: {
    single: 100,
    three: 200,
    deep: 300,
    love: 400,
    career: 400,
    money:500,
  }
};

const timezoneCurrencyMap = {
  'Asia/Kolkata': 'INR',
  'Asia/Calcutta': 'INR',
  'Asia/Dubai': 'AED',
  'Asia/Sharjah': 'AED',
  'Europe/London': 'GBP',
  'Europe/Dublin': 'EUR',
  'Europe/Paris': 'EUR',
  'Europe/Berlin': 'EUR',
  'Europe/Brussels': 'EUR',
  'Europe/Vienna': 'EUR',
  'Europe/Helsinki': 'EUR',
  'Europe/Minsk': 'BYN',
  'Europe/Moscow': 'RUB',
  'America/Toronto': 'CAD',
  'America/Vancouver': 'CAD',
  'America/Argentina/Buenos_Aires': 'ARS',
  'America/Santiago': 'CLP',
  'America/Costa_Rica': 'CRC',
  'America/Jamaica': 'JMD',
  'America/Port_of_Spain': 'TTD',
  'America/Barbados': 'BBD',
  'America/Belize': 'BZD',
  'Africa/Johannesburg': 'ZAR',
  'Africa/Nairobi': 'KES',
  'Asia/Manila': 'PHP',
  'Asia/Shanghai': 'CNY',
  'Asia/Chongqing': 'CNY',
  'Asia/Harbin': 'CNY',
  'Asia/Urumqi': 'CNY',
  'Australia/Sydney': 'AUD',
  'Australia/Melbourne': 'AUD',
  'Australia/Perth': 'AUD',
  'Pacific/Auckland': 'NZD'
};

function getCurrencyCode(locale, timeZone) {
  if (!locale && !timeZone) return 'INR';
  const parts = (locale || '').split(/[-_]/);
  const country = parts[1]?.toUpperCase() || parts[0]?.toUpperCase();
  const timeZoneCurrency = timeZone && timezoneCurrencyMap[timeZone];
  if (timeZoneCurrency) return timeZoneCurrency;
  const localeCurrency = localeCurrencyMap[country];
  if (localeCurrency) return localeCurrency;
  return 'INR';
}

const currencyMinorUnits = {
  BIF: 1,
  CLP: 1,
  DJF: 1,
  GNF: 1,
  JPY: 1,
  KMF: 1,
  KRW: 1,
  MGA: 1,
  PYG: 1,
  RWF: 1,
  UGX: 1,
  VND: 1,
  VUV: 1,
  XAF: 1,
  XOF: 1,
  XPF: 1
};

function getCurrencyMinorUnit(currencyCode) {
  return currencyMinorUnits[currencyCode] ?? 100;
}

function getDisplayAmount(serviceId, amountInr, currencyCode) {
  if (fixedPriceOverrides[currencyCode] && fixedPriceOverrides[currencyCode][serviceId] != null) {
    return fixedPriceOverrides[currencyCode][serviceId];
  }

  const rate = currencyRates[currencyCode] ?? 1;
  return amountInr * rate;
}

function formatLocalPrice(amountInr, currencyCode, locale, serviceId) {
  const converted = getDisplayAmount(serviceId, amountInr, currencyCode);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode
  }).format(converted);
}

function HomePage() {
  const [selectedService, setSelectedService] = useState('single');
  const [paymentStatus, setPaymentStatus] = useState({
    message: 'Complete payment to unlock the booking widget.',
    type: 'info'
  });
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [userCurrency, setUserCurrency] = useState('INR');
  const [userLocale, setUserLocale] = useState('en-IN');
  const [portalAccess, setPortalAccess] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('taroversePortalAccess')) || [];
    } catch {
      return [];
    }
  });
  const [portalUser, setPortalUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      return JSON.parse(localStorage.getItem('taroversePortalUser'));
    } catch {
      return null;
    }
  });
  const [portalEmail, setPortalEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const service = useMemo(() => servicePricing[selectedService], [selectedService]);
  const bookingUrl = useMemo(() => (service.portal ? '' : service.calendly), [service]);
  const isPortalService = service.portal === true;

  const updatePaymentStatus = (message, type = 'info') => {
    setPaymentStatus({ message, type });
  };

  const handleNavLinkClick = () => {
    if (typeof window === 'undefined' || window.innerWidth >= 992) return;

    const navbarCollapse = document.getElementById('navbarNav');
    const navbarToggler = document.querySelector('.navbar-toggler');

    if (!navbarCollapse || !navbarToggler) return;

    navbarCollapse.classList.remove('show');
    navbarToggler.classList.add('collapsed');
    navbarToggler.setAttribute('aria-expanded', 'false');
  };

  useEffect(() => {
    if (paymentCompleted && bookingUrl && window.Calendly && typeof window.Calendly.initInlineWidget === 'function') {
      const widgetContainer = document.getElementById('calendlyInlineWidget');
      if (widgetContainer) {
        widgetContainer.innerHTML = '';
        window.Calendly.initInlineWidget({ url: bookingUrl, parentElement: widgetContainer });
      }
    }
  }, [paymentCompleted, bookingUrl]);

  useEffect(() => {
    const locale = navigator.language || 'en-IN';
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    setUserLocale(locale);
    setUserCurrency(getCurrencyCode(locale, timeZone));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const adminParam = params.get('admin');

    if (adminParam === 'true') {
      localStorage.setItem('taroverseAdmin', 'true');
      setIsAdmin(true);
    } else if (adminParam === 'false' || adminParam === 'logout') {
      localStorage.removeItem('taroverseAdmin');
      setIsAdmin(false);
    } else {
      setIsAdmin(localStorage.getItem('taroverseAdmin') === 'true');
    }

    if (params.get('payment') === 'success') {
      setPaymentCompleted(true);
      updatePaymentStatus('Payment confirmed. Your booking window is now unlocked.', 'success');
    }
  }, []);

  useEffect(() => {
    const animatedElements = document.querySelectorAll('.animate-slideUp, .animate-fadeIn, .animate-zoomIn');
    animatedElements.forEach((el) => el.classList.add('in-view'));
  }, []);

  const handleServiceCardClick = (serviceId) => {
    setSelectedService(serviceId);
    const scheduleSection = document.getElementById('schedule');
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleManifestationClick = (videoId) => {
    if (portalAccess.includes(videoId)) {
      window.location.href = `/portal?video=${videoId}`;
      return;
    }

    setSelectedService(videoId);
    const scheduleSection = document.getElementById('schedule');
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExportPayments = () => {
    const month = new Date().toISOString().slice(0, 7);
    const exportUrl = `/export-payments?month=${month}`;
    const anchor = document.createElement('a');
    anchor.href = exportUrl;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handlePayment = async () => {
    if (!bookingUrl && !service.portal) {
      updatePaymentStatus('Booking URL is not configured. Please choose a service.', 'error');
      return;
    }

    if (service.portal && !portalEmail) {
      updatePaymentStatus('Please provide an email to receive your portal password.', 'error');
      return;
    }

    updatePaymentStatus('Creating Razorpay order... please wait.', 'info');

    try {
      const orderAmount = Math.round(service.amount * 100);
      const response = await fetch(RAZORPAY_ORDER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: orderAmount,
          currency: 'INR',
          service: service.label,
          duration: service.duration,
          receipt: `taroverse-${service.id}-${Date.now()}`
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Unable to create a Razorpay order right now.');
      }

      const checkout = await response.json();
      if (!checkout?.order?.id || !checkout?.keyId) {
        throw new Error('Razorpay order did not return the required payment details.');
      }

      if (!window.Razorpay) {
        throw new Error('Razorpay script is not available right now.');
      }

      const recordPayment = async (paymentResponse) => {
        try {
          const recordResponse = await fetch(RECORD_PAYMENT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId: paymentResponse.razorpay_payment_id,
              orderId: paymentResponse.razorpay_order_id,
              service: service.label,
              serviceId: service.id,
              duration: service.duration,
              amount: service.amount,
              currency: 'INR',
              receipt: checkout.order.receipt || '',
              email: service.portal ? portalEmail : ''
            })
          });

          if (!recordResponse.ok) {
            const recordErrorText = await recordResponse.text();
            console.error('Failed to record payment:', recordErrorText);
            return null;
          }

          const recordResult = await recordResponse.json();
          if (recordResult.user) {
            const updatedAccess = Array.from(new Set([...portalAccess, service.id]));
            localStorage.setItem('taroversePortalAccess', JSON.stringify(updatedAccess));
            localStorage.setItem('taroversePortalUser', JSON.stringify(recordResult.user));
            setPortalAccess(updatedAccess);
            setPortalUser(recordResult.user);
          }

          return recordResult;
        } catch (recordError) {
          console.error('Failed to record payment:', recordError);
          return null;
        }
      };

      const options = {
        key: checkout.keyId,
        amount: checkout.order.amount,
        currency: checkout.order.currency,
        name: 'TaroVerse Readings',
        description: `${service.label} • ${service.duration}`,
        order_id: checkout.order.id,
        handler: async (response) => {
          setPaymentCompleted(true);
          updatePaymentStatus('Payment confirmed. Your booking window is now unlocked.', 'success');
          const recordResult = await recordPayment(response);
          if (service.portal) {
            const portalUrl = `/portal?video=${service.id}`;
            window.location.href = portalUrl;
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#e9d5b3'
        },
        modal: {
          ondismiss: () => {
            updatePaymentStatus('Payment was not completed. Please try again.', 'info');
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      updatePaymentStatus(error.message || 'Payment failed. Please try again.', 'error');
    }
  };

  return (
    <div className="app-root">
      <SEO
        title="TaroVerse Readings | Online Tarot Readings & Tarot Booking in India"
        description="Book online tarot readings in India with TaroVerse Readings. Discover calm, intuitive tarot sessions, guided insights, and easy booking for seekers."
        canonicalPath="/"
        ogImage="/images/hero1.jpg"
      />
      <header className="hero-section text-white text-center d-flex align-items-center justify-content-center" id="home">
        <div className="overlay" />
        <div className="container position-relative hero-content">
          <p className="eyebrow">Soulful guidance • Calm clarity • Trusted readings</p>
          <h1 className="display-4 fw-bold">TaroVerse Readings</h1>
          <p className="lead mx-auto mt-3">Discover your path with gentle tarot insight, sacred symbols, and a peaceful vibe designed to soothe your spirit.</p>
          <div className="hero-buttons mt-4">
            <a href="#services" className="btn btn-light btn-lg me-3">Explore Services</a>
            <a href="#schedule" className="btn btn-outline-light btn-lg">Book a Reading</a>
          </div>
          <div className="hero-image-grid d-none d-lg-flex">
            <img src={hero1Url} alt="Tarot spread" decoding="async" loading="eager" fetchPriority="high" />
            <img src={hero2Url} alt="Mystic cards" decoding="async" loading="eager" fetchPriority="high" />
            <img src={hero3Url} alt="Crystal tarot ritual" decoding="async" loading="eager" fetchPriority="high" />
          </div>
        </div>
      </header>

      <nav className="navbar navbar-expand-lg navbar-dark sticky-top py-3 shadow-sm" id="mainNav">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center fw-semibold" href="#home">
            <img src={logoUrl} alt="TaroVerse Readings" className="nav-logo me-2" decoding="async" loading="eager" fetchPriority="high" />
            <span>TaroVerse Readings</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {sections.map((section) => (
                <li className="nav-item" key={section.id}>
                  <a className="nav-link" href={`#${section.id}`} onClick={handleNavLinkClick}>{section.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <main>
        {/* <section id="first100" className="special-offer py-5">
          <div className="container text-center">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="offer-banner rounded-4 p-4 shadow-lg">
                  <h2 className="mb-2">First 100 Customers — Special Launch Pricing</h2>
                  <p className="mb-4 lead text-muted">Limited-time prices for the first 100 bookings. Secure your spot and receive a calm, focused reading.</p>
                  <div className="d-flex flex-column align-items-stretch gap-3 justify-content-center offer-cards">
                    {Object.values(servicePricing).map((serviceItem) => (
                      <div className="offer-card p-3 rounded-3 text-center" key={serviceItem.label}>
                        <div className="offer-title">{serviceItem.label}</div>
                        <div className="offer-price">{formatLocalPrice(serviceItem.amount, userCurrency, userLocale, serviceItem.id)}</div>
                        <div className="offer-duration">{serviceItem.duration}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <a href="#schedule" className="btn btn-primary btn-lg">Claim Offer</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        <section className="section section-light" id="about">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <div className="content-card p-5 shadow-sm rounded-4 animate-slideUp">
                  <span className="section-label">Welcome</span>
                  <h2>Trusted tarot guidance for clarity, connection, and your next chapter</h2>
                  <p className="mt-3">Our readings blend intuition, tarot symbolism, and compassion. Each session is crafted to help you feel heard, grounded, and confident in your next step.</p>
                  <ul className="list-unstyled mt-4">
                    <li className="mb-4 d-flex gap-3">
                      <i className="fas fa-sync-alt" style={{ fontSize: '1.8rem', color: '#c3974a', flexShrink: 0, marginTop: '0.2rem' }} />
                      <div><strong>Energy Exchange:</strong> Every tarot reading is a two-way exchange of energy, allowing intuitive messages to come through specifically for you.</div>
                    </li>
                    <li className="mb-4 d-flex gap-3">
                      <i className="fas fa-sun" style={{ fontSize: '1.8rem', color: '#c3974a', flexShrink: 0, marginTop: '0.2rem' }} />
                      <div><strong>Clarity Over Fear:</strong> Honest guidance that empowers your choices instead of creating dependency.</div>
                    </li>
                    <li className="d-flex gap-3">
                      <i className="fas fa-heart" style={{ fontSize: '1.8rem', color: '#c3974a', flexShrink: 0, marginTop: '0.2rem' }} />
                      <div><strong>Personal & Intuitive:</strong> Every session is unique because every person's energy, questions, and journey are different.</div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="image-frame rounded-4 overflow-hidden shadow-lg animate-fadeIn">
                  <img src={aboutUrl} alt="Tarot cards and crystals" decoding="async" loading="eager" fetchPriority="high" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-dark text-white" id="services">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-label">Services</span>
              <h2>Choose Your Reading</h2>
            </div>
            <div className="divine-numbers" aria-hidden="true">
              <span className="divine-number" style={{ '--x': '14%', '--y': '16%', '--delay': '0s' }}>11:11</span>
              <span className="divine-number" style={{ '--x': '86%', '--y': '18%', '--delay': '1.1s' }}>777</span>
              <span className="divine-number" style={{ '--x': '52%', '--y': '76%', '--delay': '0.6s' }}>222</span>
            </div>
            <div className="row g-4">
              {Object.values(servicePricing)
                .filter((serviceItem) => !serviceItem.portal)
                .map((serviceItem) => (
                  <div className="col-md-6 col-lg-4" key={serviceItem.label}>
                    <div
                      className="service-card rounded-4 p-4 h-100 shadow animate-zoomIn d-flex flex-column"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleServiceCardClick(serviceItem.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleServiceCardClick(serviceItem.id);
                        }
                      }}
                    >
                      <img src={serviceItem.id === 'single' ? service1Url : serviceItem.id === 'three' ? service2Url : service3Url} alt={serviceItem.label} className="service-image rounded-4 mb-3" decoding="async" loading="lazy" />
                      <h3>{serviceItem.label}</h3>
                      <p>{serviceItem.id === 'single' ? 'Receive a clear yes, no, or “not yet” answer to one specific question.' : serviceItem.id === 'three' ? 'Gain clarity by exploring the past, present, and likely path ahead.' : 'A personalized tarot session to explore recurring patterns, relationships, and life purpose.'}</p>
                      <div className="pricing-badge mt-auto" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <p className="mb-1" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}><strong>{formatLocalPrice(serviceItem.amount, userCurrency, userLocale, serviceItem.id)}</strong> • {serviceItem.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
          <section className="section section-dark text-white" id="manifestations">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-label">Manifestations</span>
              <h2>Unlock Your Manifestation Portal</h2>
              <p className="mx-auto lead" style={{ maxWidth: '720px' }}>Choose a guided manifestation journey and pay once to unlock lifetime re-entry with your portal credentials.</p>
            </div>
            <div className="row g-4 justify-content-center">
              {Object.values(servicePricing)
                .filter((serviceItem) => serviceItem.portal)
                .map((serviceItem) => (
                  <div className="col-lg-4 col-md-6" key={serviceItem.id}>
                    <div className="manifestation-card rounded-4 p-4 shadow animate-zoomIn h-100 d-flex flex-column">
                      <h3>{serviceItem.label}</h3>
                      <p>{serviceItem.description}</p>
                      <div className="mt-3 mb-4">
                        <strong>{formatLocalPrice(serviceItem.amount, userCurrency, userLocale, serviceItem.id)}</strong> • {serviceItem.duration}
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-light mt-auto"
                        onClick={() => handleManifestationClick(serviceItem.id)}
                      >
                        {portalAccess.includes(serviceItem.id) ? 'Enter portal' : 'Pay to unlock'}
                      </button>
                      {portalAccess.includes(serviceItem.id) && (
                        <p className="mt-3 small text-white-50">You already have access. Open the portal or use your stored credentials later.</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        
        <section className="section" id="schedule">
          <div className="container">
            <div className="row align-items-start">
              <div className="col-lg-5 mb-5 mb-lg-0 d-flex flex-column">
                <div className="schedule-copy">
                  <span className="section-label">Book now</span>
                  <h2>Reserve your tarot session</h2>
                  <p className="lead mt-3">Use the Calendly widget to schedule a time that suits you. Each booking is private, secure, and easy to complete.</p>
                  <ul className="list-unstyled mt-4">
                    <li className="mb-3"><strong>Instant confirmation</strong> for your chosen time slot.</li>
                    <li className="mb-3"><strong>Clear session details</strong> and reminder notifications.</li>
                    <li><strong>Warm, trust-based experience</strong> from first click to finished reading.</li>
                  </ul>
                </div>
                <div className="schedule-note rounded-4 p-4 mt-auto">
                  <p className="mb-1"><strong>Need help before booking?</strong> Choose a service, pay safely, and your live scheduling window opens instantly.</p>
                  <p className="mb-0 small text-white-50">No refunds once payment is completed. If you face any payment issue, email <a href="mailto:taroverse.readings@gmail.com" className="text-white">taroverse.readings@gmail.com</a>.</p>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="booking-payment-card rounded-4 shadow-lg p-4 mb-4">
                  <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
                    <div>
                      <h3 className="h5 mb-1">Secure your slot</h3>
                      <p className="mb-0 text-white-50">Pay before your Calendly booking is unlocked.</p>
                    </div>
                    <span className="payment-pill">Razorpay</span>
                  </div>

                  <label className="form-label" htmlFor="booking-service">Choose a session</label>
                  <select id="booking-service" className="form-select mb-3" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                    {Object.values(servicePricing).map((serviceItem) => (
                      <option key={serviceItem.id} value={serviceItem.id}>
                        {serviceItem.label}
                      </option>
                    ))}
                  </select>

                  {service.portal && (
                    <div className="mb-3">
                      <label className="form-label" htmlFor="portal-email">Email for portal access</label>
                      <input id="portal-email" type="email" className="form-control" placeholder="you@example.com" value={portalEmail} onChange={(e) => setPortalEmail(e.target.value)} />
                      <div className="form-text">We will email a one-time password to this address to access your portal on a single device.</div>
                    </div>
                  )}

                    <div className="d-flex justify-content-between mb-2">
                      <span>Amount</span>
                      <strong>{formatLocalPrice(service.amount, userCurrency, userLocale, service.id)}</strong>
                    </div>
                    <div className="booking-meta-row mb-3">
                      <span className="booking-meta-label">Includes</span>
                      <span className="booking-meta-value">{service.duration} • {service.description}</span>
                    </div>

                    <button type="button" className="btn btn-primary w-100" onClick={handlePayment}>
                      {service.portal ? 'Pay to unlock portal' : 'Pay & unlock booking'}
                    </button>
                      {isAdmin && (
                      <button type="button" className="btn btn-outline-light w-100 mt-3" onClick={handleExportPayments}>
                        Download current month report
                      </button>
                    )}
                    {service.portal && portalAccess.includes(service.id) && (
                      <a href={`/portal?video=${service.id}`} className="btn btn-outline-light w-100 mt-3">Go to your manifestation portal</a>
                    )}
                    <div className={`payment-status mt-3 ${paymentStatus.type}`}>{paymentStatus.message}</div>
                  <p className="text-white-50 small mt-3 mb-0">No refunds once payment is completed. If you face any payment issue, email <a href="mailto:taroverse.readings@gmail.com" className="text-white">taroverse.readings@gmail.com</a>.</p>
                </div>

                {service.portal ? (
                  <div className="portal-placeholder rounded-4 shadow-lg p-4">
                    <div className="text-white mb-2">This service opens the manifestation portal in a new page. Complete payment to receive portal credentials via email and access on a single device.</div>
                    {!portalAccess.includes(service.id) && (
                      <div className="p-3 text-white-50" style={{ minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ margin: 0 }}>🔒 Complete payment above to unlock the portal. After payment you'll be redirected and emailed credentials.</p>
                      </div>
                    )}
                    {portalAccess.includes(service.id) && (
                      <div className="d-flex gap-2">
                        <a href={`/portal?video=${service.id}`} className="btn btn-outline-light">Open portal</a>
                        <a href={`/portal?video=${service.id}`} className="btn btn-light">Open in new tab</a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="calendly-widget rounded-4 shadow-lg overflow-hidden">
                    <div className="text-white mb-3">{paymentCompleted ? 'Your booking widget is ready. Please choose a slot below.' : '🔒 Complete payment above to unlock booking. Select a service and pay to see available slots.'}</div>
                    <div className="calendly-inline-widget" id="calendlyInlineWidget" style={{ minWidth: '320px' }}>
                      {!paymentCompleted && (
                        <div className="p-4 text-center text-white" style={{ minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <p style={{ fontSize: '1.1rem', color: '#ddd', margin: 0 }}>🔒 Booking widget will appear after payment</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

      

        <section className="section section-dark text-white" id="testimonials">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-label">Testimonials</span>
              <h2>What clients feel after a reading</h2>
            </div>
            <div className="divine-numbers" aria-hidden="true">
              <span className="divine-number" style={{ '--x': '22%', '--y': '22%', '--delay': '0.3s' }}>444</span>
              <span className="divine-number" style={{ '--x': '74%', '--y': '18%', '--delay': '1.4s' }}>999</span>
              <span className="divine-number" style={{ '--x': '34%', '--y': '72%', '--delay': '0.9s' }}>333</span>
            </div>
            <div className="testimonial-slider">
              {testimonials.map((item, index) => (
                <div className={`testimonial-card rounded-4 p-4 shadow animate-zoomIn delay-${index}`} key={item.author}>
                  <p>{item.text}</p>
                  <div className="testimonial-author">— {item.author}</div>
                </div>
              ))}
            </div>
            <div className="testimonial-swipe-hint d-md-none mt-3" aria-label="Swipe to see more testimonials">
              <span className="testimonial-swipe-icon" aria-hidden="true">↔</span>
              <span>Swipe to see more</span>
            </div>
          </div>
        </section>

        <section className="section section-light" id="contact">
          <div className="container text-center">
            <span className="section-label">Connect</span>
            <h2>Need a custom reading or more information?</h2>
            <p className="mx-auto lead mt-3" style={{ maxWidth: '700px' }}>Send a message and we’ll reply with supportive details about the session, tarot styles, and how to prepare.</p>
            <a href="mailto:taroverse.readings@gmail.com" className="btn btn-primary btn-lg mt-4">Email Us</a>
          </div>
        </section>
      </main>

      <div className="social-sidebar d-none d-lg-flex flex-column align-items-center gap-3" aria-label="Social media links">
        {[
          { icon: 'fab fa-instagram', href: 'https://www.instagram.com/taroverse.readings' },
          { icon: 'fab fa-linkedin-in', href: 'https://www.linkedin.com/company/taroverse-readings' },
          { icon: 'fab fa-facebook-f', href: 'https://www.facebook.com/taroverse.readings' },
          { icon: 'x', href: 'https://x.com/taroverse5' },
          { icon: 'fab fa-youtube', href: 'https://www.youtube.com/@TaroVerse.readings' }
        ].map((item) => (
          <a key={item.href} className={`social-icon ${item.icon === 'x' ? 'x-twitter' : item.icon.split(' ')[1].replace('fa-', '')}`} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.icon === 'x' ? 'X' : item.icon}>
            {item.icon === 'x' ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.9 2H22l-6.8 7.8L23.3 22h-5.7l-4.5-5.9L7.7 22H4.6l7.2-8.2L.7 2h5.8l4.1 5.4L18.9 2Zm-1 18h1.1L6.2 4H5L17.9 20Z" fill="currentColor" />
              </svg>
            ) : (
              <i className={item.icon} />
            )}
          </a>
        ))}
      </div>

      <footer className="footer py-4 text-center text-muted">
        <div className="container">
          <p className="mb-1">TaroVerse Readings • <Link to="/privacy" className="text-muted">Privacy</Link> • <Link to="/terms" className="text-muted">Terms</Link></p>
          <div className="footer-social d-flex justify-content-center align-items-center gap-3 mb-2">
            {[
              { icon: 'fab fa-instagram', href: 'https://www.instagram.com/taroverse.readings' },
              { icon: 'fab fa-linkedin-in', href: 'https://www.linkedin.com/company/taroverse-readings/' },
              { icon: 'fab fa-facebook-f', href: 'https://www.facebook.com/taroverse.readings' },
              { icon: 'x', href: 'https://x.com/taroverse5' },
              { icon: 'fab fa-youtube', href: 'https://www.youtube.com/@TaroVerse.readings' }
            ].map((item) => (
              <a key={item.href} className={`social-icon ${item.icon === 'x' ? 'x-twitter' : item.icon.split(' ')[1].replace('fa-', '')}`} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.icon === 'x' ? 'X' : item.icon}>
                {item.icon === 'x' ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="fa-lg">
                    <path d="M18.9 2H22l-6.8 7.8L23.3 22h-5.7l-4.5-5.9L7.7 22H4.6l7.2-8.2L.7 2h5.8l4.1 5.4L18.9 2Zm-1 18h1.1L6.2 4H5L17.9 20Z" fill="currentColor" />
                  </svg>
                ) : (
                  <i className={item.icon + ' fa-lg'} />
                )}
              </a>
            ))}
          </div>
          <p className="mb-1 small">No refunds once payment is completed. Email <a href="mailto:taroverse.readings@gmail.com" className="text-muted">taroverse.readings@gmail.com</a> if you face any payment issue.</p>
          <small>Designed for calm clarity and responsive mobile use.</small>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
