const storageKeys = {
  theme: 'corona_theme',
  language: 'corona_language',
  ageBlocked: 'corona_age_blocked',
  application: 'corona_application'
};

// WARNING:
// This sends data directly from the frontend to Telegram Bot API.
// Your bot token will be visible in public source code on GitHub Pages.
const BOT_TOKEN = '8524790227:AAF0nSYxaPnFqk3x_jCyV79shUTV5JhJsE0';
const CHAT_ID = '8284642747';

const page = document.getElementById('page');
const desktopGate = document.getElementById('desktopGate');
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const themePanel = document.getElementById('themePanel');
const languagePanel = document.getElementById('languagePanel');
const themeButtons = document.querySelectorAll('[data-theme-value]');
const languageButtons = document.querySelectorAll('[data-lang]');
const revealItems = document.querySelectorAll('.reveal');
const toast = document.getElementById('toast');
const eyesWidget = document.getElementById('eyesWidget');
const form = document.getElementById('applicationForm');
const applicationGate = document.getElementById('applicationGate');
const formStatus = document.getElementById('formStatus');
const submitButton = document.getElementById('submitButton');
const contactButtons = document.querySelectorAll('.choice-button');
const contactInput = document.getElementById('contact');
const audio = document.getElementById('backgroundAudio');
const playMusic = document.getElementById('playMusic');
const muteMusic = document.getElementById('muteMusic');

let selectedLanguage = 'uk';
let selectedContactType = '';
let toastTimer = null;
let lastScrollY = window.scrollY;
let lastScrollTime = Date.now();
let scrollToastCooldown = 0;
let ruCooldown = 0;
let audioContext = null;

const dictionary = {
  uk: {
    desktop: {
      title: 'Цей сайт доступний тільки на телефоні',
      text: 'Відкрийте ...:::CORONA:::... зі смартфона, щоб отримати доступ до повного premium mobile experience.'
    },
    hero: {
      eyebrow: 'Елітний mobile access',
      subtitle: 'Елітна сім\'я UA Online',
      description: 'Закритий клуб для тих, хто цінує статус, дисципліну, внутрішню вагу та чистий стиль гри. Кожна деталь побудована як дорогий мобільний інтерфейс доступу.',
      signalLabel: 'Сигнал',
      signalValue: 'Premium entry protocol active',
      cta: 'Вступити в сім\'ю'
    },
    rules: {
      eyebrow: 'Правила клубу',
      title: 'Наші правила',
      card1: { title: 'Правило 1', text: 'Поважай слово сім\'ї, тримай дисципліну та не підставляй своїх.' },
      card2: { title: 'Правило 2', text: 'Зберігай стиль, спокій і контроль навіть у тиску та хаосі.' },
      card3: { title: 'Правило 3', text: 'Тримай репутацію CORONA на рівні у грі, чаті та взаємодії з іншими.' },
      card4: { title: 'Правило 4', text: 'Закритість клубу це сила: не винось внутрішні речі назовні.' }
    },
    leaders: {
      eyebrow: 'Core command',
      title: 'Керівництво',
      leadRole: 'Лідер сім\'ї',
      leadText: 'Керує напрямком, стилем та внутрішньою вагою CORONA FAM.',
      deputyRole: 'Заступник',
      deputy1: 'Точність дій, контроль ситуації та жорсткий порядок.',
      deputy2: 'Маневреність, тиск і готовність діяти в гострих моментах.',
      deputy3: 'Тактична підтримка, баланс та внутрішня координація клубу.'
    },
    garage: {
      eyebrow: 'Luxury garage',
      title: 'Автопарк',
      cardTitle: 'В сім\'ї 19 дорогих автомобілів',
      cardText: 'Преміальний автопарк підкреслює статус, мобільність і силу сім\'ї без зайвого шуму.'
    },
    location: {
      eyebrow: 'Secure route',
      title: 'Локація'
    },
    ranks: {
      eyebrow: 'Access hierarchy',
      title: 'Ранги та доступ',
      item1: { title: '1–5 ранги', text: 'Новачки, які освоюються в сім\'ї.' },
      item2: { title: '6–7 ранги', text: 'Свої.' },
      item3: { title: '8 ранг', text: 'Стрілки.' },
      item4: { title: '9–10 ранги', text: 'Керівництво.' }
    },
    form: {
      eyebrow: 'Join request',
      title: 'Форма вступу',
      nickname: 'Ваш нік',
      age: 'Скільки вам років',
      reason: 'Чому саме ми',
      contactType: 'Спосіб зв\'язку',
      submit: 'Подати заявку',
      loading: 'Відправка...',
      success: 'Заявка успішно подана. Очікуйте на подальший зв\'язок.',
      blocked: 'Подача заявки недоступна. Ми набираємо в сім\'ю тільки від 14 років і вище.',
      ageDenied: 'Ми набираємо в сім\'ю тільки від 14 років і вище',
      nicknameError: 'Нік має бути тільки у форматі Nick_Name.',
      ageError: 'Вкажіть ваш справжній вік.',
      reasonError: 'Мінімум 20 символів.',
      contactTypeError: 'Оберіть Telegram або Discord.',
      contactError: 'Поле контакту обов\'язкове і має починатися з @',
      networkError: 'Не вдалося відправити заявку. Перевірте токен, chat_id або спробуйте пізніше.'
    },
    music: {
      eyebrow: 'Atmosphere',
      title: 'Фонова музика'
    },
    footer: {
      text: 'Створено та розроблено A.Yuuki спеціально для CORONA FAM'
    },
    toast: {
      unsupportedRu: 'Ми не підтримуємо росію 😒 Спробуй нормальну мову 🇺🇦',
      fastScroll: [
        'Спокійніше... ти щось шукаєш? 👀',
        'Не поспішай, тут є що подивитись 😏',
        'Швидко гортаєш... підозріло'
      ]
    },
    labels: {
      newApplication: 'Нова заявка в сім\'ю CORONA',
      nickname: 'Нік',
      age: 'Вік',
      reason: 'Причина вступу',
      contactType: 'Спосіб зв\'язку',
      contact: 'Контакт',
      language: 'Мова сайту',
      timestamp: 'Час подачі'
    }
  },
  en: {
    desktop: {
      title: 'This site is available only on a phone',
      text: 'Open ...:::CORONA:::... on a smartphone to access the full premium mobile experience.'
    },
    hero: {
      eyebrow: 'Elite mobile access',
      subtitle: 'Elite UA Online family',
      description: 'A private club for players who value status, discipline, internal weight and clean style. Every detail is designed like a premium mobile entry interface.',
      signalLabel: 'Signal',
      signalValue: 'Premium entry protocol active',
      cta: 'Join the family'
    },
    rules: {
      eyebrow: 'Club rules',
      title: 'Our Rules',
      card1: { title: 'Rule 1', text: 'Respect the family word, keep discipline and never set up your own people.' },
      card2: { title: 'Rule 2', text: 'Keep style, calm and control even under pressure and chaos.' },
      card3: { title: 'Rule 3', text: 'Keep CORONA reputation high in gameplay, chat and every interaction.' },
      card4: { title: 'Rule 4', text: 'The club stays strong because it stays closed. Do not leak internal matters.' }
    },
    leaders: {
      eyebrow: 'Core command',
      title: 'Leadership',
      leadRole: 'Family leader',
      leadText: 'Controls direction, style and the internal weight of CORONA FAM.',
      deputyRole: 'Deputy',
      deputy1: 'Precision, control and strict order in every move.',
      deputy2: 'Mobility, pressure and readiness in sharp situations.',
      deputy3: 'Tactical support, balance and internal coordination.'
    },
    garage: {
      eyebrow: 'Luxury garage',
      title: 'Garage',
      cardTitle: 'The family owns 19 expensive cars',
      cardText: 'The premium garage reflects status, mobility and quiet strength.'
    },
    location: {
      eyebrow: 'Secure route',
      title: 'Location'
    },
    ranks: {
      eyebrow: 'Access hierarchy',
      title: 'Ranks and Access',
      item1: { title: 'Ranks 1–5', text: 'Newcomers adapting inside the family.' },
      item2: { title: 'Ranks 6–7', text: 'Trusted insiders.' },
      item3: { title: 'Rank 8', text: 'Shooters.' },
      item4: { title: 'Ranks 9–10', text: 'Leadership.' }
    },
    form: {
      eyebrow: 'Join request',
      title: 'Application Form',
      nickname: 'Your nickname',
      age: 'Your age',
      reason: 'Why us',
      contactType: 'Contact method',
      submit: 'Submit application',
      loading: 'Sending...',
      success: 'Application sent successfully. Wait for further contact.',
      blocked: 'Applications are unavailable. We recruit only from the age of 14 and above.',
      ageDenied: 'We recruit only from the age of 14 and above',
      nicknameError: 'Nickname must be in Nick_Name format only.',
      ageError: 'Enter your real age.',
      reasonError: 'Minimum 20 characters required.',
      contactTypeError: 'Choose Telegram or Discord.',
      contactError: 'Contact field is required and must start with @',
      networkError: 'Failed to send the application. Check bot token, chat id or try again later.'
    },
    music: {
      eyebrow: 'Atmosphere',
      title: 'Background Music'
    },
    footer: {
      text: 'Created and developed by A.Yuuki specially for CORONA FAM'
    },
    toast: {
      unsupportedRu: 'We do not support russia 😒 Try a normal language 🇺🇦',
      fastScroll: [
        'Slow down... are you looking for something? 👀',
        'Take it easy, there is something to see here 😏',
        'Scrolling fast... suspicious'
      ]
    },
    labels: {
      newApplication: 'New CORONA family application',
      nickname: 'Nickname',
      age: 'Age',
      reason: 'Reason for joining',
      contactType: 'Contact method',
      contact: 'Contact',
      language: 'Site language',
      timestamp: 'Submission time'
    }
  }
};

function isPhoneDevice() {
  const width = window.innerWidth;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const ua = navigator.userAgent;
  const mobileUA = /Android.+Mobile|iPhone|iPod|Windows Phone|webOS|BlackBerry|Opera Mini/i.test(ua);
  return width < 768 && coarsePointer && mobileUA;
}

function applyDeviceMode() {
  const mobile = isPhoneDevice();
  page.classList.toggle('is-hidden', !mobile);
  desktopGate.classList.toggle('is-visible', !mobile);
}

function getNestedValue(source, path) {
  return path.split('.').reduce((acc, key) => acc && acc[key], source);
}

function setTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem(storageKeys.theme, themeName);
  themeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.themeValue === themeName);
  });
}

function applyLanguage(lang) {
  const fallback = dictionary.uk;
  const source = dictionary[lang] || fallback;
  selectedLanguage = lang;
  localStorage.setItem(storageKeys.language, lang);

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    const value = getNestedValue(source, key) || getNestedValue(fallback, key);
    if (typeof value === 'string') {
      node.textContent = value;
    }
  });

  languageButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === lang);
  });

  const submitDefault = source.form.submit;
  if (submitButton && !submitButton.classList.contains('is-loading')) {
    submitButton.textContent = submitDefault;
  }

  if (localStorage.getItem(storageKeys.ageBlocked) === 'true') {
    renderBlockedState();
  }
}

function showToast(message, variant = '') {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `toast${variant ? ` is-${variant}` : ''}`;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2800);
}

function playErrorSound() {
  const now = Date.now();
  if (now < ruCooldown) return;

  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(380, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.14);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.03, audioContext.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.16);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.17);
}

function initPanels() {
  themeToggle.addEventListener('click', () => {
    themePanel.classList.toggle('is-open');
    languagePanel.classList.remove('is-open');
  });

  langToggle.addEventListener('click', () => {
    languagePanel.classList.toggle('is-open');
    themePanel.classList.remove('is-open');
  });

  document.addEventListener('click', (event) => {
    if (!themePanel.contains(event.target) && !themeToggle.contains(event.target)) {
      themePanel.classList.remove('is-open');
    }

    if (!languagePanel.contains(event.target) && !langToggle.contains(event.target)) {
      languagePanel.classList.remove('is-open');
    }
  });

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setTheme(button.dataset.themeValue);
      themePanel.classList.remove('is-open');
    });
  });

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.lang === 'ru') {
        const currentTime = Date.now();
        if (currentTime > ruCooldown) {
          showToast(dictionary[selectedLanguage].toast.unsupportedRu, 'warning');
          languagePanel.classList.add('is-shaking');
          playErrorSound();
          setTimeout(() => languagePanel.classList.remove('is-shaking'), 430);
          ruCooldown = currentTime + 1800;
        }
        languagePanel.classList.remove('is-open');
        return;
      }

      applyLanguage(button.dataset.lang);
      languagePanel.classList.remove('is-open');
    });
  });
}

function initEyesTracking() {
  if (!eyesWidget) return;

  const leftPupil = eyesWidget.querySelector('.eye-pupil--left');
  const rightPupil = eyesWidget.querySelector('.eye-pupil--right');
  const leftCore = eyesWidget.querySelector('.eye-core--left');
  const rightCore = eyesWidget.querySelector('.eye-core--right');

  const moveEyes = (clientX, clientY) => {
    const rect = eyesWidget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = Math.max(-1, Math.min(1, (clientX - centerX) / rect.width));
    const offsetY = Math.max(-1, Math.min(1, (clientY - centerY) / rect.height));
    const x = offsetX * 6;
    const y = offsetY * 4;

    [leftPupil, rightPupil, leftCore, rightCore].forEach((node) => {
      node.style.transform = `translate(${x}px, ${y}px)`;
    });
  };

  window.addEventListener('pointermove', (event) => {
    moveEyes(event.clientX, event.clientY);
  }, { passive: true });

  window.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    if (touch) {
      moveEyes(touch.clientX, touch.clientY);
    }
  }, { passive: true });
}

function initScrollSpeedWatcher() {
  window.addEventListener('scroll', () => {
    const now = Date.now();
    const deltaY = Math.abs(window.scrollY - lastScrollY);
    const deltaTime = Math.max(now - lastScrollTime, 16);
    const speed = deltaY / deltaTime;

    if (speed > 2.2 && now > scrollToastCooldown) {
      const messages = dictionary[selectedLanguage].toast.fastScroll;
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      showToast(randomMessage);
      scrollToastCooldown = now + 7000;
    }

    lastScrollY = window.scrollY;
    lastScrollTime = now;
  }, { passive: true });
}

function initReveal() {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealItems.forEach((item) => observer.observe(item));
}

function addRipple(event) {
  const target = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(target.clientWidth, target.clientHeight);
  const radius = diameter / 2;
  circle.className = 'ripple';
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - target.getBoundingClientRect().left - radius}px`;
  circle.style.top = `${event.clientY - target.getBoundingClientRect().top - radius}px`;

  const existing = target.querySelector('.ripple');
  if (existing) existing.remove();

  target.appendChild(circle);
}

function initRipple() {
  document.querySelectorAll('.ripple-button').forEach((node) => {
    node.addEventListener('click', addRipple);
  });
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach((node) => {
    node.textContent = '';
  });
  formStatus.className = 'form-status';
  formStatus.textContent = '';
}

function showError(field, message) {
  const node = document.querySelector(`[data-error-for="${field}"]`);
  if (node) node.textContent = message;
}

function renderBlockedState() {
  const text = dictionary[selectedLanguage].form.blocked;
  applicationGate.innerHTML = `
    <div class="application-locked">
      <p>${text}</p>
    </div>
  `;
}

function validateForm(values) {
  let isValid = true;
  const t = dictionary[selectedLanguage].form;
  const nicknamePattern = /^[A-Za-z]+_[A-Za-z]+$/;

  if (!nicknamePattern.test(values.nickname)) {
    showError('nickname', t.nicknameError);
    isValid = false;
  }

  if (!values.age || Number.isNaN(values.age)) {
    showError('age', t.ageError);
    isValid = false;
  } else if (values.age < 14) {
    showError('age', t.ageDenied);
    localStorage.setItem(storageKeys.ageBlocked, 'true');
    formStatus.className = 'form-status is-error';
    formStatus.textContent = t.ageDenied;
    renderBlockedState();
    return false;
  }

  if (values.reason.trim().length < 20) {
    showError('reason', t.reasonError);
    isValid = false;
  }

  if (!selectedContactType) {
    showError('contact', t.contactTypeError);
    isValid = false;
  }

  if (!values.contact.startsWith('@') || values.contact.trim().length < 2) {
    showError('contact', t.contactError);
    isValid = false;
  }

  return isValid;
}

function buildTelegramPayload(values) {
  const labels = dictionary[selectedLanguage].labels;
  const timestamp = new Date().toLocaleString(selectedLanguage === 'uk' ? 'uk-UA' : 'en-US');

  return {
    text:
`${labels.newApplication}

${labels.nickname}: ${values.nickname}
${labels.age}: ${values.age}
${labels.reason}: ${values.reason}
${labels.contactType}: ${selectedContactType}
${labels.contact}: ${values.contact}
${labels.language}: ${selectedLanguage}
${labels.timestamp}: ${timestamp}`,
    nickname: values.nickname,
    age: values.age,
    reason: values.reason,
    contactType: selectedContactType,
    contactValue: values.contact,
    selectedLanguage,
    timestamp
  };
}

async function sendApplication(payload) {
  if (!BOT_TOKEN || BOT_TOKEN === 'PASTE_YOUR_TELEGRAM_BOT_TOKEN_HERE') {
    throw new Error('Missing BOT_TOKEN');
  }

  if (!CHAT_ID || CHAT_ID === 'PASTE_YOUR_TELEGRAM_CHAT_ID_HERE') {
    throw new Error('Missing CHAT_ID');
  }

  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: payload.text,
      disable_web_page_preview: true
    })
  });

  if (!response.ok) {
    throw new Error('Request failed');
  }

  return response.json().catch(() => ({}));
}

function setSubmitLoading(loading) {
  submitButton.disabled = loading;
  submitButton.classList.toggle('is-loading', loading);
  submitButton.textContent = loading
    ? dictionary[selectedLanguage].form.loading
    : dictionary[selectedLanguage].form.submit;
}

function initForm() {
  if (localStorage.getItem(storageKeys.ageBlocked) === 'true') {
    renderBlockedState();
    return;
  }

  contactButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedContactType = button.dataset.contactType;
      contactButtons.forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      if (!contactInput.value.startsWith('@')) {
        contactInput.value = '@';
      }
      contactInput.focus();
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    const values = {
      nickname: form.nickname.value.trim(),
      age: Number(form.age.value),
      reason: form.reason.value.trim(),
      contact: form.contact.value.trim()
    };

    if (!validateForm(values)) return;

    const payload = buildTelegramPayload(values);
    setSubmitLoading(true);

    try {
      await sendApplication(payload);
      localStorage.setItem(storageKeys.application, JSON.stringify(payload));
      formStatus.className = 'form-status is-success';
      formStatus.textContent = dictionary[selectedLanguage].form.success;
      form.reset();
      contactInput.value = '';
      selectedContactType = '';
      contactButtons.forEach((item) => item.classList.remove('is-active'));
    } catch (error) {
      formStatus.className = 'form-status is-error';
      formStatus.textContent = dictionary[selectedLanguage].form.networkError;
    } finally {
      setSubmitLoading(false);
    }
  });
}

function initAudio() {
  playMusic.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
        playMusic.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>';
      } catch (error) {
        showToast(dictionary[selectedLanguage].form.networkError);
      }
    } else {
      audio.pause();
      playMusic.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>';
    }
  });

  muteMusic.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteMusic.innerHTML = audio.muted
      ? '<svg viewBox="0 0 24 24"><path d="M5 9h4l5-4v14l-5-4H5z" /><path d="M17 9l4 4m0-4l-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M5 9h4l5-4v14l-5-4H5z" /><path d="M17 9a4 4 0 010 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>';
  });
}

function initState() {
  const savedTheme = localStorage.getItem(storageKeys.theme) || 'neon-purple';
  const savedLanguage = localStorage.getItem(storageKeys.language) || 'uk';
  setTheme(savedTheme);
  applyLanguage(savedLanguage);
}

applyDeviceMode();
initState();
initPanels();
initReveal();
initRipple();
initEyesTracking();
initScrollSpeedWatcher();
initForm();
initAudio();
window.addEventListener('resize', applyDeviceMode);
