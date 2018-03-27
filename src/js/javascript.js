
/*
 *  Budget Controller
 */
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
      return this.percentage
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

        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
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

        calculatePercentages: function () {
            data.allItems.exp.forEach(function (current) {
                current.calcPercentage(data.totals.inc)
            })
        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (current) {
                return current.getPercentage();
            });

            return allPerc;
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
        percentageLabel: '.badge--expenses .badge__percentage',
        container: '.history',
        expensesPercLabel: '.badge--expenses .history__item_badge'
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
                html = '<div class="history__item" id="inc-%id%"><div class="history__item_title">%description%</div><div class="history__item_amount">%value%</div><div class="history__item_remove"></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="history__item" id="exp-%id%"><div class="history__item_title">%description%</div><div class="history__item_amount">%value%<span class="history__item_badge">20%</span></div><div class="history__item_remove"></div></div>';
            }

            // replace the placeholder text with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);

            el.parentNode.removeChild(el);
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

        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            var nodeListForEach = function (list, callback) {
              for (var i = 0; i < list.length; i++) {
                  callback(list[i], i);
              }
            };

            nodeListForEach(fields, function (current, index) {
                current.textPercentage = percentages[index] + "%";
            });
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };

    var updateBudget = function () {
        // calculate budget
        budgetCtrl.calculationBudget();

        // return the budget
        var budget = budgetCtrl.getBudget();

        // display budget to UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function () {
        // calculate percentage
        budgetCtrl.calculatePercentages();

        // read percentage
        var percentages = budgetCtrl.getPercentages();

        // update the UI
        console.log(percentages);
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

            // update percentage
            updatePercentages();
        }

    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // delete item from js
            budgetCtrl.deleteItem(type, ID);

            // delete item from UI
            UICtrl.deleteListItem(itemID);

            // delete from budget and update ui again
            updateBudget();

            // update percentage
            updatePercentages();
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
