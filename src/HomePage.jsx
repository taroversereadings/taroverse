import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from './SEO';

const servicePricing = {
  single: {
    label: 'Single Card Insight',
    amount: 199,
    duration: '15 mins',
    description: 'Private booking confirmation',
    calendly: 'https://calendly.com/shivangiarora424/tarot-reading?month=2026-06'
  },
  three: {
    label: 'Three-Card Spread',
    amount: 599,
    duration: '30 mins',
    description: 'Private booking confirmation',
    calendly: 'https://calendly.com/shivangiarora424/new-meeting?month=2026-06'
  },
  deep: {
    label: 'Deep Insight Session',
    amount: 1499,
    duration: '60 mins',
    description: 'Private booking confirmation',
    calendly: 'https://calendly.com/shivangiarora424/new-meeting-1?month=2026-06'
  }
};

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
const RAZORPAY_ORDER_ENDPOINT = import.meta.env.VITE_RAZORPAY_ORDER_ENDPOINT || '/create-order';

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
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'schedule', label: 'Schedule' }
];

function HomePage() {
  const [selectedService, setSelectedService] = useState('single');
  const [paymentStatus, setPaymentStatus] = useState({
    message: 'Complete payment to unlock the booking widget.',
    type: 'info'
  });
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const service = useMemo(() => servicePricing[selectedService], [selectedService]);
  const bookingUrl = useMemo(() => service.calendly, [service]);

  const updatePaymentStatus = (message, type = 'info') => {
    setPaymentStatus({ message, type });
  };

  useEffect(() => {
    if (paymentCompleted && window.Calendly && typeof window.Calendly.initInlineWidget === 'function') {
      const widgetContainer = document.getElementById('calendlyInlineWidget');
      if (widgetContainer) {
        widgetContainer.innerHTML = '';
        window.Calendly.initInlineWidget({ url: bookingUrl, parentElement: widgetContainer });
      }
    }
  }, [paymentCompleted, bookingUrl]);

  useEffect(() => {
    const animatedElements = document.querySelectorAll('.animate-slideUp, .animate-fadeIn, .animate-zoomIn');
    animatedElements.forEach((el) => el.classList.add('in-view'));
  }, []);

  const handlePayment = async () => {
    if (!bookingUrl) {
      updatePaymentStatus('Booking URL is not configured. Please choose a service.', 'error');
      return;
    }

    if (!RAZORPAY_KEY_ID) {
      updatePaymentStatus('Razorpay key is not configured. Set VITE_RAZORPAY_KEY_ID in .env and restart the app.', 'error');
      return;
    }

    if (!window.Razorpay) {
      updatePaymentStatus('Razorpay checkout is not available in this browser. Please try again later.', 'error');
      return;
    }

    updatePaymentStatus('Creating Razorpay order... please wait.', 'info');

    try {
      const response = await fetch(RAZORPAY_ORDER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: service.amount * 100,
          currency: 'INR',
          receipt: `taro-${Date.now()}`,
          notes: {
            service: service.label,
            duration: service.duration
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Unable to create Razorpay order right now.');
      }

      const order = await response.json();
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || 'INR',
        order_id: order.id,
        name: 'TaroVerse Readings',
        description: `${service.label} booking`,
        handler: () => {
          setPaymentCompleted(true);
          updatePaymentStatus(`Payment confirmed for ${service.label}. Your booking window is now unlocked.`, 'success');
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: { color: '#c38a3f' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      updatePaymentStatus(error.message || 'Payment failed. Please try again.', 'error');
    }
  };

  return (
    <div className="app-root">
      <SEO
        title="TaroVerse Readings — Tarot booking, live readings, and guided insight"
        description="Book tarot readings, explore soul-care sessions, and unlock a calm booking experience with TaroVerse Readings. Secure checkout and guided tarot insights for seekers in India."
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
            <img src="/images/hero1.jpg" alt="Tarot spread" decoding="async" />
            <img src="/images/hero2.jpg" alt="Mystic cards" decoding="async" />
            <img src="/images/hero3.jpg" alt="Crystal tarot ritual" decoding="async" />
          </div>
        </div>
      </header>

      <nav className="navbar navbar-expand-lg navbar-dark sticky-top py-3 shadow-sm" id="mainNav">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center fw-semibold" href="#home">
            <img src="/images/logo.jpeg" alt="TaroVerse Readings" className="nav-logo me-2" />
            <span>TaroVerse Readings</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="#navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {sections.map((section) => (
                <li className="nav-item" key={section.id}>
                  <a className="nav-link" href={`#${section.id}`}>{section.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <main>
        <section id="first100" className="special-offer py-5">
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
                        <div className="offer-price">₹{serviceItem.amount}</div>
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
        </section>

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
                      <i className="fas fa-sync-alt" style={{ fontSize: '1.8rem', color: '#e9d5b3', flexShrink: 0, marginTop: '0.2rem' }} />
                      <div><strong>Energy Exchange:</strong> Every tarot reading is a two-way exchange of energy, allowing intuitive messages to come through specifically for you.</div>
                    </li>
                    <li className="mb-4 d-flex gap-3">
                      <i className="fas fa-sun" style={{ fontSize: '1.8rem', color: '#e9d5b3', flexShrink: 0, marginTop: '0.2rem' }} />
                      <div><strong>Clarity Over Fear:</strong> Honest guidance that empowers your choices instead of creating dependency.</div>
                    </li>
                    <li className="d-flex gap-3">
                      <i className="fas fa-heart" style={{ fontSize: '1.8rem', color: '#e9d5b3', flexShrink: 0, marginTop: '0.2rem' }} />
                      <div><strong>Personal & Intuitive:</strong> Every session is unique because every person's energy, questions, and journey are different.</div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="image-frame rounded-4 overflow-hidden shadow-lg animate-fadeIn">
                  <img src="/images/about.jpg" alt="Tarot cards and crystals" decoding="async" loading="lazy" />
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
              {Object.values(servicePricing).map((serviceItem) => (
                <div className="col-md-6 col-lg-4" key={serviceItem.label}>
                  <div className="service-card rounded-4 p-4 h-100 shadow animate-zoomIn d-flex flex-column">
                    <img src={`/images/service${serviceItem.amount === 199 ? '1' : serviceItem.amount === 599 ? '2' : '3'}.jpg`} alt={serviceItem.label} className="service-image rounded-4 mb-3" decoding="async" loading="lazy" />
                    <h3>{serviceItem.label}</h3>
                    <p>{serviceItem.amount === 199 ? 'Receive a clear yes, no, or “not yet” answer to one specific question.' : serviceItem.amount === 599 ? 'Gain clarity by exploring the past, present, and likely path ahead.' : 'A personalized tarot session to explore recurring patterns, relationships, and life purpose.'}</p>
                    <div className="pricing-badge mt-auto" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <p className="mb-1" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}><strong>₹{serviceItem.amount}</strong> • {serviceItem.duration}</p>
                    </div>
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
                    <option value="single">Single Card Insight</option>
                    <option value="three">Three-Card Spread</option>
                    <option value="deep">Deep Insight Session</option>
                  </select>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Amount</span>
                    <strong>₹{service.amount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Includes</span>
                    <span>{service.duration} • {service.description}</span>
                  </div>

                  <button type="button" className="btn btn-primary w-100" onClick={handlePayment}>Pay & unlock booking</button>
                  <div className={`payment-status mt-3 ${paymentStatus.type}`}>{paymentStatus.message}</div>
                  <p className="text-white-50 small mt-3 mb-0">No refunds once payment is completed. If you face any payment issue, email <a href="mailto:taroverse.readings@gmail.com" className="text-white">taroverse.readings@gmail.com</a>.</p>
                </div>

                <div className="calendly-widget rounded-4 shadow-lg overflow-hidden">
                  <div className="text-white mb-3">{paymentCompleted ? 'Your booking widget is ready. Please choose a slot below.' : '🔒 Complete payment above to unlock booking. Select a service and pay to see available slots.'}</div>
                  <div className="calendly-inline-widget" id="calendlyInlineWidget" style={{ minWidth: '320px', height: '650px' }}>
                    {!paymentCompleted && (
                      <div className="p-4 text-center text-white">
                        <p style={{ fontSize: '1.1rem', color: '#ddd' }}>🔒 Booking widget will appear after payment</p>
                      </div>
                    )}
                  </div>
                </div>
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
          { icon: 'fab fa-youtube', href: 'https://www.youtube.com/@taroverse' }
        ].map((item) => (
          <a key={item.href} className={`social-icon ${item.icon.split(' ')[1].replace('fa-', '')}`} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.icon}>
            <i className={item.icon} />
          </a>
        ))}
      </div>

      <footer className="footer py-4 text-center text-muted">
        <div className="container">
          <p className="mb-1">TaroVerse Readings • <Link to="/privacy" className="text-muted">Privacy</Link> • <Link to="/terms" className="text-muted">Terms</Link></p>
          <div className="footer-social d-flex justify-content-center align-items-center gap-3 mb-2">
            {[
              { icon: 'fab fa-instagram', href: 'https://www.instagram.com/taroverse.readings' },
              { icon: 'fab fa-linkedin-in', href: 'https://www.linkedin.com/company/taroverse-readings' },
              { icon: 'fab fa-facebook-f', href: 'https://www.facebook.com/taroverse.readings' },
              { icon: 'fab fa-youtube', href: 'https://www.youtube.com/@taroverse' }
            ].map((item) => (
              <a key={item.href} className={`social-icon ${item.icon.split(' ')[1].replace('fa-', '')}`} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.icon}>
                <i className={item.icon + ' fa-lg'} />
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
