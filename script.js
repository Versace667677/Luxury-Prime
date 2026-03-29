const storageKeys = {
  theme: 'corona_theme',
  ageBlocked: 'corona_age_blocked',
  application: 'corona_application'
};

const appShell = document.getElementById('appShell');
const deviceGate = document.getElementById('deviceGate');
const themeToggle = document.getElementById('themeToggle');
const themePanel = document.getElementById('themePanel');
const themeButtons = document.querySelectorAll('[data-theme-value]');
const form = document.getElementById('applicationForm');
const applicationGate = document.getElementById('applicationGate');
const formStatus = document.getElementById('formStatus');
const contactButtons = document.querySelectorAll('.choice-button');
const contactInput = document.getElementById('contact');
const playButton = document.getElementById('playMusic');
const muteButton = document.getElementById('muteMusic');
const backgroundAudio = document.getElementById('backgroundAudio');

let selectedContactType = '';

function isPhoneDevice() {
  const width = window.innerWidth;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const mobileUA = /Android.+Mobile|iPhone|iPod|Windows Phone|webOS|BlackBerry|Opera Mini/i.test(navigator.userAgent);

  return width < 768 && coarsePointer && mobileUA;
}

function applyDeviceMode() {
  const mobile = isPhoneDevice();

  appShell.classList.toggle('is-hidden', !mobile);
  deviceGate.classList.toggle('is-visible', !mobile);
}

function setTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem(storageKeys.theme, themeName);

  themeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.themeValue === themeName);
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem(storageKeys.theme) || 'neon-purple';
  setTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    themePanel.classList.toggle('is-open');
  });

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setTheme(button.dataset.themeValue);
      themePanel.classList.remove('is-open');
    });
  });

  document.addEventListener('click', (event) => {
    if (!themePanel.contains(event.target) && !themeToggle.contains(event.target)) {
      themePanel.classList.remove('is-open');
    }
  });
}

function showError(field, message) {
  const target = document.querySelector(`[data-error-for="${field}"]`);
  if (target) target.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach((node) => {
    node.textContent = '';
  });

  formStatus.className = 'form-status';
  formStatus.textContent = '';
}

function renderBlockedState() {
  applicationGate.innerHTML = `
    <div class="application-blocked">
      Подача заявки недоступна. Ми набираємо в сім'ю тільки від 14 років і вище.
    </div>
  `;
}

function validateForm(values) {
  let valid = true;
  const nicknamePattern = /^[A-Za-z]+_[A-Za-z]+$/;

  if (!nicknamePattern.test(values.nickname)) {
    showError('nickname', 'Нік має бути тільки у форматі Nick_Name.');
    valid = false;
  }

  if (!values.age || Number.isNaN(values.age)) {
    showError('age', 'Вкажіть ваш справжній вік.');
    valid = false;
  } else if (values.age < 14) {
    showError('age', 'Ми набираємо в сім\'ю тільки від 14 років і вище');
    localStorage.setItem(storageKeys.ageBlocked, 'true');
    formStatus.className = 'form-status is-error';
    formStatus.textContent = 'Ми набираємо в сім\'ю тільки від 14 років і вище';
    renderBlockedState();
    return false;
  }

  if (values.reason.length < 20) {
    showError('reason', 'Мінімум 20 символів.');
    valid = false;
  }

  if (!selectedContactType) {
    showError('contact', 'Оберіть Telegram або Discord.');
    valid = false;
  }

  if (!values.contact.startsWith('@') || values.contact.length < 2) {
    showError('contact', 'Поле контакту обов\'язкове і має починатися з @');
    valid = false;
  }

  return valid;
}

function initForm() {
  if (localStorage.getItem(storageKeys.ageBlocked) === 'true') {
    renderBlockedState();
    return;
  }

  contactButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedContactType = button.dataset.contactType;
      contactButtons.forEach((node) => node.classList.remove('is-active'));
      button.classList.add('is-active');

      if (!contactInput.value.startsWith('@')) {
        contactInput.value = '@';
      }

      contactInput.focus();
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    const values = {
      nickname: form.nickname.value.trim(),
      age: Number(form.age.value),
      reason: form.reason.value.trim(),
      contact: form.contact.value.trim()
    };

    if (!validateForm(values)) {
      return;
    }

    localStorage.setItem(storageKeys.application, JSON.stringify({
      ...values,
      contactType: selectedContactType,
      createdAt: new Date().toISOString()
    }));

    formStatus.className = 'form-status is-success';
    formStatus.textContent = 'Заявка успішно подана. Очікуйте на подальший зв\'язок.';
    form.reset();
    contactInput.value = '';
    selectedContactType = '';
    contactButtons.forEach((node) => node.classList.remove('is-active'));
  });
}

function initAudio() {
  playButton.addEventListener('click', async () => {
    if (backgroundAudio.paused) {
      try {
        await backgroundAudio.play();
        playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
      } catch (error) {
        formStatus.className = 'form-status is-error';
        formStatus.textContent = 'Браузер заблокував відтворення. Натисніть ще раз.';
      }
    } else {
      backgroundAudio.pause();
      playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
  });

  muteButton.addEventListener('click', () => {
    backgroundAudio.muted = !backgroundAudio.muted;
    muteButton.innerHTML = backgroundAudio.muted
      ? '<i class="fa-solid fa-volume-xmark"></i>'
      : '<i class="fa-solid fa-volume-high"></i>';
  });
}

applyDeviceMode();
initTheme();
initForm();
initAudio();
window.addEventListener('resize', applyDeviceMode);
