const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, {
  threshold: 0.18,
});

document.querySelectorAll('.animate-slideUp, .animate-fadeIn, .animate-zoomIn').forEach((element) => {
  observer.observe(element);
});

// Reader data embedded directly
const readersData = [
  {
    "id": 1,
    "name": "Aria Moon",
    "image": "images/readers/aria.jpg",
    "calendly": "https://calendly.com/your-tarot-session"
  },
  {
    "id": 2,
    "name": "Kiran Sage",
    "image": "images/readers/kiran.jpg",
    "calendly": "https://calendly.com/your-tarot-session"
  },
  {
    "id": 3,
    "name": "Sana Vale",
    "image": "images/readers/sana.jpg",
    "calendly": "https://calendly.com/your-tarot-session"
  },
  {
    "id": 4,
    "name": "Deepak Mystic",
    "image": "images/readers/aria.jpg",
    "calendly": "https://calendly.com/your-tarot-session"
  },
  {
    "id": 5,
    "name": "Priya Starlight",
    "image": "images/readers/kiran.jpg",
    "calendly": "https://calendly.com/your-tarot-session"
  },
  {
    "id": 6,
    "name": "Ravi Cosmic",
    "image": "images/readers/sana.jpg",
    "calendly": "https://calendly.com/your-tarot-session"
  },
  {
    "id": 7,
    "name": "Maya Intuition",
    "image": "images/readers/aria.jpg",
    "calendly": "https://calendly.com/your-tarot-session"
  },
  {
    "id": 8,
    "name": "Aditya Wisdom",
    "image": "images/readers/kiran.jpg",
    "calendly": "https://calendly.com/your-tarot-session"
  },
  {
    "id": 9,
    "name": "Neha Aurora",
    "image": "images/readers/sana.jpg",
    "calendly": "https://calendly.com/your-tarot-session"
  },
  {
    "id": 10,
    "name": "Rohan Clarity",
    "image": "images/readers/aria.jpg",
    "calendly": "https://calendly.com/your-tarot-session"
  },
  {
    "id": 11,
    "name": "Vanessa Ethereal",
    "image": "images/readers/kiran.jpg",
    "calendly": "https://calendly.com/your-tarot-session"
  },
  {
    "id": 12,
    "name": "Sasha Echo",
    "image": "images/readers/sana.jpg",
    "calendly": "https://calendly.com/your-tarot-session"
  }
];

const servicePricing = {
  single: { label: 'Single Card Insight', amount: 199, duration: '15 mins', description: 'Private booking confirmation', calendly: 'https://calendly.com/shivangiarora424/tarot-reading?month=2026-06' },
  three: { label: 'Three-Card Spread', amount: 599, duration: '30 mins', description: 'Private booking confirmation', calendly: 'https://calendly.com/shivangiarora424/new-meeting?month=2026-06' },
  deep: { label: 'Deep Insight Session', amount: 1499, duration: '60 mins', description: 'Private booking confirmation', calendly: 'https://calendly.com/shivangiarora424/new-meeting-1?month=2026-06' }
};

const razorpayConfig = {
  paymentLink: '',
  orderEndpoint: '/create-order',
  keyId: 'YOUR_RAZORPAY_KEY_ID',
  name: 'TaroVerse Readings',
  description: 'Booking deposit'
};

let selectedReader = {
  name: 'TaroVerse host',
  calendly: 'https://calendly.com/shivangiarora424/tarot-reading?month=2026-06'
};
let selectedService = 'single';
let paymentCompleted = false;

function setPaymentStatus(message, type = 'info') {
  const statusEl = document.getElementById('payment-status');
  if (!statusEl) return;
  statusEl.className = `payment-status ${type}`.trim();
  statusEl.textContent = message;
}

function updateBookingSummary() {
  const serviceSelect = document.getElementById('booking-service');
  const amountEl = document.getElementById('payment-amount');
  const detailsEl = document.getElementById('payment-details');
  const readerNameEl = document.getElementById('payment-reader-name');

  if (serviceSelect) {
    selectedService = serviceSelect.value || 'single';
  }

  const service = servicePricing[selectedService] || servicePricing.single;
  if (amountEl) {
    amountEl.textContent = `₹${service.amount.toLocaleString('en-IN')}`;
  }
  if (detailsEl) {
    detailsEl.textContent = `${service.duration} • ${service.description}`;
  }
  if (readerNameEl) {
    readerNameEl.textContent = selectedReader.name;
  }
  
  // Update the selected reader's calendly link based on the service
  selectedReader.calendly = service.calendly;
  
  // Update Calendly widget preview if payment is completed
  if (paymentCompleted) {
    openCalendlyWidget(selectedReader.calendly, selectedReader.name);
  }
}

function openCalendlyWidget(url, readerName) {
  const readerStatus = document.getElementById('schedule-reader-status');
  const widgetContainer = document.getElementById('calendlyInlineWidget');
  
  if (!paymentCompleted) {
    if (readerStatus) {
      readerStatus.innerHTML = `🔒 <strong>Complete payment above to unlock booking.</strong> Select a service and pay to see available slots.`;
    }
    if (widgetContainer) {
      widgetContainer.innerHTML = '<div class="p-4 text-center text-white"><p style="font-size: 1.1rem; color: #ddd;">🔒 Booking widget will appear after payment</p></div>';
      widgetContainer.removeAttribute('data-url');
    }
    return;
  }
  
  if (readerStatus) {
    readerStatus.innerHTML = `Booking with <strong>${readerName}</strong>. Please choose a slot below.`;
  }
  if (widgetContainer) {
    widgetContainer.innerHTML = '';
    widgetContainer.setAttribute('data-url', url);
    if (window.Calendly && typeof Calendly.initInlineWidget === 'function') {
      Calendly.initInlineWidget({ url, parentElement: widgetContainer });
    } else {
      widgetContainer.innerHTML = `<div class="p-4 text-center text-white"><p>Open the booking page for <strong>${readerName}</strong> if the inline widget is unavailable.</p><a href="${url}" target="_blank" rel="noopener" class="btn btn-light mt-2">Open booking page</a></div>`;
    }
  }
  const scheduleSection = document.getElementById('schedule');
  if (scheduleSection && typeof scheduleSection.scrollIntoView === 'function') {
    scheduleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function unlockBooking() {
  const service = servicePricing[selectedService] || servicePricing.single;
  paymentCompleted = true;
  setPaymentStatus(`Payment confirmed for ${service.label}. Your selected booking slot is now unlocked.`, 'success');
  openCalendlyWidget(selectedReader.calendly, selectedReader.name);
}

async function handlePayment() {
  const service = servicePricing[selectedService] || servicePricing.single;
  if (!selectedReader.calendly) {
    setPaymentStatus('Select a reader before continuing.', 'error');
    return;
  }

  if (!razorpayConfig.orderEndpoint || !razorpayConfig.keyId) {
    setPaymentStatus('Razorpay checkout is not configured yet. Add your order endpoint and key to enable payment.', 'error');
    return;
  }

  if (!window.Razorpay) {
    setPaymentStatus('Razorpay checkout is not available in this browser. Please try again later.', 'error');
    return;
  }

  try {
    const response = await fetch(razorpayConfig.orderEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: service.amount * 100,
        currency: 'INR',
        receipt: `taro-${Date.now()}`,
        notes: {
          reader: selectedReader.name,
          service: service.label,
          duration: service.duration
        }
      })
    });

    if (!response.ok) {
      throw new Error('Unable to create a Razorpay order right now.');
    }

    const order = await response.json();
    const options = {
      key: razorpayConfig.keyId,
      amount: order.amount,
      currency: order.currency || 'INR',
      order_id: order.id,
      name: razorpayConfig.name,
      description: `${service.label} • ${selectedReader.name}`,
      handler: () => {
        unlockBooking();
      },
      prefill: {
        name: 'Guest',
        email: 'guest@example.com',
        contact: ''
      },
      theme: { color: '#c38a3f' }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    setPaymentStatus(error.message || 'Payment failed. Please try again.', 'error');
  }
}

// Load readers and render
function loadReaders() {
  renderReaders(readersData);
  updateBookingSummary();
  // Initialize Calendly widget in locked state
  openCalendlyWidget(selectedReader.calendly, selectedReader.name);
}

// Run when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadReaders);
} else {
  loadReaders();
}

function renderReaders(readers) {
  const container = document.getElementById('readers-container');
  if (!container) return;
  container.innerHTML = '';
  
  readers.forEach((reader) => {
    const card = document.createElement('div');
    card.className = 'reader-item';
    
    const avatarCard = document.createElement('div');
    avatarCard.className = 'reader-avatar-card';
    
    const avatarBtn = document.createElement('button');
    avatarBtn.type = 'button';
    avatarBtn.className = 'reader-avatar reader-book btn btn-link p-0 border-0';
    avatarBtn.setAttribute('data-calendly', reader.calendly);
    avatarBtn.setAttribute('data-reader', reader.name);
    avatarBtn.setAttribute('aria-label', `Book ${reader.name}`);
    
    const img = document.createElement('img');
    img.src = reader.image;
    img.alt = reader.name;
    img.className = 'reader-avatar-image mb-3';
    
    avatarBtn.appendChild(img);
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'reader-avatar-name';
    nameDiv.textContent = reader.name;
    
    const bookBtn = document.createElement('button');
    bookBtn.type = 'button';
    bookBtn.className = 'btn btn-outline-light reader-book-btn reader-book mt-3';
    bookBtn.setAttribute('data-calendly', reader.calendly);
    bookBtn.setAttribute('data-reader', reader.name);
    bookBtn.textContent = `Book ${reader.name.split(' ')[0]}`;
    
    avatarCard.appendChild(avatarBtn);
    avatarCard.appendChild(nameDiv);
    avatarCard.appendChild(bookBtn);
    card.appendChild(avatarCard);
    container.appendChild(card);
  });
}

const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const collapse = document.querySelector('.navbar-collapse');
    if (collapse && collapse.classList.contains('show')) {
      new bootstrap.Collapse(collapse).hide();
    }
  });
});

// Reader booking: update the inline Calendly widget and scroll to the schedule section
// Uses event delegation to handle dynamically created reader buttons
document.addEventListener('click', (e) => {
  const btn = e.target.closest ? e.target.closest('.reader-book') : null;
  if (!btn) return;
  const url = btn.getAttribute('data-calendly') || (btn.dataset && btn.dataset.calendly);
  const readerName = btn.getAttribute('data-reader') || 'Selected reader';
  if (!url) return;
  e.preventDefault();
  selectedReader = { name: readerName, calendly: url };
  updateBookingSummary();
  setPaymentStatus(`Reader selected: ${readerName}. Complete payment to unlock the booking widget.`, 'info');
  openCalendlyWidget(url, readerName);
});

const serviceSelect = document.getElementById('booking-service');
if (serviceSelect) {
  serviceSelect.addEventListener('change', updateBookingSummary);
}

const payButton = document.getElementById('pay-and-book-btn');

if (payButton) {
  payButton.addEventListener('click', (event) => {
    event.preventDefault();
    handlePayment();
  });
}
