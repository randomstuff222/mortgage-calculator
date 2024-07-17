'use strict';

const calculateButton = document.querySelector('.calculate-button');
const mortgageAmountInput = document.querySelector('#mortgage-amount-input');
const mortgageTermInput = document.querySelector('#mortgage-term-input');
const interestRateInput = document.querySelector('#interest-rate-input');
const repaymentOption = document.querySelector('#repayment-option');
const interestOnlyOption = document.querySelector('#interest-only-option');
const clearButton = document.querySelector('.clear-button');
const errorMessages = document.querySelectorAll('.error-msg');
const symbolElements = document.querySelectorAll('.symbol-background');
const inputElements = document.querySelectorAll('input');
const repaymentLabel = document.querySelector('.repayment-label');
const interestOnlyLabel = document.querySelector('.interestonly-label');
const resultHeader = document.querySelector('.results-header');
const resultDetails = document.querySelector('.results-details');
const labelAmount = document.querySelectorAll('.label-amount');
const currencyBtn = document.getElementById('currency-button');

const repaymentHelpBtn = document.getElementById('repayment-help-display');
const repaymentDisplay = document.getElementById('repayment-explanation');
const repaymentText = document.getElementById('repayment-text');
const repaymentExample = document.getElementById('repayment-example');
const childExampleClass = document.querySelector('#child-example');
const repaymentExampleBtn = document.getElementById('repayment-example-button');

const interestOnlyHelpBtn = document.getElementById(
  'interest-only-help-display'
);
const interestOnlyDisplay = document.getElementById(
  'interest-only-explanation'
);
const interestOnlyText = document.getElementById('interest-only-text');
const interestOnlyExample = document.getElementById('interest-only-example');

const backButtons = document.querySelectorAll('.return-button');
const explanationBtn = document.getElementById('explanation-buttons');

interestOnlyDisplay.hidden = true;
repaymentDisplay.hidden = true;
explanationBtn.style.display = 'none';
let helpOptionActive = 0;

const helpButton = document.getElementById('how-it-works');
const helpMenu = document.getElementById('container-example');
const bgBlur = document.getElementById('background-blur');
bgBlur.style.display = 'none';
helpMenu.style.display = 'none';

repaymentHelpBtn.addEventListener('click', function () {
  helpOptionActive = 1;
  explanationBtn.style.display = 'flex';
  childExampleClass.style.display = 'none';
  repaymentDisplay.hidden = false;
  repaymentText.hidden = false;
  repaymentExample.hidden = true;
});

interestOnlyHelpBtn.addEventListener('click', function () {
  helpOptionActive = 2;
  explanationBtn.style.display = 'flex';
  childExampleClass.style.display = 'none';
  interestOnlyDisplay.hidden = false;
  interestOnlyText.hidden = false;
  interestOnlyExample.hidden = true;
});

repaymentExampleBtn.addEventListener('click', function () {
  if (repaymentExampleBtn.value === '1') {
    repaymentExampleBtn.value = '2';
    repaymentExampleBtn.textContent = 'Close Example';
  } else {
    repaymentExampleBtn.value = '1';
    repaymentExampleBtn.textContent = 'Example Calculation';
  }
  //if dealing with repayment
  if (helpOptionActive === 1) {
    repaymentText.hidden = !repaymentText.hidden;
    repaymentExample.hidden = !repaymentExample.hidden;
  } else {
    //if dealing with interest only
    interestOnlyText.hidden = !interestOnlyText.hidden;
    interestOnlyExample.hidden = !interestOnlyExample.hidden;
  }
});

backButtons.forEach(element => {
  element.addEventListener('click', function () {
    closingAllTabs();
  });
});

// // when clicking repayment button to display the explanation from the two options
helpButton.addEventListener('click', function (event) {
  event.preventDefault();
  // add a gray over everything in the background
  if (helpMenu.style.display === 'none') {
    bgBlur.style.display = 'flex';
    helpMenu.style.display = 'flex';
  } else {
    helpMenu.style.display = 'none';
    bgBlur.style.display = 'none';
  }
});

const closingAllTabs = () => {
  helpOptionActive = 0;
  childExampleClass.style.display = 'flex';
  repaymentDisplay.hidden = true;
  interestOnlyDisplay.hidden = true;
  explanationBtn.style.display = 'none';
  repaymentExampleBtn.value = '1';
  repaymentExampleBtn.textContent = 'Example Calculation';
};

document.addEventListener('click', function (event) {
  if (helpMenu.style.display === 'flex') {
    event.preventDefault();
    //issue in which clicking outside will block the radial of Mortgage Type

    // clicking the how it works button shouldn't trigger it
    if (!helpButton.contains(event.target)) {
      //if the user is clicking outside
      if (!helpMenu.contains(event.target)) {
        //closingAllTabs();
        helpMenu.style.display = 'none';
        bgBlur.style.display = 'none';
        return;
      }
    }
  }
});

// need to change css to fit for phone view

function showError(index, msg) {
  errorMessages[index].textContent = msg;
  inputElements[index].classList.add('error-border');
  symbolElements[index].classList.add('error-background');
}

function hideError(index, msg) {
  errorMessages[index].textContent = msg;
  inputElements[index].classList.remove('error-border');
  symbolElements[index].classList.remove('error-background');
}

function validInput(input, index) {
  if (input === '') {
    showError(index, 'This Field is required');
  } else {
    hideError(index, null);
    return +input;
  }
}

const formatNumber = number =>
  Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: currencyBtn.value,
  }).format(number);

function checkRadioButton() {
  const repayment = repaymentOption.checked;
  const interestOnly = interestOnlyOption.checked;
  let option = null;

  if (repayment === true && interestOnly === false) {
    option = 'repayment';
    return option;
  } else if (interestOnly === true && repayment === false) {
    option = 'interestOnly';
    return option;
  } else {
    return (errorMessages[3].textContent = 'This Field is required');
  }
}

function calculateRepayment() {
  const mortgageAmount = validInput(mortgageAmountInput.value, 0);
  const mortgageTerm = validInput(mortgageTermInput.value, 1);
  const mortgageInterest = validInput(interestRateInput.value, 2);
  const isRadioButtonChecked = checkRadioButton();

  if (mortgageAmount && mortgageTerm && mortgageInterest) {
    if (isRadioButtonChecked === 'repayment') {
      //Convert annual Interest Rate to monthly interest
      const monthlyInterest = mortgageInterest / 100 / 12;
      //Calculate number of payment
      const numberOfPayment = mortgageTerm * 12;
      //Calculate (1+r)n
      const onePlusPowerN = Math.pow(1 + monthlyInterest, numberOfPayment);
      //Calculate Monthly Mortgage payment
      const monthly =
        (mortgageAmount * (monthlyInterest * onePlusPowerN)) /
        (onePlusPowerN - 1);
      //Calculate Total repayment
      const totalRepayment = monthly * numberOfPayment;
      //Round it to two decimal and format Into Currency
      const monthlyRepayment = formatNumber(monthly);
      const totalRepaymentRounded = formatNumber(totalRepayment);

      resultHeader.classList.add('hide');
      resultDetails.classList.add('show');
      labelAmount[0].textContent = monthlyRepayment;
      labelAmount[1].textContent = totalRepaymentRounded;
    } else if (isRadioButtonChecked === 'interestOnly') {
      //Convert annual Interest Rate to monthly interest
      const monthlyInterest = mortgageInterest / 100 / 12;
      //Calculate monthly Interest payment
      const monthlyInterestPayment = mortgageAmount * monthlyInterest;
      //Total Interest Payment overLoan Term
      const totalInterest = monthlyInterestPayment * mortgageTerm * 12;
      //Round it to two decimal and format Into Currency
      const interestPayment = formatNumber(monthlyInterestPayment);
      const interestPaidOverTerm = formatNumber(totalInterest);

      resultHeader.classList.add('hide');
      resultDetails.classList.add('show');
      labelAmount[0].textContent = interestPayment;
      labelAmount[1].textContent = interestPaidOverTerm;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function handleClearAllButton() {
  resultHeader.classList.remove('hide');
  resultDetails.classList.remove('show');
  inputElements.forEach(
    element => ((element.checked = false), (element.value = null))
  );
  repaymentLabel.classList.remove('select');
  interestOnlyLabel.classList.remove('select');
  labelAmount[0].textContent = null;
  labelAmount[1].textContent = null;
  errorMessages.forEach(element => (element.textContent = null));
  inputElements.forEach(element => element.classList.remove('error-border'));
  symbolElements.forEach(element =>
    element.classList.remove('error-background')
  );
}

currencyBtn.addEventListener('change', function (event) {
  event.preventDefault();
  console.log(event.target.value);
});

clearButton.addEventListener('click', handleClearAllButton);

calculateButton.addEventListener('click', function (e) {
  e.preventDefault();
  calculateRepayment();
});

mortgageAmountInput.addEventListener('focus', function () {
  hideError(0, null);
});

mortgageTermInput.addEventListener('focus', function () {
  hideError(1, null);
});
interestRateInput.addEventListener('focus', function () {
  hideError(2, null);
});
repaymentOption.addEventListener('click', function () {
  repaymentLabel.classList.add('select');
  interestOnlyLabel.classList.remove('select');
  errorMessages[3].textContent = null;
});
interestOnlyOption.addEventListener('click', function () {
  repaymentLabel.classList.remove('select');
  interestOnlyLabel.classList.add('select');
  errorMessages[3].textContent = null;
});
