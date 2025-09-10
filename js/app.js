const toggle =
document.querySelector('.nav-toggle');
const menu =
document.getElementById('menu');
if(toggle && menu){
    toggle.addEventListener('click',()=>
{
const open =
menu.classList.toggle('open');
toggle.setAttribute('aria-expanded',open? 'true' : 'false');
});
}
const yearEl =
document.getElementById('year')
if (yearEl) yearEl.textContent =
new Date().getFullYear();
// slides
let slideIndex = 0;
const slides =
document.querySelectorAll(".slide");
function showSlide(index){
    if (index >= slides.length)
        slideIndex = 0;
    if (index < 0) slideIndex = slides.length - 1;
    const offset = -slideIndex*100;
document.querySelector(".slides").style.transform = 'translateX(${offset}%)';
}
function plusSlides(n){
    slideIndex += n;
showSlide(slideIndex)    
}
// auto slide every 5s
setInterval(() => {
    slideIndex++;
    showSlide(slideIndex);  
     
},5000);
// ===== TE Slider logic =====
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  const track = slider.querySelector('.te-track');
  const items = slider.querySelectorAll('.te-item');
  const prevBtn = slider.querySelector('.te-prev');
  const nextBtn = slider.querySelector('.te-next');

  let idx = 0;

  function go(i){
    idx = (i + items.length) % items.length;  // دوران دائري
    track.style.transform = `translateX(-${idx * 100}%)`;
  }

  prevBtn.addEventListener('click', () => go(idx - 1));
  nextBtn.addEventListener('click', () => go(idx + 1));

  // تشغيل تلقائي كل 5 ثوانٍ
  setInterval(() => go(idx + 1), 5000);

  // أول عرض
  go(0);
});
// ------- Destinations filters -------
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('destGrid');
  if (!grid) return; // هذه الصفحة فقط

  const cards = Array.from(grid.querySelectorAll('.dest-card'));
  const regionSel = document.getElementById('f-region');
  const priceRange = document.getElementById('f-price');
  const priceValue = document.getElementById('priceValue');
  const chips = document.querySelectorAll('.chip');
  const clearBtn = document.getElementById('clearFilters');

  let duration = 'any';

  function applyFilters(){
    const region = regionSel.value;
    const maxPrice = parseInt(priceRange.value, 10);

    cards.forEach(card => {
      const r = card.dataset.region;
      const p = parseInt(card.dataset.price, 10);
      const d = card.dataset.duration; // short | week

      const okRegion = (region === 'all' || r === region);
      const okPrice  = (p <= maxPrice);
      const okDur    = (duration === 'any' || d === duration);

      const visible = okRegion && okPrice && okDur;
      card.style.display = visible ? '' : 'none';
    });

    priceValue.textContent = `Up to $${maxPrice}`;
  }

  // Events
  regionSel.addEventListener('change', applyFilters);
  priceRange.addEventListener('input', applyFilters);

  chips.forEach(ch => {
    ch.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      ch.classList.add('active');
      duration = ch.dataset.duration;
      applyFilters();
    });
  });

  clearBtn.addEventListener('click', () => {
    regionSel.value = 'all';
    priceRange.value = '1500';
    duration = 'any';
    chips.forEach(c => c.classList.remove('active'));
    document.querySelector('.chip[data-duration="any"]').classList.add('active');
    applyFilters();
  });

  // init
  applyFilters();
});
// Booking modal: set package name from clicked button
document.addEventListener('DOMContentLoaded', () => {
  const bookModalEl = document.getElementById('bookModal');
  if (!bookModalEl) return;

  bookModalEl.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget; // الزر الذي فتح المودال
    const pkgName = button?.getAttribute('data-package') || 'Selected Package';

    const title = bookModalEl.querySelector('#bookTitle');
    const pkgInput = bookModalEl.querySelector('#pkg');

    if (title) title.textContent = `Book: ${pkgName}`;
    if (pkgInput) pkgInput.value = pkgName;
  });

  // مثال بسيط لمعالجة الفورم (بدون باك-إند)
  const form = document.getElementById('bookForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Booking submitted! (demo)');
      const modal = bootstrap.Modal.getInstance(bookModalEl);
      modal?.hide();
      form.reset();
    });
  }
});
// ------- Contact form validation -------
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successBox = document.getElementById('formSuccess');
  const errorBox = document.getElementById('formError');

  const fields = {
    name:    { el: document.getElementById('name'),    rule: v => v.trim().length >= 3,  msg: 'Please enter at least 3 characters.' },
    email:   { el: document.getElementById('email'),   rule: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email.' },
    phone:   { el: document.getElementById('phone'),   rule: v => (v.trim()==='' || /^[+\d][\d\s\-()]{7,}$/.test(v)), msg: 'Phone number is invalid.' },
    subject: { el: document.getElementById('subject'), rule: v => v.trim().length >= 3,  msg: 'Subject must be at least 3 characters.' },
    message: { el: document.getElementById('message'), rule: v => v.trim().length >= 20, msg: 'Message must be at least 20 characters.' },
    agree:   { el: document.getElementById('agree'),   rule: v => v === true,           msg: 'You must agree to be contacted.' }
  };

  function setError(el, msg) {
    const wrap = el.closest('.field') || el.closest('.agree');
    if (!wrap) return;
    el.classList.add('error');
    const small = wrap.querySelector('.error-msg');
    if (small) small.textContent = msg || '';
  }

  function clearError(el) {
    const wrap = el.closest('.field') || el.closest('.agree');
    if (!wrap) return;
    el.classList.remove('error');
    const small = wrap.querySelector('.error-msg');
    if (small) small.textContent = '';
  }

  // live validation
  ['input', 'blur', 'change'].forEach(evt => {
    form.addEventListener(evt, e => {
      const id = e.target.id;
      for (const key in fields) {
        if (fields[key].el.id === id) {
          const val = (id === 'agree') ? fields[key].el.checked : fields[key].el.value;
          fields[key].rule(val) ? clearError(fields[key].el) : setError(fields[key].el, fields[key].msg);
        }
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let ok = true;
    for (const key in fields) {
      const f = fields[key];
      const val = (f.el.id === 'agree') ? f.el.checked : f.el.value;
      if (!f.rule(val)) { setError(f.el, f.msg); ok = false; } else { clearError(f.el); }
    }

    if (!ok) {
      errorBox.hidden = false;
      successBox.hidden = true;
      return;
    }

    errorBox.hidden = true;
    successBox.hidden = false;
    form.reset();
  });
});
// ------- Login form (validation + show/hide) -------
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const email = document.getElementById('loginEmail');
  const pass  = document.getElementById('loginPassword');
  const errBox = document.getElementById('loginError');
  const okBox  = document.getElementById('loginSuccess');

  function setErr(input, msg){
    input.classList.add('error');
    const small = input.closest('.field').querySelector('.error-msg');
    if (small) small.textContent = msg;
  }
  function clearErr(input){
    input.classList.remove('error');
    const small = input.closest('.field').querySelector('.error-msg');
    if (small) small.textContent = '';
  }

  // show/hide password
  const eyeBtn = form.querySelector('.eye-btn');
  if (eyeBtn){
    eyeBtn.addEventListener('click', () => {
      const isPwd = pass.type === 'password';
      pass.type = isPwd ? 'text' : 'password';
      eyeBtn.innerHTML = isPwd ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    okBox.hidden = true;
    errBox.hidden = true;

    let ok = true;

    // email
    const emOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    if (!emOK){ setErr(email, 'Please enter a valid email.'); ok = false; } else { clearErr(email); }

    // password
    if (pass.value.trim().length < 6){ setErr(pass, 'Password must be at least 6 characters.'); ok = false; }
    else { clearErr(pass); }

    if (!ok){ errBox.hidden = false; return; }
    okBox.hidden = false;
    form.reset();
  });
});
// ------- Register form (validation + show/hide) -------
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const nameEl = document.getElementById('regName');
  const emailEl = document.getElementById('regEmail');
  const passEl  = document.getElementById('regPassword');
  const confEl  = document.getElementById('regConfirm');
  const termsEl = document.getElementById('terms');

  const errBox = document.getElementById('regError');
  const okBox  = document.getElementById('regSuccess');

  function setErr(input, msg){
    input.classList.add('error');
    const small = input.closest('.field').querySelector('.error-msg');
    if (small) small.textContent = msg;
  }
  function clearErr(input){
    input.classList.remove('error');
    const small = input.closest('.field').querySelector('.error-msg');
    if (small) small.textContent = '';
  }

  // show/hide for both password fields
  form.querySelectorAll('.eye-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-eye');
      const input = document.getElementById(targetId);
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      btn.innerHTML = isPwd ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errBox.hidden = true;
    okBox.hidden = true;

    let ok = true;

    // name
    if (nameEl.value.trim().length < 3){
      setErr(nameEl, 'Please enter at least 3 characters.');
      ok = false;
    } else { clearErr(nameEl); }

    // email
    const emOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim());
    if (!emOK){ setErr(emailEl, 'Please enter a valid email.'); ok = false; }
    else { clearErr(emailEl); }

    // password
    if (passEl.value.trim().length < 6){
      setErr(passEl, 'Password must be at least 6 characters.');
      ok = false;
    } else { clearErr(passEl); }

    // confirm
    if (confEl.value !== passEl.value || confEl.value.trim() === ''){
      setErr(confEl, 'Passwords do not match.');
      ok = false;
    } else { clearErr(confEl); }

    // terms
    if (!termsEl.checked){
      // نلوّن النص كتنبيه بسيط
      termsEl.closest('.checkbox').style.filter = 'drop-shadow(0 0 4px rgba(255,105,180,.6))';
      ok = false;
      setTimeout(() => termsEl.closest('.checkbox').style.filter = '', 1000);
    }

    if (!ok){ errBox.hidden = false; return; }

    okBox.hidden = false;   // Demo only
    form.reset();
  });
});

