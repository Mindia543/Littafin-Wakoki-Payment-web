(() => {
  'use strict';

  const presets = [...document.querySelectorAll('.amount-option')];
  const customAmount = document.getElementById('custom-amount');
  const summary = document.getElementById('amount-summary');
  const bankSelect = document.getElementById('bank-select');
  const form = document.getElementById('payment-form');
  const error = document.getElementById('form-error');

  const recipientAccount = '1310242672';
  const banks = {
    access: { code: (amount) => `*901*${amount}*${recipientAccount}%23`, display: '*901*amount*account#' },
    uba: { code: (amount) => `*919*4*${recipientAccount}*${amount}%23`, display: '*919*4*account*amount#' },
    union: { code: () => '*826%23', display: '*826#' },
    zenith: { code: () => '*966%23', display: '*966#' },
    first: { code: (amount) => `*894*${amount}*${recipientAccount}%23`, display: '*894*amount*account#' },
    gtbank: { code: (amount) => `*737*2*${amount}*${recipientAccount}%23`, display: '*737*2*amount*account#' },
    ecobank: { code: () => '*326%23', display: '*326#' },
    fcmb: { code: (amount) => `*329*${amount}*${recipientAccount}%23`, display: '*329*amount*account#' },
    opay: { code: () => '*955%23', display: '*955#' },
    palmpay: { code: () => '*861%23', display: '*861#' }
  };

  const formatNaira = (amount) => `₦${Number(amount).toLocaleString('en-NG')}`;

  function setAmount(value) {
    const amount = Number(value);
    summary.textContent = Number.isSafeInteger(amount) && amount > 0 ? formatNaira(amount) : 'Enter amount';
  }

  presets.forEach((button) => button.addEventListener('click', () => {
    customAmount.value = button.dataset.amount;
    presets.forEach((item) => item.classList.toggle('active', item === button));
    setAmount(button.dataset.amount);
    error.textContent = '';
  }));

  customAmount.addEventListener('input', () => {
    setAmount(customAmount.value);
    presets.forEach((item) => item.classList.toggle('active', item.dataset.amount === customAmount.value));
    error.textContent = '';
  });

  bankSelect.addEventListener('change', () => {
    error.textContent = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    error.textContent = '';
    const amount = Number(customAmount.value);
    if (!Number.isSafeInteger(amount) || amount < 100) {
      error.textContent = 'Enter a valid amount and try again.';
      customAmount.focus();
      return;
    }
    if (amount > 2147483647) {
      error.textContent = 'Enter a valid amount and try again.';
      customAmount.focus();
      return;
    }
    const bank = banks[bankSelect.value];
    if (!bank) {
      error.textContent = 'Select your bank to continue.';
      bankSelect.focus();
      return;
    }

    const dialCode = bank.code(amount);
    const dialUri = `tel:${dialCode}`;
    // A website can hand the selected USSD code to the phone app. Android
    // requires the user to confirm the call in the dialer.
    window.location.href = dialUri;
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
