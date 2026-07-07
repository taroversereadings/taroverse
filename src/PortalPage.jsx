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
  const [activeChapters, setActiveChapters] = useState(() => {
    const init = { love: 'intro', career: 'intro', money: 'intro' };
    const q = searchParams.get('chapter');
    const v = searchParams.get('video') || 'love';
    if (q) init[v] = q;
    return init;
  });

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
  const debugFallbackVideo = 'https://www.youtube.com/embed/Cb6wuzOurPc';

  // debug: log key portal state to help diagnose welcome-panel visibility
  const _paramVideo = searchParams.get('video');
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.debug('[PortalPage debug]', {
        validated,
        portalService: portalUser?.serviceId,
        paramVideo: _paramVideo,
        activeVideoId
      });
    } catch (e) {}
  }, [validated, portalUser, _paramVideo, activeVideoId]);

  const loveChapters = [
    { id: 'intro', title: 'Instructions', content: `Hi honey, welcome to the Love Spell.\n\nYou didn't find this method by accident. This method found you. The universe saw you had desires that you wanted to manifest and it brought this method to you so you could claim it. You are here for a reason.\n\nBefore we begin, I'd like to walk you through the method and how it works. This method is a powerful combination of spell work, affirmations, hypnosis, the Law of Assumption and ritual.` },
    { id: 'ritual', title: 'The Ritual', content: 'A gentle guided ritual to open and settle. Light a candle, breathe deeply, and follow the imagery in the video.' },
    { id: 'affirmations', title: 'Affirmations', content: 'Affirmations to repeat after the session: I am worthy of love. I attract kind, loving relationships.' },
    { id: 'journaling', title: 'Journaling', content: 'Short prompts to reflect on after the practice and small actions to integrate the energy.' }
  ];

  const careerChapters = [
    { id: 'intro', title: 'Instructions', content: 'Welcome to the Career Manifestation portal. This section explains the practice and how to get the most from the ritual.' },
    { id: 'ritual', title: 'The Ritual', content: 'A focused career ritual: grounding, intention-setting, and visualization to open new pathways.' },
    { id: 'affirmations', title: 'Affirmations', content: 'Affirmations: I am ready for aligned opportunities. I step forward with clarity.' },
    { id: 'journaling', title: 'Journaling', content: 'Reflection prompts to integrate clarity and next steps after the session.' }
  ];

  const moneyChapters = [
    { id: 'intro', title: 'Instructions', content: 'Welcome to the Abundance portal. Learn how to create a grounded money mindset and steady receiving.' },
    { id: 'ritual', title: 'The Ritual', content: 'A calm guided ritual to open your relationship with money — gentle breathwork and intentions.' },
    { id: 'affirmations', title: 'Affirmations', content: 'Affirmations: I welcome steady abundance. I am worthy of wealth that supports my life.' },
    { id: 'journaling', title: 'Journaling', content: 'Simple prompts to notice shifts and take practical next steps after the practice.' }
  ];

  const isCareer = activeVideoId === 'career';

  // helper to read/set the active chapter for the current variant
  const activeChapter = activeChapters[activeVariant] || 'intro';
  function updateActiveChapter(chId) {
    setActiveChapters((prev) => ({ ...prev, [activeVariant]: chId }));
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('chapter', chId);
      window.history.replaceState({}, '', url);
    } catch (e) {}
  }

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
            {Array.from({ length: 36 }).map((_, i) => (
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
            {Array.from({ length: 32 }).map((_, i) => (
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
            {Array.from({ length: 28 }).map((_, i) => (
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
          (() => {
            if (isLove) {
              return (
                <div className="row g-4 portal-course">
              <aside className="col-lg-4 d-none d-lg-block">
                <div className="portal-course-sidebar rounded-4 p-3">
                  <div className="course-title mb-3">The Love Spell</div>
                  <ul className="list-unstyled chapter-list">
                    {loveChapters.map((ch) => (
                      <li
                        key={ch.id}
                        className={`chapter-item ${activeChapter === ch.id ? 'active' : ''}`}
                        onClick={() => updateActiveChapter(ch.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') updateActiveChapter(ch.id); }}
                      >
                        <div className="chapter-title">{ch.title}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              <div className="col-12 col-lg-8">
                {(isLove && activeChapter === 'intro' && validated && portalUser?.serviceId && searchParams.get('video') && portalUser.serviceId === searchParams.get('video') && activeVariant === portalUser.serviceId) && (
                  <div className={`portal-info-panel rounded-4 p-4 shadow-sm love-info-panel mb-3`}>
                    <div className="portal-panel-badge">Your sacred access</div>
                    <h2>Welcome back, love</h2>
                    <p>Keep these details close for your next return to this soft, guided space.</p>
                    <ul className="list-unstyled portal-credentials">
                      <li><strong>Service:</strong> Love Spell Manifestation</li>
                      <li><strong>Payment ID:</strong> {portalUser?.paymentId}</li>
                    </ul>
                  </div>
                )}

                {(() => {
                  const current = loveChapters.find(c => c.id === activeChapter) || loveChapters[0];
                  // intro: show instructions only
                  if (current.id === 'intro') {
                    return (
                      <div className="chapter-content rounded-4 p-4 mb-3">
                        <h3 className="h5 mb-2">{current.title}</h3>
                        <div className="small" style={{ whiteSpace: 'pre-line' }}>{current.content}</div>
                      </div>
                    );
                  }

                  // ritual: show video (and brief intro)
                  if (current.id === 'ritual') {
                    return (
                      <>
                        <div className="chapter-content rounded-4 p-4 mb-3">
                          <h3 className="h5 mb-2">{current.title}</h3>
                          <div className="small" style={{ whiteSpace: 'pre-line' }}>{current.content}</div>
                        </div>
                        <div className="video-frame rounded-4 overflow-hidden shadow-lg love-video mb-3" style={{ minHeight: 200 }}>
                          <iframe
                            title={`${activeVideo.title} — ${current.id}`}
                            width="100%"
                            height="480"
                            src={isTestMode ? debugFallbackVideo : activeVideo.videoUrl}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </>
                    );
                  }

                  // affirmations: show manifest/support grid
                  if (current.id === 'affirmations') {
                    return (
                      <div className="portal-support-grid row g-3 love-extras mb-3">
                        <div className="col-md-6">
                          <div className="portal-mini-card p-3 rounded-3">
                            <h4 className="h6">Affirmations</h4>
                            <p className="small">Play these aloud or whisper them to yourself after the session.</p>
                            <ul className="small mb-0">
                              <li>— I deserve loving, kind relationships.</li>
                              <li>— I attract warmth and mutual respect.</li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="portal-mini-card p-3 rounded-3">
                            <h4 className="h6">Journaling Prompts</h4>
                            <p className="small">Reflect briefly after the session.</p>
                            <ul className="small mb-0">
                              <li>• What felt most resonant?</li>
                              <li>• One small action I can take this week to invite connection.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // journaling or any other chapter: show content
                  return (
                    <div className="chapter-content rounded-4 p-4 mb-3">
                      <h3 className="h5 mb-2">{current.title}</h3>
                      <div className="small" style={{ whiteSpace: 'pre-line' }}>{current.content}</div>
                    </div>
                  );
                })()}

                <div className="d-flex gap-2">
                  {(() => {
                    const idx = loveChapters.findIndex(c => c.id === activeChapter);
                    return (
                      <>
                        <button className="btn btn-outline-light" disabled={idx <= 0} onClick={() => updateActiveChapter(loveChapters[Math.max(0, idx - 1)].id)}>Previous</button>
                        <button className="btn btn-light ms-auto" disabled={idx >= loveChapters.length - 1} onClick={() => updateActiveChapter(loveChapters[Math.min(loveChapters.length - 1, idx + 1)].id)}>Next</button>
                      </>
                    );
                  })()}
                </div>
              </div>
                </div>
              );
            }

            if (isCareer) {
              return (
                <div className="row g-4 portal-course">
                  <aside className="col-lg-4 d-none d-lg-block">
                    <div className="portal-course-sidebar rounded-4 p-3">
                      <div className="course-title mb-3">Career Path</div>
                      <ul className="list-unstyled chapter-list">
                        {careerChapters.map((ch) => (
                          <li key={ch.id} className={`chapter-item ${activeChapter === ch.id ? 'active' : ''}`} onClick={() => updateActiveChapter(ch.id)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') updateActiveChapter(ch.id); }}>
                            <div className="chapter-title">{ch.title}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </aside>

                  <div className="col-12 col-lg-8">
                    {(isCareer && activeChapter === 'intro' && validated && portalUser?.serviceId && searchParams.get('video') && portalUser.serviceId === searchParams.get('video') && activeVariant === portalUser.serviceId) && (
                      <div className="portal-info-panel rounded-4 p-4 shadow-sm career-info-panel mb-3">
                        <div className="portal-panel-badge">Your sacred access</div>
                        <h2>Welcome back to your career practice</h2>
                        <p>Keep these details close for your next return to this guided space.</p>
                        <ul className="list-unstyled portal-credentials">
                          <li><strong>Service:</strong> Career Manifestation</li>
                          <li><strong>Payment ID:</strong> {portalUser?.paymentId}</li>
                        </ul>
                      </div>
                    )}

                    {(() => {
                      const current = careerChapters.find(c => c.id === activeChapter) || careerChapters[0];
                      if (current.id === 'intro') {
                        return (<div className="chapter-content rounded-4 p-4 mb-3"><h3 className="h5 mb-2">{current.title}</h3><div className="small" style={{ whiteSpace: 'pre-line' }}>{current.content}</div></div>);
                      }
                      if (current.id === 'ritual') {
                        return (<>
                          <div className="chapter-content rounded-4 p-4 mb-3"><h3 className="h5 mb-2">{current.title}</h3><div className="small" style={{ whiteSpace: 'pre-line' }}>{current.content}</div></div>
                          <div className="video-frame rounded-4 overflow-hidden shadow-lg career-video mb-3" style={{ minHeight: 200 }}>
                            <iframe title={`${activeVideo.title} — ${current.id}`} width="100%" height="480" src={isTestMode ? debugFallbackVideo : activeVideo.videoUrl} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                          </div>
                        </>);
                      }
                      if (current.id === 'affirmations') {
                        return (<div className="portal-support-grid row g-3 career-extras mb-3"><div className="col-md-6"><div className="portal-mini-card p-3 rounded-3"><h4 className="h6">Career Intentions</h4><p className="small">Choose one intention to carry into your next step with calm confidence.</p><ul className="small mb-0"><li>— I am aligned with opportunities that suit me.</li><li>— I move forward with clarity and ease.</li></ul></div></div><div className="col-md-6"><div className="portal-mini-card p-3 rounded-3"><h4 className="h6">Reflection Prompts</h4><p className="small">Pause for a moment and notice what feels most alive.</p><ul className="small mb-0"><li>• What opportunity feels most supported right now?</li><li>• One grounded step I can take this week.</li></ul></div></div></div>);
                      }
                      return (<div className="chapter-content rounded-4 p-4 mb-3"><h3 className="h5 mb-2">{current.title}</h3><div className="small" style={{ whiteSpace: 'pre-line' }}>{current.content}</div></div>);
                    })()}

                    <div className="d-flex gap-2">
                      {(() => { const idx = careerChapters.findIndex(c => c.id === activeChapter); return (<><button className="btn btn-outline-light" disabled={idx <= 0} onClick={() => updateActiveChapter(careerChapters[Math.max(0, idx - 1)].id)}>Previous</button><button className="btn btn-light ms-auto" disabled={idx >= careerChapters.length - 1} onClick={() => updateActiveChapter(careerChapters[Math.min(careerChapters.length - 1, idx + 1)].id)}>Next</button></>); })()}
                    </div>
                  </div>
                </div>
              );
            }

            if (isMoney) {
              return (
                <div className="row g-4 portal-course">
                  <aside className="col-lg-4 d-none d-lg-block">
                    <div className="portal-course-sidebar rounded-4 p-3">
                      <div className="course-title mb-3">Abundance Path</div>
                      <ul className="list-unstyled chapter-list">
                        {moneyChapters.map((ch) => (
                          <li key={ch.id} className={`chapter-item ${activeChapter === ch.id ? 'active' : ''}`} onClick={() => updateActiveChapter(ch.id)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') updateActiveChapter(ch.id); }}>
                            <div className="chapter-title">{ch.title}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </aside>

                  <div className="col-12 col-lg-8">
                    {(isMoney && activeChapter === 'intro' && validated && portalUser?.serviceId && searchParams.get('video') && portalUser.serviceId === searchParams.get('video') && activeVariant === portalUser.serviceId) && (
                      <div className="portal-info-panel rounded-4 p-4 shadow-sm money-info-panel mb-3">
                        <div className="portal-panel-badge">💸 Abundance access</div>
                        <h2>Welcome back to abundance</h2>
                        <p>Keep these details close for your next return to this grounded space.</p>
                        <ul className="list-unstyled portal-credentials">
                          <li><strong>Service:</strong> Money Manifestation</li>
                          <li><strong>Payment ID:</strong> {portalUser?.paymentId}</li>
                        </ul>
                      </div>
                    )}

                    {(() => {
                      const current = moneyChapters.find(c => c.id === activeChapter) || moneyChapters[0];
                      if (current.id === 'intro') {
                        return (<div className="chapter-content rounded-4 p-4 mb-3"><h3 className="h5 mb-2">{current.title}</h3><div className="small" style={{ whiteSpace: 'pre-line' }}>{current.content}</div></div>);
                      }
                      if (current.id === 'ritual') {
                        return (<>
                          <div className="chapter-content rounded-4 p-4 mb-3"><h3 className="h5 mb-2">{current.title}</h3><div className="small" style={{ whiteSpace: 'pre-line' }}>{current.content}</div></div>
                          <div className="video-frame rounded-4 overflow-hidden shadow-lg money-video mb-3" style={{ minHeight: 200 }}>
                            <iframe title={`${activeVideo.title} — ${current.id}`} width="100%" height="480" src={isTestMode ? debugFallbackVideo : activeVideo.videoUrl} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                          </div>
                        </>);
                      }
                      if (current.id === 'affirmations') {
                        return (<div className="portal-support-grid row g-3 money-extras mb-3"><div className="col-md-6"><div className="portal-mini-card p-3 rounded-3"><h4 className="h6">Abundance Affirmations</h4><p className="small">Choose one phrase to carry with you as you welcome steady prosperity.</p><ul className="small mb-0"><li>— I am worthy of steady, joyful abundance.</li><li>— Money flows to me with ease and gratitude.</li></ul></div></div><div className="col-md-6"><div className="portal-mini-card p-3 rounded-3"><h4 className="h6">Wealth Reflection Prompts</h4><p className="small">Pause and notice where your relationship with money is softening.</p><ul className="small mb-0"><li>• Where do I feel most open to receiving?</li><li>• One generous action I can take this week.</li></ul></div></div></div>);
                      }
                      return (<div className="chapter-content rounded-4 p-4 mb-3"><h3 className="h5 mb-2">{current.title}</h3><div className="small" style={{ whiteSpace: 'pre-line' }}>{current.content}</div></div>);
                    })()}

                    <div className="d-flex gap-2">
                      {(() => { const idx = moneyChapters.findIndex(c => c.id === activeChapter); return (<><button className="btn btn-outline-light" disabled={idx <= 0} onClick={() => updateActiveChapter(moneyChapters[Math.max(0, idx - 1)].id)}>Previous</button><button className="btn btn-light ms-auto" disabled={idx >= moneyChapters.length - 1} onClick={() => updateActiveChapter(moneyChapters[Math.min(moneyChapters.length - 1, idx + 1)].id)}>Next</button></>); })()}
                    </div>
                  </div>
                </div>
              );
            }

            // fallback: existing combined flow for non-portal videos
            return (
              <div className="portal-content-stack">
                {((isMoney || isCareer) && validated && portalUser?.serviceId && searchParams.get('video') && portalUser.serviceId === searchParams.get('video') && activeVariant === portalUser.serviceId) && (
                  <div className={`portal-info-panel rounded-4 p-4 shadow-sm ${isMoney ? 'money-info-panel' : 'career-info-panel'}`}>
                    <div className="portal-panel-badge">{isMoney ? '💸 Abundance access' : 'Your sacred access'}</div>
                    <h2>{isMoney ? 'Welcome back to abundance' : 'Welcome back to success'}</h2>
                    <p>{isMoney ? 'Keep these details close for your next return to a grounded abundance practice.' : 'Keep these details close for your next return to this calm, guided space.'}</p>
                    <ul className="list-unstyled portal-credentials">
                      <li><strong>Service:</strong> {serviceLabel}</li>
                      <li><strong>Payment ID:</strong> {portalUser?.paymentId}</li>
                    </ul>
                    <p className="mt-4 small portal-note">This portal is bound to your device for one-device access so your experience stays intimate and secure.</p>
                  </div>
                )}

                <div className={`portal-ritual-card rounded-4 p-4 ${isMoney ? 'money-ritual' : 'career-ritual'}`}>
                  <div className="ritual-badge">{isMoney ? '💸 Wealth mindset' : '✨ Calm focus'}</div>
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <h3 className="h5 mb-2">{isMoney ? 'A grounded abundance ritual' : 'A grounded career ritual'}</h3>
                      <p className="mb-3 small">Settle in, soften your shoulders, and let this moment feel sacred. A few small steps can help you arrive with warmth and clarity.</p>
                    </div>
                    <span className="ritual-heart" aria-hidden="true">{isMoney ? '☼' : '✦'}</span>
                  </div>
                  <div className="ritual-steps">
                    <div className="ritual-step">Light a candle or dim the room to create a tender atmosphere.</div>
                    <div className="ritual-step">Take three slow breaths and gently release anything that feels heavy.</div>
                    <div className="ritual-step">Repeat softly: "I welcome what is meant for me with grace."</div>
                  </div>
                </div>

                <div className={`video-frame rounded-4 overflow-hidden shadow-lg ${isMoney ? 'money-video' : 'career-video'}`} style={{ minHeight: 200, background: isMoney ? 'linear-gradient(135deg,#fff9e8,#fdf1cc)' : 'linear-gradient(135deg,#f4f8ff,#e9f0ff)' }}>
                  <iframe
                    title={activeVideo.title}
                    width="100%"
                    height="500"
                    src={isTestMode ? debugFallbackVideo : activeVideo.videoUrl}
                    frameBorder="0"
                    style={{ border: isMoney ? '2px solid rgba(255,255,255,0.12)' : '2px solid rgba(255,255,255,0.12)', background: 'transparent' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="mt-2 text-center">
                    <a href={isTestMode ? debugFallbackVideo : activeVideo.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">Open video in new tab</a>
                  </div>
                </div>

                <div className={`portal-support-grid row g-3 ${isMoney ? 'money-extras' : 'career-extras'}`}>
                  <div className="col-md-6">
                    <div className="portal-mini-card p-3 rounded-3">
                      <h4 className="h6">{isMoney ? 'Abundance Affirmations' : 'Career Intentions'}</h4>
                      <p className="small">{isMoney ? 'Choose one phrase to carry with you as you welcome steady prosperity.' : 'Choose one intention to carry into your next step with calm confidence.'}</p>
                      <ul className="small mb-0">
                        <li>{isMoney ? '— I am worthy of steady, joyful abundance.' : '— I am aligned with opportunities that suit me.'}</li>
                        <li>{isMoney ? '— Money flows to me with ease and gratitude.' : '— I move forward with clarity and ease.'}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="portal-mini-card p-3 rounded-3">
                      <h4 className="h6">{isMoney ? 'Wealth Reflection Prompts' : 'Reflection Prompts'}</h4>
                      <p className="small">{isMoney ? 'Pause and notice where your relationship with money is softening.' : 'Pause for a moment and notice what feels most alive.'}</p>
                      <ul className="small mb-0">
                        <li>{isMoney ? '• Where do I feel most open to receiving?' : '• What opportunity feels most supported right now?'}</li>
                        <li>{isMoney ? '• One generous action I can take this week.' : '• One grounded step I can take this week.'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
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
