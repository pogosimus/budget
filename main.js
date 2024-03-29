let balance = document.getElementById('viewer');
const addBtn = document.getElementById('add-income');
const subtractBtn = document.getElementById('add-expense');
let inputIncome = document.getElementById('input-income');
const inputExpense = document.getElementById('input-expense');
const incomeLog = document.getElementById('input-source-income');
const expenseLog = document.getElementById('input-source-expense');
const logs = document.querySelector('.logs-ul');
const earnedDisplay = document.querySelector('.earned-display');
const spentDisplay = document.querySelector('.spent-display');
const labels = document.querySelectorAll('.inputs label');
const toggle = document.querySelector('.toggle');

loadEventListeners();

function loadEventListeners() {
  // DOM Load event
  document.addEventListener('DOMContentLoaded', getLogs);
  // Add income event
  addBtn.addEventListener('click', addIncome);
  // Add expense event
  subtractBtn.addEventListener('click', addExpense);
  // dark mode
  toggle.addEventListener('click', darkMode);
}

// Get incomes, expenses and balance from LS
function getLogs() {
  // Get incomes
  let incomeAmounts;
  if (localStorage.getItem('incomeAmounts') === null) {
    incomeAmounts = [];
  } else {
    incomeAmounts = JSON.parse(localStorage.getItem('incomeAmounts'));
  }
  incomeAmounts.forEach((incomeAmount) => {
    if (
      typeof incomeAmount.date !== 'undefined' &&
      !logs.innerHTML.includes(incomeAmount.date)
    ) {
      logs.innerHTML += `
        <li class="log-date-item">${incomeAmount.date}</li> 
        <li class="log-item"><p class="income-name">${incomeAmount.incName}</p>  <h4 class="income-amount">+${incomeAmount.incomeAmount}</h4></li>
      `;
    } else {
      logs.innerHTML += `
        <li class="log-item"><p class="income-name">${incomeAmount.incName}</p>  <h4 class="income-name">+${incomeAmount.incomeAmount}</h4></li>
      `;
    }
  });

  // Get expenses
  let expenseAmounts;
  if (localStorage.getItem('expenseAmounts') === null) {
    expenseAmounts = [];
  } else {
    expenseAmounts = JSON.parse(localStorage.getItem('expenseAmounts'));
  }
  expenseAmounts.forEach((expenseAmount) => {
    if (
      typeof expenseAmount.date !== 'undefined' &&
      !logs.innerHTML.includes(expenseAmount.date)
    ) {
      logs.innerHTML += `
      <li class="log-date-item">${expenseAmount.date}</li> 
      <li class="log-item"><p class="expense-name">${expenseAmount.expenseName}</p>  <h4 class="expense-amount">-${expenseAmount.expenseAmount}</h4></li>
    `;
    } else {
      logs.innerHTML += `
      <li class="log-item"><p class="expense-name">${expenseAmount.expenseName}</p>  <h4 class="expense-amount">-${expenseAmount.expenseAmount}</h4></li>
    `;
    }
  });

  // Get balance
  if (localStorage.getItem('balance') === null) {
    balance.innerText = 0;
  } else {
    balance.innerText = JSON.parse(localStorage.getItem('balance'));
  }

  // Get monthly earned value
  const earnMonthCheck = JSON.parse(localStorage.getItem('earnMonth'));
  const month = new Date().toLocaleString('default', { month: 'long' });
  if (earnMonthCheck === null || earnMonthCheck[0].month !== month) {
  } else {
    earnedDisplay.innerText = earnMonthCheck[0].earnDisp;
  }

  // Get monthly costs value
  const spentMonthCheck = JSON.parse(localStorage.getItem('spentMonth'));
  if (spentMonthCheck === null || spentMonthCheck[0].month !== month) {
    spentDisplay.innerText = 0;
  } else {
    spentDisplay.innerText = spentMonthCheck[0].spentDisp;
  }
}

// Add balance changes
function addIncome() {
  let date = new Date().toLocaleDateString();
  incName = capitalizeFirstLetter(incomeLog.value);
  if (inputIncome.value === '') {
    showAlert('Enter a valid number', 'alert-red');
  } else {
    incomeToLS();
    balance.innerText = (
      +balance.innerText + parseFloat(inputIncome.value)
    ).toFixed(2);
    earnedDisplay.innerText = (
      +earnedDisplay.innerText + parseFloat(inputIncome.value)
    ).toFixed(2);
    localStorage.setItem('balance', JSON.stringify(balance.innerText));
    earnMonthToLS();
    if (logs.innerHTML.includes(new Date().toLocaleDateString())) {
      logs.innerHTML += ` 
      <li class="log-item"><p class="income-name">${incName}</p>  <h4 class="income-amount">+${parseFloat(
        inputIncome.value
      ).toFixed(2)}</h4></li>
      `;
    } else {
      logs.innerHTML += `
        <li class="log-date-item">${date}</li> 
        <li class="log-item"><p class="income-name">${incName}</p>  <h4 class="income-amount">+${parseFloat(
        inputIncome.value
      ).toFixed(2)}</h4></li>
      `;
    }
  }

  inputIncome.value = '';
  incomeLog.value = '';
}

function addExpense() {
  let date = new Date().toLocaleDateString();
  const expName = capitalizeFirstLetter(expenseLog.value);
  if (inputExpense.value === '') {
    showAlert('Enter a valid number', 'alert-red');
  } else {
    expenseToLS();
    balance.innerText = (balance.innerText - inputExpense.value).toFixed(2);
    spentDisplay.innerText = (
      +spentDisplay.innerText + parseFloat(inputExpense.value)
    ).toFixed(2);
    localStorage.setItem('balance', JSON.stringify(balance.innerText));
    spentMonthToLS();
    if (logs.innerHTML.includes(new Date().toLocaleDateString())) {
      logs.innerHTML += ` 
      <li class="log-item"><p class="expense-name">${expName}</p>  <h4 class="expense-amount">-${parseFloat(
        inputExpense.value
      ).toFixed(2)}</h4></li>
    `;
    } else {
      logs.innerHTML += `
        <li class="log-date-item">${date}</li> 
        <li class="log-item"><p class="expense-name">${expName}</p>  <h4 class="expense-amount">-${parseFloat(
        inputExpense.value
      ).toFixed(2)}</h4></li>
      `;
    }
  }
  inputExpense.value = '';
  expenseLog.value = '';
}

// Add to LS
function incomeToLS() {
  // Add income logs to LS
  const incomeAmount = inputIncome.value;
  const incName = capitalizeFirstLetter(incomeLog.value);
  let date = new Date().toLocaleDateString();
  let incomeAmounts;
  if (localStorage.getItem('incomeAmounts') === null) {
    incomeAmounts = [];
  } else {
    incomeAmounts = JSON.parse(localStorage.getItem('incomeAmounts'));
  }
  incomeAmounts.push({ incName, incomeAmount, date });
  localStorage.setItem('incomeAmounts', JSON.stringify(incomeAmounts));
  showAlert('Income saved', 'alert-green');
}

// Add monthly earned value to LS
function earnMonthToLS() {
  // Add current month earned value to LS
  const month = new Date().toLocaleString('default', { month: 'long' });
  const earnDisp = earnedDisplay.innerText;
  let earnedMonth = [];
  earnedMonth.push({ month, earnDisp });
  localStorage.setItem('earnMonth', JSON.stringify(earnedMonth));
}

// Add monthly spend value to LS
function spentMonthToLS() {
  const month = new Date().toLocaleString('default', { month: 'long' });
  const spentDisp = spentDisplay.innerText;
  let spentMonth = [];
  spentMonth.push({ month, spentDisp });
  localStorage.setItem('spentMonth', JSON.stringify(spentMonth));
}

// Add expenses to LS
function expenseToLS() {
  const expenseAmount = inputExpense.value;
  const expenseName = capitalizeFirstLetter(expenseLog.value);
  let date = new Date().toLocaleDateString();
  let expenseAmounts;
  if (localStorage.getItem('expenseAmounts') === null) {
    expenseAmounts = [];
  } else {
    expenseAmounts = JSON.parse(localStorage.getItem('expenseAmounts'));
  }
  expenseAmounts.push({ expenseName, expenseAmount, date });
  localStorage.setItem('expenseAmounts', JSON.stringify(expenseAmounts));
  showAlert('Expense saved', 'alert-green');
}

// Inputs animation
labels.forEach((label) => {
  label.innerHTML = label.innerText
    .split('')
    .map(
      (letter, idx) =>
        `<span style="transition-delay:${idx * 20}ms">${letter}</span>`
    )
    .join('');
});

// Utilities
// Make first letter uppercase
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Add space to prices
function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
console.log(numberWithSpaces(100000000));

// Show alert
function showAlert(msg, className) {
  clearAlert();
  const div = document.createElement('div');
  div.className = className;
  div.appendChild(document.createTextNode(msg));
  const container = document.querySelector('.container');
  const balanceDisplay = document.querySelector('.balance-display');
  container.insertBefore(div, balanceDisplay);

  setTimeout(() => {
    clearAlert();
  }, 2500);
}
// Clear alert
function clearAlert() {
  const currentAlert = document.querySelector('[class ^= "alert"');

  if (currentAlert) {
    currentAlert.remove();
  }
}

// Dark mode
function darkMode(e) {
  const html = document.querySelector('html');
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    e.target.innerHTML = 'Dark mode';
  } else {
    html.classList.add('dark');
    e.target.innerHTML = 'Light mode';
  }
}
