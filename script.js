// script.js

let balance = 0;
let transactions = [];
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const balanceElement = document.getElementById('balance');
const transactionList = document.getElementById('transaction-list');
const pieChart = document.getElementById('pie-chart').getContext('2d');

const categories = {
  bills: 0,
  groceries: 0,
  shopping: 0,
  transportation: 0,
  other: 0,
};

function addTransaction() {
  const text = textInput.value;
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;

  if (text.trim() === '' || isNaN(amount)) {
    alert('Please enter valid text and amount');
    return;
  }

  const transaction = {
    text,
    amount,
    category,
  };

  transactions.push(transaction);
  balance += amount;
  categories[category] += amount;

  updateBalance();
  updateTransactionList();
  updatePieChart();

  textInput.value = '';
  amountInput.value = '';
}

function deleteTransaction(index) {
  const deletedTransaction = transactions[index];
  const transactionAmount = deletedTransaction.amount;

 
  if (balance - transactionAmount < 0) {
    alert('Deleting this transaction would result in a negative balance. Please remove other transactions first.');
    return;
  }

  transactions.splice(index, 1);
  balance -= transactionAmount;
  categories[deletedTransaction.category] -= transactionAmount;

  updateBalance();
  updateTransactionList();
  updatePieChart();
}

function updateBalance() {
  balanceElement.innerText = balance.toFixed(2);
}

function updateTransactionList() {
  transactionList.innerHTML = '';
  transactions.forEach((transaction, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      ${transaction.text} <span>${transaction.amount > 0 ? '+' : ''}${transaction.amount.toFixed(2)}</span> (${transaction.category})
      <button onclick="deleteTransaction(${index})">Delete</button>
    `;
    transactionList.appendChild(listItem);
  });
}

function updatePieChart() {
  const labels = Object.keys(categories);
  const data = Object.values(categories);

  const config = {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#E7E9ED'],
      }],
    },
  };

  // Destroy the existing chart
  if (window.myPie) {
    window.myPie.destroy();
  }

  // Create a new chart with the updated data
  window.myPie = new Chart(pieChart, config);
}

// Initial chart creation
updatePieChart();
