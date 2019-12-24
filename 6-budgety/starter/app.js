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

    var calculateTotal = function (type) {
        var total = 0;
        data.allItems[type].forEach(function (item) {
            total += item.value;
        });

        data.totals[type] = total;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        }, totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: 0
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

            return item;
        },
        calculateBudget: function () {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = 0;
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
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncome: '.budget__income--value',
        budgetExpense: '.budget__expenses--value',
        budgetPercentage: '.budget__expenses--percentage',
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DomStrings.inputType).value,
                description: document.querySelector(DomStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DomStrings.inputValue).value)
            }
        },
        addListItem: function (item, type) {
            var html, newHtml, element;

            if (type === 'inc') {
                element = DomStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DomStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id%', item.id);
            newHtml = newHtml.replace('%description%', item.description);
            newHtml = newHtml.replace('%value%', item.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        displayBudget: function (obj) {

            document.querySelector(DomStrings.budgetValue).textContent = obj.budget;
            document.querySelector(DomStrings.budgetIncome).textContent = obj.totalInc;
            document.querySelector(DomStrings.budgetExpense).textContent = obj.totalExp;
            document.querySelector(DomStrings.budgetPercentage).textContent = obj.percentage;
        },


        clearFields: function () {
            var fields = document.querySelectorAll(DomStrings.inputDescription + ', ' + DomStrings.inputValue);

            var array = Array.prototype.slice.call(fields);
            array.forEach(function (field) {
                field.value = '';
            })

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

    var updateBudget = function () {
        // 1. Calculate the budget
        budgetController.calculateBudget();

        // 2. Return the budget
        var budget = budgetController.getBudget();

        // 3. Display the budget on the UI
        uiController.displayBudget(budget);
        console.log(budget);
    };

    var addItem = function () {
        // 1. Get the field input data
        var input = uiController.getInput();
        console.log(input);

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            var newItem = budgetController.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            uiController.addListItem(newItem, input.type);

            // 4. Clear the fields
            uiController.clearFields();

            // 5. Calculate and update budget
            updateBudget();


            // 6. Calculate and update percentages
        }


    };

    return {
        start: function () {
            UiController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            initListeners();
        }
    }
})(BudgetController, UiController);

AppController.start();



