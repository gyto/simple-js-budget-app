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
        expensesContainer: '.history__container--expenses'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },
        addListItem: function (obj, type) {
            var html, newHtml, element;

            // create HTML
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html =
                    '<div class="history__item" id="income-%id%">' +
                        '<div class="history__item_title">%description%</div>' +
                        '<div class="history__item_amount">%value%</div>' +
                        '<div class="history__item_remove"></div>' +
                    '</div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html =
                    '<div class="history__item" id="expense-%id%">' +
                        '<div class="history__item_title">%description%</div>' +
                        '<div class="history__item_amount">%value%' +
                            '<span class="history__item_badge">20%</span>' +
                        '</div>' +
                        '<div class="history__item_remove"></div>' +
                    '</div>';
            }

            // replace the placeholder text with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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

    var ctrlAddItem = function () {
        var input, newItem;

        // field data
        input = UICtrl.getInput();

        // add new item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // add item to UI
        UICtrl.addListItem(newItem, input.type);

        // calculate budget
        // display budget to UI
    };

    return {
        init: function () {
            console.log('test');
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();
