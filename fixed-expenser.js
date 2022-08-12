const addBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const resetBtn = document.getElementById("reset-btn");
const recordContainer = document.querySelector(".record-container");
const deleteBtn = document.getElementById("delete-btn");

/************************************************ */
const name = document.getElementById("name");
const cost = document.getElementById("cost");
const date = document.getElementById("date");

let ExpenseArray = [];


const today = new Date()
document.querySelector('#date-display').innerHTML = today.toDateString()
// Object constructor for Expense
function Expense(id, name, cost, date) {
  this.id = id
  this.name = name;
  this.cost = cost;
  this.date = date;
}

// Display available record
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("expenses") == null) {
    ExpenseArray = [];
  } else {
    ExpenseArray = JSON.parse(localStorage.getItem("expenses"));
  }
  displayRecord();
});

// Display Function
function displayRecord() {
  ExpenseArray.forEach((expense) => addExpenseToList(expense));
}

// Generate a unique identifier
function createUid() {
  return (
    Date.now().toString(36) +
    Math.floor(
      Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
    ).toString(36)
  );
}

// Adding expense record
addBtn.addEventListener("click", function () {
    setMessage("success", "Record added successfully!");
    const expense = new Expense(
      createUid(),
      name.value,
      cost.value,
      date.value
    );
    ExpenseArray.push(expense);
    // Storing expense record in local storage
    localStorage.setItem("expenses", JSON.stringify(ExpenseArray));
    clearInputFields();

    // Adding to list
    addExpenseToList(expense);
  
});

// Get number oridinal suffix, resource on stackoverflow:
https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
// various rules are calculated using modulo to determine its ordinal suffix
function ordinal_suffix_of(i) {
  var j = i % 10,  // modulo by 10
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  }
  if (j == 3 && k != 13) {
      return i + "rd";
  }
  return i + "th";
}

// Adding to List (on the DOM)
function addExpenseToList(item) {
  const day = item.date.split("-")[2]
  console.log(day)
  const newRecordDiv = document.createElement("div");
  newRecordDiv.classList.add("record-item");
  newRecordDiv.innerHTML = `
        <div class="record-el">
            <span id="labeling">ID: </span>
            <span id="expense-id-content">${item.id}</span>
        </div>
        <div class ="record-el">
            <span id="labeling">Name: </span>
            <span id="name-content">${item.name}</span>
        </div>
        <div class="record-el">
            <span id="labeling">Cost: </span>
            <span id="cost-content">$ ${Number(item.cost).toFixed(2)}/mo.</span>
        </div>
        <div class="record-el">
            <span id="labeling">Entry Date: </span>
            <span id="expense-num-content">${item.date}</span>
        </div>
        <div class="record-el">
        <span id="labeling">Due Day: </span>
        <span id="expense-num-content">${ordinal_suffix_of(day)} on each month</span>
    </div>
        <button type="button" id="delete-btn">
            <span>
                <i class="fas fa-trash"></i>
            </span> Delete
        </button>
        `;
  recordContainer.appendChild(newRecordDiv);
}

// Deletion of record based off of id
recordContainer.addEventListener("click", function (event) {
  //console.log(event.target);
  if (event.target.id === "delete-btn") {
    // removing from DOM
    let recordItem = event.target.parentElement;
    recordContainer.removeChild(recordItem);
    
    let tempExpenseList = ExpenseArray.filter(record => {
      return (
        record.id !==
        recordItem.firstElementChild.lastElementChild.textContent
        );
      });
    ExpenseArray = tempExpenseList;
    //removing from localstorage by overwriting
    localStorage.setItem("expenses", JSON.stringify(ExpenseArray));
  }
});

// resetting everything
resetBtn.addEventListener("click", function () {
  ExpenseArray = [];
  localStorage.setItem("expenses", JSON.stringify(ExpenseArray));
  location.reload();
});

// Displaying status/alerts
function setMessage(status, message) {
  let messageBox = document.querySelector(".message");
  if (status == "error") {
    messageBox.innerHTML = `${message}`;
    messageBox.classList.add("error");
    removeStatusMessage(status, messageBox);
  }
  if (status == "success") {
    messageBox.innerHTML = `${message}`;
    messageBox.classList.add("success");
    removeStatusMessage(status, messageBox);
  }
}

// Clearing all input fields
cancelBtn.addEventListener("click", function () {
  clearInputFields();
});

function clearInputFields() {
  name.value = "";
  cost.value = "";
  date.value = "";
}

// Removing status/alerts after two seconds
function removeStatusMessage(status, messageBox) {
  setTimeout(function () {
    messageBox.classList.remove(`${status}`);
  }, 2000);
}
