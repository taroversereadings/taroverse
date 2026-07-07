import { Link } from 'react-router-dom';
import SEO from './SEO';

function Privacy() {
  return (
    <div className="privacy-page">
      <SEO
        title="Privacy Policy – TaroVerse Readings"
        description="TaroVerse Readings privacy policy explains what booking and payment details are collected, how they are used, and how your information is protected."
        canonicalPath="/privacy"
      />
      <header className="hero-section text-white text-center d-flex align-items-center justify-content-center" id="hero">
        <div className="overlay" />
        <div className="container position-relative hero-content">
          <p className="eyebrow">Privacy & trust</p>
          <h1 className="display-4 fw-bold">Privacy Policy</h1>
          <p className="lead mx-auto mt-3">Your privacy is respected in every tarot session, booking interaction, and message you send.</p>
          <Link to="/" className="btn btn-light btn-lg mt-4">Back to Home</Link>
        </div>
      </header>

      <main className="section section-light policy-page py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="content-card p-4 shadow-sm rounded-4 mb-4">
                <span className="section-label">Privacy</span>
                <h2>Privacy built around calm, secure booking</h2>
                <p className="mt-3">Your details are only used to confirm your session and handle payment support. We keep the process transparent, gentle, and easy to trust.</p>
              </div>

              <div className="accordion" id="privacyAccordion">
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="privacyHeadingOne">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#privacyCollapseOne" aria-expanded="false" aria-controls="privacyCollapseOne">
                      What we collect
                    </button>
                  </h2>
                  <div id="privacyCollapseOne" className="accordion-collapse collapse" aria-labelledby="privacyHeadingOne" data-bs-parent="#privacyAccordion">
                    <div className="accordion-body">
                      We collect only the information necessary to confirm your booking and complete payment, such as your name, email, and any transaction details provided by the payment provider.
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="privacyHeadingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#privacyCollapseTwo" aria-expanded="false" aria-controls="privacyCollapseTwo">
                      How we use your information
                    </button>
                  </h2>
                  <div id="privacyCollapseTwo" className="accordion-collapse collapse" aria-labelledby="privacyHeadingTwo" data-bs-parent="#privacyAccordion">
                    <div className="accordion-body">
                      Your details are used to process bookings, send appointment reminders, and assist with payment issues. We do not use your data for unrelated marketing or selling purposes.
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="privacyHeadingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#privacyCollapseThree" aria-expanded="false" aria-controls="privacyCollapseThree">
                      Payment security & support
                    </button>
                  </h2>
                  <div id="privacyCollapseThree" className="accordion-collapse collapse" aria-labelledby="privacyHeadingThree" data-bs-parent="#privacyAccordion">
                    <div className="accordion-body">
                      Payments are processed by an external provider for secure checkout. We do not store your full payment credentials on this site. If you face any payment issue, email <a href="mailto:taroverse.readings@gmail.com">taroverse.readings@gmail.com</a> and we’ll support you directly.
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="privacyHeadingFour">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#privacyCollapseFour" aria-expanded="false" aria-controls="privacyCollapseFour">
                      Data sharing & updates
                    </button>
                  </h2>
                  <div id="privacyCollapseFour" className="accordion-collapse collapse" aria-labelledby="privacyHeadingFour" data-bs-parent="#privacyAccordion">
                    <div className="accordion-body">
                      We do not sell your data. We might share information only when needed for booking fulfillment or to comply with legal requirements. Any updates to this policy will be posted here.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer py-4 text-center text-muted">
        <div className="container">
          <p className="mb-1">TaroVerse Readings • <Link to="/privacy" className="text-muted">Privacy</Link> • <Link to="/terms" className="text-muted">Terms</Link></p>
          <div className="footer-social d-flex justify-content-center align-items-center gap-3 mb-2">
            <a className="social-icon instagram" href="https://www.instagram.com/taroverse.readings" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram fa-lg" /></a>
            <a className="social-icon linkedin" href="https://www.linkedin.com/company/taroverse-readings/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in fa-lg" /></a>
            <a className="social-icon facebook" href="https://www.facebook.com/taroverse.readings" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f fa-lg" /></a>
            <a className="social-icon x-twitter" href="https://x.com/taroverse5" target="_blank" rel="noopener noreferrer" aria-label="X"><svg viewBox="0 0 24 24" aria-hidden="true" className="fa-lg"><path d="M18.9 2H22l-6.8 7.8L23.3 22h-5.7l-4.5-5.9L7.7 22H4.6l7.2-8.2L.7 2h5.8l4.1 5.4L18.9 2Zm-1 18h1.1L6.2 4H5L17.9 20Z" fill="currentColor" /></svg></a>
            <a className="social-icon youtube" href="https://www.youtube.com/@TaroVerse.readings" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="fab fa-youtube fa-lg" /></a>
          </div>
          <p className="mb-1 small">No refunds once payment is completed. Email <a href="mailto:taroverse.readings@gmail.com" className="text-muted">taroverse.readings@gmail.com</a> if you face any payment issue.</p>
          <small>Designed for calm clarity and responsive mobile use.</small>
        </div>
      </footer>
    </div>
  );
}

export default Privacy;
