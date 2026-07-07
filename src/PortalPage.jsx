import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from './SEO';

const portalVideos = {
  love: {
    title: 'Love Spell Manifestation',
    description: 'Breathe into a gentle love manifestation session with guided imagery and soothing intention setting.',
    videoUrl: 'https://www.youtube.com/embed/3h2D8Q8N3Cc'
  },
  career: {
    title: 'Career Manifestation Journey',
    description: 'Open the pathway to career clarity with a calming, confidence-building manifestation practice.',
    videoUrl: 'https://www.youtube.com/embed/LkK6bE-yUF4'
  },
  money: {
    title: 'Money Manifestation Journey',
    description: 'Step into a grounded abundance ritual with calm guidance, self-worth affirmations, and graceful money mindset support.',
    videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4'
  }
};

function PortalPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [portalUser, setPortalUser] = useState(null);
  const [paymentIdInput, setPaymentIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [validated, setValidated] = useState(false);

  function getDeviceId() {
    try {
      const raw = `${navigator.userAgent}|${navigator.platform}|${navigator.hardwareConcurrency || ''}`;
      return btoa(raw).slice(0, 64);
    } catch (e) {
      return 'unknown-device';
    }
  }

  useEffect(() => {
    const existingUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('taroversePortalUser') || 'null') : null;
    const queryPaymentId = searchParams.get('paymentId');
    const queryToken = searchParams.get('token');
    const storedPaymentId = existingUser?.paymentId;
    const storedToken = existingUser?.portalToken;
    const requestedVideo = searchParams.get('video');

    // Dev test bypass: open portal UI without validation using ?test=true
    if (searchParams.get('test') === 'true') {
      const vid = requestedVideo || 'love';
      const testUser = {
        serviceId: vid,
        paymentId: 'TEST-PAYMENT',
        portalToken: 'TEST-TOKEN',
        createdAt: new Date().toISOString(),
        deviceId: 'test-device'
      };
      setPortalUser(testUser);
      setValidated(true);
      setLoading(false);
      return;
    }

    async function validateUser() {
      const deviceId = typeof window !== 'undefined' ? getDeviceId() : null;

      if (queryPaymentId && queryToken) {
        try {
          const response = await fetch('/validate-portal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId: queryPaymentId, portalToken: queryToken, deviceId })
          });
          const result = await response.json();
          if (response.ok && result.success) {
            setPortalUser(result.user);
            setValidated(true);
          } else {
            // allow login form if validation fails
            setLoginError(result.error || 'Unable to validate your portal credentials.');
          }
        } catch (fetchError) {
          setLoginError('Unable to validate portal access at the moment.');
        }
      } else if (storedPaymentId && storedToken) {
        // try server validation using stored values and device id
        try {
          const response = await fetch('/validate-portal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId: storedPaymentId, portalToken: storedToken, deviceId })
          });
          const result = await response.json();
          if (response.ok && result.success) {
            setPortalUser(result.user);
            setValidated(true);
          } else {
            // show login form
            setLoginError('Please log in with the password sent to your email.');
          }
        } catch (e) {
          setLoginError('Unable to validate portal access at the moment.');
        }
      } else {
        // no existing credentials — show login form
        setLoginError('Enter the Payment ID and password emailed to you to unlock your portal.');
      }

      setLoading(false);
    }

    validateUser();
  }, [searchParams]);

  const activeVideoId = searchParams.get('video') || portalUser?.serviceId;
  const activeVideo = portalVideos[activeVideoId] || portalVideos.love;
  const isTestMode = searchParams.get('test') === 'true';
  const isLove = activeVideoId === 'love';
  const isMoney = activeVideoId === 'money';
  const activeVariant = isLove ? 'love' : isMoney ? 'money' : 'career';
  const serviceLabel = portalUser?.serviceId === 'career'
    ? 'Career Manifestation'
    : portalUser?.serviceId === 'money'
      ? 'Money Manifestation'
      : 'Love Spell Manifestation';
  const debugFallbackVideo = 'https://www.youtube.com/watch?v=Cb6wuzOurPc&list=RDCb6wuzOurPc&start_radio=1';

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      const deviceId = getDeviceId();
      const response = await fetch('/portal-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: paymentIdInput, password: passwordInput, deviceId })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        localStorage.setItem('taroversePortalUser', JSON.stringify(result.user));
        setPortalUser(result.user);
        setValidated(true);
      } else {
        setLoginError(result.error || 'Login failed.');
      }
    } catch (err) {
      setLoginError('Unable to contact server.');
    }
    setLoading(false);
  }

  return (
    <div className={`app-root portal-page ${activeVariant === 'love' ? 'love-active' : ''} ${activeVariant === 'career' ? 'career-active' : ''} ${activeVariant === 'money' ? 'money-active' : ''}`}>
      <div className={`portal-page-ambient ${activeVariant}`} aria-hidden="true">
        {activeVariant === 'love' && (
          <div className="ambient-particles ambient-flowers">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                className={`ambient-flower f-${i}`}
                style={{ left: `${3 + (i % 12) * 8}%`, animationDelay: `${i * 0.14}s` }}
              >
                🌸
              </span>
            ))}
          </div>
        )}
        {activeVariant === 'career' && (
          <div className="ambient-particles ambient-sparkles">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className={`ambient-sparkle s-${i}`}
                style={{ left: `${4 + (i % 10) * 9}%`, animationDelay: `${i * 0.12}s` }}
              >
                {i % 3 === 0 ? '⭐' : i % 3 === 1 ? '💫' : '🌟'}
              </span>
            ))}
          </div>
        )}
        {activeVariant === 'money' && (
          <div className="ambient-particles ambient-coins">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className={`ambient-coin c-${i}`}
                style={{ left: `${4 + (i % 10) * 9}%`, animationDelay: `${i * 0.13}s` }}
              >
                💰
              </span>
            ))}
          </div>
        )}
      </div>
      <SEO
        title="Manifestation Portal | TaroVerse"
        description="Access your unlocked manifestation portal for love and career guidance. Re-enter with saved portal credentials anytime."
        canonicalPath="/portal"
      />
      <header className={`portal-header text-center py-5 ${activeVariant === 'love' ? 'love-active' : ''} ${activeVariant === 'career' ? 'career-active' : ''} ${activeVariant === 'money' ? 'money-active' : ''}`}>
        <div className="container">
          <span className="section-label">Manifestation Portal</span>
          <h1>{activeVideo.title}</h1>
          <p className="lead mx-auto mt-3" style={{ maxWidth: '720px' }}>{activeVideo.description}</p>
          {/* Portal overlays */}
          {activeVideoId === 'love' && (
            <>
              <div className="love-lines" aria-hidden="true" />
              <div className="flower-shower" aria-hidden="true">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span key={i} className={`flower f-${i}`}>🌸</span>
                ))}
              </div>
              <div className="love-banner" aria-hidden="true">Love is all around ✨</div>
            </>
          )}
          {activeVideoId === 'career' && (
            <>
              <div className="career-lines" aria-hidden="true" />
              <div className="spark-shower" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className={`sparkle s-${i}`}>✨</span>
                ))}
              </div>
              <div className="career-banner" aria-hidden="true">Your path is opening ✨</div>
            </>
          )}
          {activeVideoId === 'money' && (
            <>
              <div className="money-lines" aria-hidden="true" />
              <div className="gold-shower" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className={`coin c-${i}`}>💰</span>
                ))}
              </div>
              <div className="money-banner" aria-hidden="true">Abundance is already moving ✨</div>
            </>
          )}
          {/* Decorative portal-specific graphics (visual only) */}
          {activeVideoId === 'love' && (
            <div className="portal-decor portal-decor-love" aria-hidden="true">
              <svg className="love-flower" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" focusable="false">
                <g fill="none" stroke="none">
                  <circle cx="60" cy="60" r="28" fill="#ffb3d9" opacity="0.85" />
                  <g transform="translate(60,60)">
                    <path className="petal p1" d="M0,-28 C10,-28 22,-20 28,-8 C18,-2 10,6 0,14 C-10,6 -18,-2 -28,-8 C-22,-20 -10,-28 0,-28" fill="#ff99cc" />
                    <path className="petal p2" d="M0,-28 C10,-28 22,-20 28,-8 C18,-2 10,6 0,14 C-10,6 -18,-2 -28,-8 C-22,-20 -10,-28 0,-28" fill="#ffb3d9" transform="rotate(45)" />
                    <path className="petal p3" d="M0,-28 C10,-28 22,-20 28,-8 C18,-2 10,6 0,14 C-10,6 -18,-2 -28,-8 C-22,-20 -10,-28 0,-28" fill="#ffc9e3" transform="rotate(90)" />
                  </g>
                </g>
              </svg>
              <div className="love-hearts" aria-hidden="true">
                <span className="heart h1">❤</span>
                <span className="heart h2">❤</span>
                <span className="heart h3">❤</span>
              </div>
            </div>
          )}
          {activeVideoId === 'career' && (
            <div className="portal-decor portal-decor-career" aria-hidden="true">
              <svg className="career-crest" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" focusable="false">
                <rect x="12" y="18" width="96" height="84" rx="12" fill="#b3d9ff" opacity="0.9" />
                <g transform="translate(60,60)">
                  <path d="M-18,-6 h36 v18 h-36 z" fill="#7fb3ff" />
                  <rect x="-6" y="-18" width="12" height="6" rx="2" fill="#5b94ff" />
                </g>
              </svg>
              <div className="career-icons" aria-hidden="true">
                <span className="briefcase">💼</span>
                <span className="spark">✨</span>
                <span className="spark s2">✨</span>
              </div>
            </div>
          )}
          {activeVideoId === 'money' && (
            <div className="portal-decor portal-decor-money" aria-hidden="true">
              <svg className="money-crest" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" focusable="false">
                <circle cx="60" cy="60" r="34" fill="#f7d98f" opacity="0.95" />
                <circle cx="60" cy="60" r="24" fill="#fff3c7" opacity="0.9" />
                <path d="M44 54h32" stroke="#b07a1f" strokeWidth="4" strokeLinecap="round" />
                <path d="M50 44c0-8 7-14 14-14 6 0 10 4 10 10 0 7-6 10-14 12-8 2-10 6-10 12 0 4 3 8 8 8 5 0 9-3 10-8" stroke="#b07a1f" strokeWidth="4" strokeLinecap="round" fill="none" />
              </svg>
              <div className="money-icons" aria-hidden="true">
                <span className="coin-icon">🪙</span>
                <span className="spark">✨</span>
                <span className="spark s2">✨</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container py-5">
        {loading ? (
          <div className="text-center py-5">
            <p className="lead">Validating your portal access…</p>
          </div>
        ) : validated ? (
          <div className="portal-content-stack">
            <div className={`portal-info-panel rounded-4 p-4 shadow-sm ${isLove ? 'love-info-panel' : isMoney ? 'money-info-panel' : 'career-info-panel'}`}>
              <div className="portal-panel-badge">{isMoney ? '💸 Abundance access' : 'Your sacred access'}</div>
              <h2>{isLove ? 'Welcome back, love' : isMoney ? 'Welcome back to abundance' : 'Welcome back'}</h2>
              <p>{isLove ? 'Keep these details close for your next return to this soft, guided space.' : isMoney ? 'Keep these details close for your next return to a grounded abundance practice.' : 'Keep these details close for your next return to this calm, guided space.'}</p>
              <ul className="list-unstyled portal-credentials">
                <li><strong>Service:</strong> {serviceLabel}</li>
                <li><strong>Payment ID:</strong> {portalUser?.paymentId}</li>
              </ul>
              <p className="mt-4 small portal-note">This portal is bound to your device for one-device access so your experience stays intimate and secure.</p>
            </div>

            <div className={`portal-ritual-card rounded-4 p-4 ${isLove ? 'love-ritual' : isMoney ? 'money-ritual' : 'career-ritual'}`}>
              <div className="ritual-badge">{isLove ? '🌷 Soft landing' : isMoney ? '💸 Wealth mindset' : '✨ Calm focus'}</div>
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <h3 className="h5 mb-2">{isLove ? 'A gentle love ritual' : isMoney ? 'A grounded abundance ritual' : 'A grounded career ritual'}</h3>
                  <p className="mb-3 small">Settle in, soften your shoulders, and let this moment feel sacred. A few small steps can help you arrive with warmth and clarity.</p>
                </div>
                <span className="ritual-heart" aria-hidden="true">{isLove ? '♡' : isMoney ? '☼' : '✦'}</span>
              </div>
              <div className="ritual-steps">
                <div className="ritual-step">Light a candle or dim the room to create a tender atmosphere.</div>
                <div className="ritual-step">Take three slow breaths and gently release anything that feels heavy.</div>
                <div className="ritual-step">Repeat softly: "I welcome what is meant for me with grace."</div>
              </div>
            </div>

            <div className={`video-frame rounded-4 overflow-hidden shadow-lg ${isLove ? 'love-video' : isMoney ? 'money-video' : 'career-video'}`} style={{ minHeight: 200, background: isLove ? 'linear-gradient(135deg,#fff5f8,#ffeaf0)' : isMoney ? 'linear-gradient(135deg,#fff9e8,#fdf1cc)' : 'linear-gradient(135deg,#f4f8ff,#e9f0ff)' }}>
              <iframe
                title={activeVideo.title}
                width="100%"
                height="500"
                src={isTestMode ? debugFallbackVideo : activeVideo.videoUrl}
                frameBorder="0"
                style={{ border: isLove ? '2px solid rgba(255,255,255,0.18)' : '2px solid rgba(255,255,255,0.12)', background: isLove ? 'transparent' : 'transparent' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="mt-2 text-center">
                <a href={isTestMode ? debugFallbackVideo : activeVideo.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">Open video in new tab</a>
              </div>
            </div>

            <div className={`portal-support-grid row g-3 ${isLove ? 'love-extras' : isMoney ? 'money-extras' : 'career-extras'}`}>
              <div className="col-md-6">
                <div className="portal-mini-card p-3 rounded-3">
                  <h4 className="h6">{isLove ? 'Affirmations' : isMoney ? 'Abundance Affirmations' : 'Career Intentions'}</h4>
                  <p className="small">{isLove ? 'Play these aloud or whisper them to yourself after the session.' : isMoney ? 'Choose one phrase to carry with you as you welcome steady prosperity.' : 'Choose one intention to carry into your next step with calm confidence.'}</p>
                  <ul className="small mb-0">
                    <li>{isLove ? '— I deserve loving, kind relationships.' : isMoney ? '— I am worthy of steady, joyful abundance.' : '— I am aligned with opportunities that suit me.'}</li>
                    <li>{isLove ? '— I attract warmth and mutual respect.' : isMoney ? '— Money flows to me with ease and gratitude.' : '— I move forward with clarity and ease.'}</li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div className="portal-mini-card p-3 rounded-3">
                  <h4 className="h6">{isLove ? 'Journaling Prompts' : isMoney ? 'Wealth Reflection Prompts' : 'Reflection Prompts'}</h4>
                  <p className="small">{isLove ? 'Reflect briefly after the session.' : isMoney ? 'Pause and notice where your relationship with money is softening.' : 'Pause for a moment and notice what feels most alive.'}</p>
                  <ul className="small mb-0">
                    <li>{isLove ? '• What felt most resonant?' : isMoney ? '• Where do I feel most open to receiving?' : '• What opportunity feels most supported right now?'}</li>
                    <li>{isLove ? '• One small action I can take this week to invite connection.' : isMoney ? '• One generous action I can take this week.' : '• One grounded step I can take this week.'}</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="portal-content-stack">
            <div className="login-card-panel rounded-4 p-4 shadow-sm">
              <div className="portal-panel-badge">Welcome back</div>
              <h2 className="h5">Portal Login</h2>
              <p className="small">Enter the Payment ID and the password emailed to you to return to your guided space.</p>
              <form onSubmit={handleLogin} className="mt-3">
                <label className="form-label">Payment ID</label>
                <input className="form-control mb-3" value={paymentIdInput} onChange={(e) => setPaymentIdInput(e.target.value)} />
                <label className="form-label">Password</label>
                <input type="password" className="form-control mb-3" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
                {loginError && <div className="text-danger mb-3">{loginError}</div>}
                <button className="btn portal-action-btn">Enter Portal</button>
              </form>
            </div>
            <div className="portal-info-panel rounded-4 p-4 shadow-sm">
              <div className="portal-panel-badge">Need help?</div>
              <h2>We are here for you</h2>
              <p>If you just purchased, check your email for the password. The portal binds to one device when you first log in, keeping your experience personal and protected.</p>
              <Link to="/" className="btn btn-outline-light mt-3">Back to Home</Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default PortalPage;
