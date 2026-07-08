import { Link } from 'react-router-dom';
import SEO from './SEO';

function Terms() {
  return (
    <div className="terms-page">
      <SEO
        title="Terms of Service – TaroVerse Readings"
        description="Read the TaroVerse Terms of Service for booking, payment, refunds, and support policies for tarot readings."
        canonicalPath="/terms"
      />
      <header className="hero-section text-white text-center d-flex align-items-center justify-content-center" id="hero">
        <div className="overlay" />
        <div className="container position-relative hero-content">
          <p className="eyebrow">Terms & booking</p>
          <h1 className="display-4 fw-bold">Terms of Service</h1>
          <p className="lead mx-auto mt-3">Please read these terms carefully before booking a tarot reading with TaroVerse Readings.</p>
          <Link to="/" className="btn btn-light btn-lg mt-4">Back to Home</Link>
        </div>
      </header>

      <main className="section section-light policy-page py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="content-card p-4 shadow-sm rounded-4 mb-4">
                <span className="section-label">Terms</span>
                <h2>Booking terms made gentle and clear</h2>
                <p className="mt-3">Please review these Terms of Service before booking a reading or purchasing any portal access. By using our website and services, you agree to these terms and to our Privacy Policy.</p>
                <p className="mb-0 small text-muted mt-3">Last updated: 8 July 2026</p>
              </div>

              <div className="accordion" id="termsAccordion">
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="termsHeadingOne">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#termsCollapseOne" aria-expanded="false" aria-controls="termsCollapseOne">
                      Booking, payment and access
                    </button>
                  </h2>
                  <div id="termsCollapseOne" className="accordion-collapse collapse" aria-labelledby="termsHeadingOne" data-bs-parent="#termsAccordion">
                    <div className="accordion-body">
                      <p className="mb-2">Bookings are confirmed once payment is successfully completed. After payment, the relevant booking widget or portal access is unlocked for the selected service.</p>
                      <p className="mb-0">You are responsible for providing accurate contact information and for using the service in a lawful and respectful manner.</p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="termsHeadingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#termsCollapseTwo" aria-expanded="false" aria-controls="termsCollapseTwo">
                      Fees, refunds and cancellations
                    </button>
                  </h2>
                  <div id="termsCollapseTwo" className="accordion-collapse collapse" aria-labelledby="termsHeadingTwo" data-bs-parent="#termsAccordion">
                    <div className="accordion-body">
                      All fees are due at the time of purchase and are generally non-refundable once payment has been completed. If you experience a payment issue, please contact us promptly at <a href="mailto:taroverse.readings@gmail.com">taroverse.readings@gmail.com</a> so we can assist you. We reserve the right to refuse or cancel access where payment is disputed, fraudulent, or otherwise incompatible with these terms.
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="termsHeadingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#termsCollapseThree" aria-expanded="false" aria-controls="termsCollapseThree">
                      Portal access and confidentiality
                    </button>
                  </h2>
                  <div id="termsCollapseThree" className="accordion-collapse collapse" aria-labelledby="termsHeadingThree" data-bs-parent="#termsAccordion">
                    <div className="accordion-body">
                      Portal access credentials are provided for your personal use. You must keep your credentials confidential and must not share them with others. Access may be limited to a single device for security and privacy reasons, and we may suspend or revoke access if these terms are violated.
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="termsHeadingFour">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#termsCollapseFour" aria-expanded="false" aria-controls="termsCollapseFour">
                      Service limitations and disclaimers
                    </button>
                  </h2>
                  <div id="termsCollapseFour" className="accordion-collapse collapse" aria-labelledby="termsHeadingFour" data-bs-parent="#termsAccordion">
                    <div className="accordion-body">
                      Our readings and manifestation portals are designed for personal reflection and spiritual guidance. They are not professional financial, medical, legal, psychological, or religious advice, and they should not be relied upon as a substitute for qualified professional guidance. Individual experiences may vary and no guarantee of any specific outcome is made.
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="termsHeadingFive">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#termsCollapseFive" aria-expanded="false" aria-controls="termsCollapseFive">
                      Your responsibilities and prohibited conduct
                    </button>
                  </h2>
                  <div id="termsCollapseFive" className="accordion-collapse collapse" aria-labelledby="termsHeadingFive" data-bs-parent="#termsAccordion">
                    <div className="accordion-body">
                      You agree not to misuse the website, portal, or booking process. Prohibited conduct includes unauthorized sharing of credentials, spam, abusive behavior, attempts to interfere with the platform, scraping, or any unlawful use of the service.
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="termsHeadingSix">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#termsCollapseSix" aria-expanded="false" aria-controls="termsCollapseSix">
                      Intellectual property and content
                    </button>
                  </h2>
                  <div id="termsCollapseSix" className="accordion-collapse collapse" aria-labelledby="termsHeadingSix" data-bs-parent="#termsAccordion">
                    <div className="accordion-body">
                      All content, branding, images, text, and materials on this website remain the property of TaroVerse Readings unless otherwise stated. You may use the website for personal, non-commercial purposes only and may not copy, reproduce, distribute, or exploit the content without our written permission.
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="termsHeadingSeven">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#termsCollapseSeven" aria-expanded="false" aria-controls="termsCollapseSeven">
                      Limitation of liability, governing law and updates
                    </button>
                  </h2>
                  <div id="termsCollapseSeven" className="accordion-collapse collapse" aria-labelledby="termsHeadingSeven" data-bs-parent="#termsAccordion">
                    <div className="accordion-body">
                      <p className="mb-2">To the maximum extent permitted by law, TaroVerse Readings shall not be liable for indirect, incidental, special, or consequential damages arising from your use of the website, service, or portal. These terms are governed by the laws of India, and any dispute shall be subject to the jurisdiction of the courts in India.</p>
                      <p className="mb-0">We may update these Terms of Service from time to time. Continued use of the site after any updates constitutes your acceptance of the revised terms.</p>
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

export default Terms;
