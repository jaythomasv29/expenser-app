/**
 *
 */
const userTransactions = []; // or check with local storage
const userBudget = {}; // or check with local storage
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
});

/**
 * Transaction Form Event Listener
 */
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const transactionDetails = getTransactionDetails();
  console.log(transactionDetails);
});

function getTransactionDetails() {
  const type = document.querySelector("#type").value;
  if (type === "") {
    alert("You must select a transaction type");
    return;
  }
  let category = null;
  if (type === "expense") {
    category = document.querySelector("#category").value;
  }
  const transDate = $('input[name="date"]')
    .data("daterangepicker")
    .startDate.format("YYYY-MM-DD");
  const description = document.querySelector("#description").value;
  const amount = Number(document.querySelector("#transaction-amount").value);
  userTransactions.push({ type, category, transDate, description, amount });
  localStorage.setItem("transactions", JSON.parse(userTransactions));
  transactionForm.reset();

  return { type, category, transDate, description, amount };
}

function getBudgetValues() {
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
  document.querySelector(".edit-btn").style.display = "block";
  return { totalBudget, totalDays, startDate, endDate };
}
document.querySelector(".edit-btn").addEventListener("click", () => {
  document.querySelector(".edit-btn").style.display = "none";
  document.querySelector("#monthly-budget-container").style.display = "block";
});

function calculateTotalNumDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (end - start) / (1000 * 60 * 60 * 24);
}

function displayBudgetValues(budgetData) {
  console.log(budgetData);
  document.querySelector(
    "#date-range"
  ).innerHTML = `${budgetData.startDate} to ${budgetData.endDate}`;
  document.querySelector(
    "#total-budget"
  ).innerHTML = `$ ${budgetData.totalBudget.toFixed(2)}`;
  document.querySelector("#total-days").innerHTML = `$ ${budgetData.totalDays}`;
  document.querySelector("#average-spending").innerHTML = `$ ${(
    budgetData.totalBudget / budgetData.totalDays
  ).toFixed(2)}`;
  document.querySelector(
    "#remaining-budget"
  ).innerHTML = `$ ${budgetData.totalBudget.toFixed(2)}`;
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

document
  .querySelector("#type")
  .addEventListener("change", toggleExpenseOptions);

function toggleExpenseOptions(e) {
  console.log(e.target.value);
  if (e.target.value === "income") {
    document.querySelector(".expense-fields").style.display = "none";
  } else {
    document.querySelector(".expense-fields").style.display = "block";
  }
}
