/*
  TODO: UI MODULE
    1. get input value
    2. add new item to ui
    3. update ui
 */

/*
   TODO: DATA MODULE
    1. add new item to data structure
    2. calculate budget
 */

/*
   TODO: Control Module
    1. Add event handler
 */

/*
 *  Budget Controller
 */
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (current) {
            sum = sum + current.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // create new item
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push it into data
            data.allItems[type].push(newItem);

            // Return the new item
            return newItem;
        },

        calculationBudget: function () {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function () {
            console.log(data);
        }
    }

})();

/*
 *  UI Controller
 */

var UIController = (function () {

    var DOMstrings = {
        inputType: '.form_input--type',
        inputDescription: '.form_input--description',
        inputValue: '.form_input--value',
        inputButton: '.form_button',
        incomeContainer: '.history__container--income',
        expensesContainer: '.history__container--expenses',
        budgetLabel: '.main_budget',
        incomeLabel: '.badge--income .badge__number',
        expensesLabel: '.badge--expenses .badge__number',
        percentageLabel: '.badge--expenses .badge__percentage'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;

            // create HTML
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="history__item" id="income-%id%"><div class="history__item_title">%description%</div><div class="history__item_amount">%value%</div><div class="history__item_remove"></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="history__item" id="expense-%id%"><div class="history__item_title">%description%</div><div class="history__item_amount">%value%<span class="history__item_badge">20%</span></div><div class="history__item_remove"></div></div>';
            }

            // replace the placeholder text with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;


            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";
            }

        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    }

})();

/*
 *  Global Controller
 */

var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function () {
        // calculate budget
        budgetCtrl.calculationBudget();

        // return the budget
        var budget = budgetCtrl.getBudget();

        // display budget to UI
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function () {
        var input, newItem;

        // field data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // add new item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // add item to UI
            UICtrl.addListItem(newItem, input.type);

            // clear the fields
            UICtrl.clearFields();

            // calculate and update budget
            updateBudget();
        }

    };

    return {
        init: function () {
            console.log('App is running');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();
