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
                <p className="mt-3">We collect and use personal information only to provide our tarot services, manage bookings, process payments, deliver portal access, and offer support. We aim to handle your information responsibly and transparently.</p>
                <div className="policy-summary-grid mt-4">
                  <div className="policy-summary-card">
                    <i className="fas fa-lock" />
                    <div>
                      <h3>Secure handling</h3>
                      <p>Payments are processed through trusted providers and your card details are not stored on the site.</p>
                    </div>
                  </div>
                  <div className="policy-summary-card">
                    <i className="fas fa-user-shield" />
                    <div>
                      <h3>Minimal data</h3>
                      <p>We only collect what is needed to complete your booking, deliver your reading, and provide support.</p>
                    </div>
                  </div>
                  <div className="policy-summary-card">
                    <i className="fas fa-envelope-open-text" />
                    <div>
                      <h3>Your control</h3>
                      <p>If you want access to, correction of, or deletion of your information, reach out to us directly.</p>
                    </div>
                  </div>
                </div>
                <div className="policy-help-card rounded-4 p-4 mt-4">
                  <h3>Need help with privacy questions?</h3>
                  <p className="mb-2">We’re happy to clarify how your details are used before or after a purchase.</p>
                  <a href="mailto:taroverse.readings@gmail.com">taroverse.readings@gmail.com</a>
                </div>
                <p className="mb-0 small text-muted mt-3">Last updated: 8 July 2026</p>
              </div>

              <div className="accordion" id="privacyAccordion">
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="privacyHeadingOne">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#privacyCollapseOne" aria-expanded="false" aria-controls="privacyCollapseOne">
                      Information we collect
                    </button>
                  </h2>
                  <div id="privacyCollapseOne" className="accordion-collapse collapse" aria-labelledby="privacyHeadingOne" data-bs-parent="#privacyAccordion">
                    <div className="accordion-body">
                      <p className="mb-2">When you book a service, make a payment, or request portal access, we may collect your name, email address, payment reference details, service selection, and basic technical information such as your IP address, browser type, and device information.</p>
                      <p className="mb-0">We collect only the information reasonably necessary to complete your purchase, deliver your service, and provide support.</p>
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
                      Your information is used to confirm bookings, send confirmation emails, deliver portal credentials when relevant, process payments, prevent fraud, respond to support requests, and improve our website and services. We do not use your data for unrelated marketing or sell your personal information to third parties.
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="privacyHeadingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#privacyCollapseThree" aria-expanded="false" aria-controls="privacyCollapseThree">
                      Payment security and third-party services
                    </button>
                  </h2>
                  <div id="privacyCollapseThree" className="accordion-collapse collapse" aria-labelledby="privacyHeadingThree" data-bs-parent="#privacyAccordion">
                    <div className="accordion-body">
                      Payments are processed through secure third-party payment providers. We do not store your full card details on this website. We may share limited transaction details with payment processors, email delivery services, and support tools strictly for the purpose of completing your purchase and delivering the requested service.
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="privacyHeadingFour">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#privacyCollapseFour" aria-expanded="false" aria-controls="privacyCollapseFour">
                      Portal access and confidentiality
                    </button>
                  </h2>
                  <div id="privacyCollapseFour" className="accordion-collapse collapse" aria-labelledby="privacyHeadingFour" data-bs-parent="#privacyAccordion">
                    <div className="accordion-body">
                      For manifestation portal purchases, access credentials may be shared with you by email. You are responsible for keeping those credentials confidential and for using the portal only in accordance with the service terms. Access is intended for personal use and may be limited to a single device for security and privacy purposes.
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="privacyHeadingFive">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#privacyCollapseFive" aria-expanded="false" aria-controls="privacyCollapseFive">
                      Data sharing, retention and your rights
                    </button>
                  </h2>
                  <div id="privacyCollapseFive" className="accordion-collapse collapse" aria-labelledby="privacyHeadingFive" data-bs-parent="#privacyAccordion">
                    <div className="accordion-body">
                      <p className="mb-2">We may share personal information only where necessary to provide the service, comply with legal obligations, or protect our rights. We retain personal information only for as long as needed to fulfill the purpose for which it was collected, resolve disputes, meet legal or tax requirements, and enforce our agreements.</p>
                      <p className="mb-0">If you would like to request access to, correction of, or deletion of your personal information, please contact us at <a href="mailto:taroverse.readings@gmail.com">taroverse.readings@gmail.com</a>.</p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="privacyHeadingSix">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#privacyCollapseSix" aria-expanded="false" aria-controls="privacyCollapseSix">
                      Security, children and policy updates
                    </button>
                  </h2>
                  <div id="privacyCollapseSix" className="accordion-collapse collapse" aria-labelledby="privacyHeadingSix" data-bs-parent="#privacyAccordion">
                    <div className="accordion-body">
                      <p className="mb-2">We use commercially reasonable security measures to protect your information, but no method of transmission or storage is completely risk-free. Please help us by keeping your login and portal credentials secure.</p>
                      <p className="mb-2">Our services are not directed to children under the age of 13, and we do not knowingly collect personal information from children without appropriate consent.</p>
                      <p className="mb-0">We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated date.</p>
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
