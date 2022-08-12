window.addEventListener("load", (e) => {
  document.querySelector("#transaction-form-container").style.display = "none";

  if (JSON.parse(localStorage.getItem("budget"))) {
    getBudgetValues();
    document.querySelector("#transaction-form-container").style.display =
      "block";
    document.querySelector("#monthly-budget-container").style.display = "none";
    document.querySelector(".reset-btn").style.display = "block";
    displayTotalIncome();
    displayTotalExpenses();
    displayNetTotal();
    displayTransactions()
  }
  // load transactions onto page
});

const userTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
const userBudget = {};
const budgetForm = document.querySelector("#monthly-budget-form");
const transactionForm = document.querySelector("#transaction-form");

/**
 * Date Picker Details
 */
const date = new Date();
// retrieve first day of month and last day of month for current month budget
const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
// Date Range Picker
$('input[name="dates"]').daterangepicker({
  startDate: firstDayOfMonth,
  endDate: lastDayOfMonth,
  minDate: firstDayOfMonth,
  maxDate: lastDayOfMonth,
});
// Single Date Picker
$('input[name="date"]').daterangepicker({
  startDate: firstDayOfMonth,
  singleDatePicker: true,
  minDate: firstDayOfMonth,
  maxDate: lastDayOfMonth,
});

/**
 * Budget Form Event Listener
 */
budgetForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const budgetDetails = getBudgetValues();
  displayBudgetValues(budgetDetails);
  document.querySelector("#transaction-form-container").style.display = "block";
});

/**
 * Transaction Form Event Listener
 */
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const transactionDetails = getTransactionDetails();
  displayTotalIncome();
  displayTotalExpenses();
  displayRemainingBudget();
  displayNetTotal();
});

function getTransactionDetails() {
  const type = document.querySelector("#type").value;
  if (type === "") {
    alert("You must select a transaction type");
    return;
  }

  const transDate = $('input[name="date"]')
    .data("daterangepicker")
    .startDate.format("YYYY-MM-DD");
  const description = document.querySelector("#description").value;
  const amount = Number(document.querySelector("#transaction-amount").value);
  userTransactions.push({ type, transDate, description, amount });
  localStorage.setItem("transactions", JSON.stringify(userTransactions));
  displayTransactions();
  transactionForm.reset();

  return { id: createUid(), type, transDate, description, amount };
}

function getBudgetValues() {
  let budgetData = JSON.parse(localStorage.getItem("budget"));
  if (budgetData) {
    return displayBudgetValues(budgetData);
  }
  const totalBudget = Number(document.querySelector("#budget-total").value);
  const startDate = $('input[name="dates"]')
    .data("daterangepicker")
    .startDate.format("MM-DD-YYYY");
  const endDate = $('input[name="dates"]')
    .data("daterangepicker")
    .endDate.format("MM-DD-YYYY");
  const totalDays = calculateTotalNumDays(startDate, endDate);
  localStorage.setItem(
    "budget",
    JSON.stringify({ totalBudget, totalDays, startDate, endDate })
  );
  document.querySelector("#monthly-budget-container").style.display = "none";
  document.querySelector(".reset-btn").style.display = "block";
  return { totalBudget, totalDays, startDate, endDate };
}
/**
 * Toggle Edit Btn
 */
document.querySelector(".reset-btn").addEventListener("click", () => {
  clearBudget();
  document.querySelector(".reset-btn").style.display = "none";
  document.querySelector("#monthly-budget-container").style.display = "block";
});

function clearBudget() {
  localStorage.removeItem("budget");
  localStorage.removeItem("transactions");
  displayBudgetValues();
  displayTransactions();
  location.reload();
}

function calculateTotalNumDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (end - start) / (1000 * 60 * 60 * 24);
}

function displayBudgetValues(
  budgetData = {
    totalBudget: 0,
    totalDays: 0,
    startDate: $('input[name="dates"]')
      .data("daterangepicker")
      .startDate.format("MM-DD-YYYY"),
    endDate: $('input[name="dates"]')
      .data("daterangepicker")
      .endDate.format("MM-DD-YYYY"),
  }
) {
  console.log("display", budgetData);
  document.querySelector(
    "#date-range"
  ).innerHTML = `${budgetData.startDate} to ${budgetData.endDate}`;
  document.querySelector(
    "#total-budget"
  ).innerHTML = `$ ${budgetData.totalBudget.toFixed(2)}`;
  document.querySelector("#total-days").innerHTML = `$ ${budgetData.totalDays}`;
  const averageSpending = budgetData.totalBudget / budgetData.totalDays;
  if (!averageSpending) {
    document.querySelector("#average-spending").innerHTML = `$ ${(0).toFixed(
      2
    )}`;
  } else {
    document.querySelector("#average-spending").innerHTML = `$ ${(
      budgetData.totalBudget / budgetData.totalDays
    ).toFixed(2)}`;
  }
  document.querySelector(
    "#remaining-budget"
  ).innerHTML = `$ ${budgetData.totalBudget.toFixed(2)}`;
}
/**
 * Display Transactions to DOM
 */

function displayTransactions() {
  const transactionContainer = document.querySelector("#transaction-output");
  const transactions = JSON.parse(localStorage.getItem("transactions"));
  if (!transactions) return;
  console.log(transactions);
  const transactionsMarkup = transactions.map((transaction) => {
    return `<div class="${
      transaction.type === "expense" ? "negative" : "positive"
    } transaction-card" >
    <div class="transaction-title">
    <h3>${transaction.description} </h3>
    <span>${transaction.transDate}</span>
    </div>
    <div class="transaction-details">
    <h3>$ ${transaction.amount.toFixed(2)}</h3>
    <span>${transaction.type}</span>
    </div>
      </div>`;
  });
  transactionContainer.innerHTML = transactionsMarkup.join("");
}

function createElement(tagName, attributes = {}, text) {
  const el = document.createElement(tagName);
  if (attributes) {
    for (var key in attributes) {
      if (key === "class") {
        el.classList.add(attributes[key]); // add all classes at once
      } else {
        el[key] = attributes[key];
      }
    }
  }
  if (text) {
    el.appendChild(document.createTextNode(text));
  }

  return el;
}

/**
 * Calculate and display sum of total transaction expenses / budget
 */
function calculateTransactions(type) {
  if (!localStorage.getItem("transactions")) return;
  const expenses = JSON.parse(localStorage.getItem("transactions")).filter(
    (transaction) => transaction.type === type
  );
  const total = expenses.reduce((total, t) => total + t.amount, 0);
  return total.toFixed(2);
}

function displayTotalExpenses() {
  document.querySelector("#total-transaction-expenses").innerHTML =
    calculateTransactions("expense");
}

function displayTotalIncome() {
  document.querySelector("#total-transaction-income").innerHTML =
    calculateTransactions("income");
}

function displayNetTotal() {
  const netTotal = (
    calculateTransactions("income") - calculateTransactions("expense")
  ).toFixed(2);
  document.querySelector("#net-total-transaction").innerHTML = netTotal;
}

function createUid() {
  return (
    Date.now().toString(36) +
    Math.floor(
      Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
    ).toString(36)
  );
}

function calculateRemainingBudget() {
  if (!localStorage.getItem("budget")) return;
  const initialBudget = JSON.parse(localStorage.getItem("budget")).totalBudget;
  const remainingBudget =
    Number(initialBudget) -
    Number(calculateTransactions("expense")) +
    Number(calculateTransactions("income"));
  return remainingBudget.toFixed(2);
}

function displayRemainingBudget() {
  document.querySelector("#remaining-budget").innerHTML =
    calculateRemainingBudget();
}
