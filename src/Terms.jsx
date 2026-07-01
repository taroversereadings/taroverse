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
                <p className="mt-3">Please review the booking and payment terms before reserving your tarot session. The process is designed to be open and straightforward.</p>
              </div>

              <div className="accordion" id="termsAccordion">
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="termsHeadingOne">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#termsCollapseOne" aria-expanded="false" aria-controls="termsCollapseOne">
                      Booking and payment
                    </button>
                  </h2>
                  <div id="termsCollapseOne" className="accordion-collapse collapse" aria-labelledby="termsHeadingOne" data-bs-parent="#termsAccordion">
                    <div className="accordion-body">
                      Bookings are confirmed once payment is completed. After payment, the booking widget unlocks and you can select your preferred session slot.
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="termsHeadingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#termsCollapseTwo" aria-expanded="false" aria-controls="termsCollapseTwo">
                      No refunds
                    </button>
                  </h2>
                  <div id="termsCollapseTwo" className="accordion-collapse collapse" aria-labelledby="termsHeadingTwo" data-bs-parent="#termsAccordion">
                    <div className="accordion-body">
                      All payments are final. We do not offer refunds once a session fee has been processed.
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="termsHeadingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#termsCollapseThree" aria-expanded="false" aria-controls="termsCollapseThree">
                      Payment issue support
                    </button>
                  </h2>
                  <div id="termsCollapseThree" className="accordion-collapse collapse" aria-labelledby="termsHeadingThree" data-bs-parent="#termsAccordion">
                    <div className="accordion-body">
                      If you face any payment issue, email <a href="mailto:taroverse.readings@gmail.com">taroverse.readings@gmail.com</a>. We will reply quickly with the next steps and support you through the booking process.
                    </div>
                  </div>
                </div>
                <div className="accordion-item rounded-4 overflow-hidden mb-3 shadow-sm">
                  <h2 className="accordion-header" id="termsHeadingFour">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#termsCollapseFour" aria-expanded="false" aria-controls="termsCollapseFour">
                      Service experience
                    </button>
                  </h2>
                  <div id="termsCollapseFour" className="accordion-collapse collapse" aria-labelledby="termsHeadingFour" data-bs-parent="#termsAccordion">
                    <div className="accordion-body">
                      Our readings are for personal guidance and reflection. They are not professional financial, medical, or legal advice, and individual experiences may vary.
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
            <a className="social-icon linkedin" href="https://www.linkedin.com/company/taroverse-readings" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in fa-lg" /></a>
            <a className="social-icon facebook" href="https://www.facebook.com/taroverse.readings" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f fa-lg" /></a>
            <a className="social-icon youtube" href="https://www.youtube.com/@taroverse" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="fab fa-youtube fa-lg" /></a>
          </div>
          <p className="mb-1 small">No refunds once payment is completed. Email <a href="mailto:taroverse.readings@gmail.com" className="text-muted">taroverse.readings@gmail.com</a> if you face any payment issue.</p>
          <small>Designed for calm clarity and responsive mobile use.</small>
        </div>
      </footer>
    </div>
  );
}

export default Terms;
