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

            ID = 0;

            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
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
        inputButton: '.form_button'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
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

    var ctrlAddItem = function () {
        var input = UICtrl.getInput();
        console.log(input);
    };

    return {
        init: function () {
            console.log('test');
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();
