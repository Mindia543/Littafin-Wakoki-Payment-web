(() => {
  'use strict';

  const presets = [...document.querySelectorAll('.amount-option')];
  const customAmount = document.getElementById('custom-amount');
  const summary = document.getElementById('amount-summary');
  const bankSelect = document.getElementById('bank-select');
  const bankHint = document.getElementById('bank-hint');
  const form = document.getElementById('payment-form');
  const error = document.getElementById('form-error');
  const toast = document.getElementById('toast');
  let toastTimer;

  const recipientAccount = '1310242672';
  const banks = {
    access: { code: (amount) => `*901*2*${amount}*${recipientAccount}%23`, display: '*901*2*amount*account#', note: 'Access Bank transfer details are ready. Review the recipient and amount in your bank prompt.' },
    uba: { code: (amount) => `*919*4*${recipientAccount}*${amount}%23`, display: '*919*4*account*amount#', note: 'UBA interbank transfer details are ready. Review the recipient and amount in your bank prompt.' },
    union: { code: () => '*826%23', display: '*826#', note: 'Union Bank menu opened. Follow your bank prompts to complete the transfer.' },
    zenith: { code: () => '*966%23', display: '*966#', note: 'Zenith Bank menu opened. Follow your bank prompts to complete the transfer.' },
    first: { code: (amount) => `*894*${amount}*${recipientAccount}%23`, display: '*894*amount*account#', note: 'First Bank transfer details are ready. Review the recipient and amount in your bank prompt.' },
    gtbank: { code: (amount) => `*737*2*${amount}*${recipientAccount}%23`, display: '*737*2*amount*account#', note: 'GTBank transfer details are ready. Review the recipient and amount in your bank prompt.' },
    ecobank: { code: () => '*326%23', display: '*326#', note: 'Ecobank menu opened. Follow your bank prompts to complete the transfer.' },
    fcmb: { code: (amount) => `*329*${amount}*${recipientAccount}%23`, display: '*329*amount*account#', note: 'FCMB transfer details are ready. Review the recipient and amount in your bank prompt.' },
    opay: { code: () => '*955%23', display: '*955#', note: 'OPay menu opened. Follow your app prompts to complete the transfer.' },
    palmpay: { code: () => '*861%23', display: '*861#', note: 'PalmPay menu opened. Follow your app prompts to complete the transfer.' }
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
    const bank = banks[bankSelect.value];
    const directTransferBanks = ['access', 'uba', 'first', 'gtbank', 'fcmb'];
    bankHint.textContent = bank
      ? `${bank.display} will open on your phone. ${directTransferBanks.includes(bankSelect.value) ? 'The transfer code includes the contribution details; verify the recipient and amount in your bank prompt.' : 'Follow your bank menu and provide the ministry account and contribution amount there.'}`
      : 'The phone number you use should be registered with your bank.';
    error.textContent = '';
  });

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 5200);
  }

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
    showToast(`${bank.note} Never share your PIN. If your device does not open the dialer, dial ${bank.display} manually.`);
    // Browsers can only request a dialer handoff. They cannot submit a USSD
    // session or authorize a transfer; the customer must review and confirm.
    window.location.href = dialUri;
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
