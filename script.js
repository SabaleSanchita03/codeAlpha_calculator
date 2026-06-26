/* =========================================================
   ELEMENTS
========================================================= */

const currentOperand = document.getElementById("currentOperand");
const previousOperand = document.getElementById("previousOperand");
const buttons = document.querySelectorAll(".btn");

const themeBtn = document.getElementById("themeToggle");
const clearHistoryBtn = document.getElementById("clearHistory");
const historyList = document.getElementById("historyList");

/* =========================================================
   STATE
========================================================= */

let current = "0";
let previous = "";
let operation = null;
let shouldResetScreen = false;

let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

/* =========================================================
   DISPLAY UPDATE
========================================================= */

function updateDisplay() {
    currentOperand.value = current;
    previousOperand.textContent = previous;
}

/* =========================================================
   APPEND NUMBER
========================================================= */

function appendNumber(num) {
    if (shouldResetScreen) {
        current = "";
        shouldResetScreen = false;
    }

    if (num === "." && current.includes(".")) return;

    if (current === "0" && num !== ".") {
        current = num;
    } else {
        current += num;
    }
}

/* =========================================================
   CHOOSE OPERATION
========================================================= */

function chooseOperation(op) {
    if (current === "") return;

    if (previous !== "") {
        calculate();
    }

    operation = op;
    previous = `${current} ${op}`;
    current = "";
}

/* =========================================================
   CALCULATION
========================================================= */

function calculate() {
    let result;

    const prev = parseFloat(previous);
    const curr = parseFloat(current);

    if (isNaN(prev) || isNaN(curr)) return;

    switch (operation) {
        case "+":
            result = prev + curr;
            break;
        case "-":
            result = prev - curr;
            break;
        case "*":
            result = prev * curr;
            break;
        case "/":
            result = curr === 0 ? "Error" : prev / curr;
            break;
        default:
            return;
    }

    addToHistory(`${prev} ${operation} ${curr} = ${result}`);

    current = result.toString();
    operation = null;
    previous = "";
    shouldResetScreen = true;
}

/* =========================================================
   CLEAR / DELETE
========================================================= */

function clearAll() {
    current = "0";
    previous = "";
    operation = null;
}

function deleteLast() {
    if (current.length === 1) {
        current = "0";
    } else {
        current = current.slice(0, -1);
    }
}

/* =========================================================
   SPECIAL FUNCTIONS
========================================================= */

function togglePlusMinus() {
    if (current === "0") return;
    current = (parseFloat(current) * -1).toString();
}

function percentage() {
    current = (parseFloat(current) / 100).toString();
}

/* =========================================================
   HISTORY
========================================================= */

function addToHistory(entry) {
    history.push(entry);
    localStorage.setItem("calcHistory", JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";

    history.slice().reverse().forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    history = [];
    localStorage.removeItem("calcHistory");
    renderHistory();
}

/* =========================================================
   THEME TOGGLE
========================================================= */

function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    const icon = themeBtn.querySelector("i");

    if (document.body.classList.contains("dark-mode")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
}

/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

function handleKeyboard(e) {
    if (!isNaN(e.key)) {
        appendNumber(e.key);
    }

    if (e.key === ".") appendNumber(".");

    if (e.key === "+") chooseOperation("+");
    if (e.key === "-") chooseOperation("-");
    if (e.key === "*") chooseOperation("*");
    if (e.key === "/") chooseOperation("/");

    if (e.key === "Enter") calculate();

    if (e.key === "Backspace") deleteLast();

    if (e.key === "Escape") clearAll();
}

/* =========================================================
   BUTTON EVENTS
========================================================= */

buttons.forEach(btn => {
    btn.addEventListener("click", () => {

        const number = btn.textContent.trim();
        const action = btn.dataset.action;
        const operationBtn = btn.dataset.operation;

        if (btn.classList.contains("number")) {
            appendNumber(number);
        }

        if (operationBtn) {
            chooseOperation(operationBtn);
        }

        if (action === "clear") clearAll();

        if (action === "delete") deleteLast();

        if (action === "calculate") calculate();

        if (action === "plusminus") togglePlusMinus();

        if (action === "percent") percentage();

        updateDisplay();
    });
});

/* =========================================================
   BUTTON ACTIVE STATE (UI FEEDBACK)
========================================================= */

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        setTimeout(() => btn.classList.remove("active"), 150);
    });
});

/* =========================================================
   INIT EVENTS
========================================================= */

document.addEventListener("keydown", handleKeyboard);
themeBtn.addEventListener("click", toggleTheme);
clearHistoryBtn.addEventListener("click", clearHistory);

/* =========================================================
   INIT
========================================================= */

updateDisplay();
renderHistory();