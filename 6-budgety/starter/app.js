var BudgetController = (function () {

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
        }, totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function (type, des, value) {
            var item, ID;

            //create new ID
            ID = 0;

            if (type === 'exp') {
                item = new Expense(ID, des, value);
            } else {
                item = new Income(ID, des, value);
            }

            data.allItems[type].push(item);

        },
        test: function () {
            console.log(data);
        }
    };

})();

var UiController = (function () {

    const DomStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DomStrings.inputType).value,
                description: document.querySelector(DomStrings.inputDescription).value,
                value: document.querySelector(DomStrings.inputValue).value
            }
        },
        getDomStrings: function () {
            return DomStrings;
        },

        toString: function () {
            return 'UiController';
        }
    };
})();

var AppController = (function (budgetController, uiController) {

    var initListeners = function () {
        var Dom = uiController.getDomStrings();

        document.querySelector(Dom.inputBtn).addEventListener('click', addItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode == 13) {
                addItem();
                budgetController.test();
            }
        });
    };

    var addItem = function () {
        // 1. Get the field input data
        var input = uiController.getInput();
        console.log(input);
        budgetController.addItem(input.type, input.description, input.value);

        // 2. Add the item to the budget controller
        // 3. Add the item to the UI
        // 4. Clear the fields
        // 5. Calculate and update budget
        // 6. Calculate and update percentages
    };

    return {
        start: function () {
            initListeners();
        }
    }
})(BudgetController, UiController);

AppController.start();



