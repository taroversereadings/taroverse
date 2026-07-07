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
    <div className="app-root portal-page">
      <SEO
        title="Manifestation Portal | TaroVerse"
        description="Access your unlocked manifestation portal for love and career guidance. Re-enter with saved portal credentials anytime."
        canonicalPath="/portal"
      />
      <header className="portal-header text-center text-white py-5">
        <div className="container">
          <span className="section-label">Manifestation Portal</span>
          <h1>{activeVideo.title}</h1>
          <p className="lead mx-auto mt-3" style={{ maxWidth: '720px' }}>{activeVideo.description}</p>
        </div>
      </header>

      <main className="container py-5">
        {loading ? (
          <div className="text-center py-5">
            <p className="lead">Validating your portal access…</p>
          </div>
        ) : validated ? (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="video-frame rounded-4 overflow-hidden shadow-lg" style={{ minHeight: 200, background: '#000' }}>
                <iframe
                  title={activeVideo.title}
                  width="100%"
                  height="500"
                  src={isTestMode ? debugFallbackVideo : activeVideo.videoUrl}
                  frameBorder="0"
                  style={{ border: '2px solid rgba(255,255,255,0.06)', background: '#000' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="mt-2 text-center">
                  <a href={isTestMode ? debugFallbackVideo : activeVideo.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">Open video in new tab</a>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="portal-info rounded-4 p-4 shadow-sm">
                <h2>Welcome back</h2>
                <p>Use the portal credentials below to re-enter anytime:</p>
                <ul className="list-unstyled portal-credentials">
                  <li><strong>Service:</strong> {portalUser?.serviceId === 'career' ? 'Career Manifestation' : 'Love Spell Manifestation'}</li>
                  <li><strong>Payment ID:</strong> {portalUser?.paymentId}</li>
                </ul>
                <p className="mt-4 small text-muted">This portal is bound to your device for one-device access.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="login-card rounded-4 p-4 shadow-sm">
                <h2 className="h5">Portal Login</h2>
                <p className="small text-muted">Enter the Payment ID and the password emailed to you.</p>
                <form onSubmit={handleLogin} className="mt-3">
                  <label className="form-label">Payment ID</label>
                  <input className="form-control mb-3" value={paymentIdInput} onChange={(e) => setPaymentIdInput(e.target.value)} />
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control mb-3" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
                  {loginError && <div className="text-danger mb-3">{loginError}</div>}
                  <button className="btn btn-primary">Enter Portal</button>
                </form>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="portal-info rounded-4 p-4 shadow-sm">
                <h2>Need help?</h2>
                <p>If you just purchased, check your email for the password. The portal binds to one device when you first log in.</p>
                <Link to="/" className="btn btn-outline-primary mt-3">Back to Home</Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default PortalPage;
