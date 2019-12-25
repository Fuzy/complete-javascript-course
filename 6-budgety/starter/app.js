var BudgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
            this.percentage = -1;
        }
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
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === 'exp') {
                item = new Expense(ID, des, value);
            } else {
                item = new Income(ID, des, value);
            }

            data.allItems[type].push(item);

            return item;
        },
        deleteItem: function (type, id) {
            var ids = data.allItems[type].map(function (item) {
                return item.id;
            });

            var index = ids.indexOf(id);

            if (id !== -1) {
                console.log(index);
                data.allItems[type].splice(index, 1);
            }
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
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (item) {
                item.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function () {
            var all = data.allItems.exp.map(function (item) {
                return item.percentage;
            });

            return all;
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
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function (num, type) {
        var numSplit, int, dec;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
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
            newHtml = newHtml.replace('%value%', formatNumber(item.value));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentElement.removeChild(el);
        },

        displayBudget: function (obj) {

            document.querySelector(DomStrings.budgetValue).textContent = formatNumber(obj.budget);
            document.querySelector(DomStrings.budgetIncome).textContent = formatNumber(obj.totalInc);
            document.querySelector(DomStrings.budgetExpense).textContent = formatNumber(obj.totalExp);
            document.querySelector(DomStrings.budgetPercentage).textContent = obj.percentage;
        },

        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DomStrings.expensesPercLabel);

            nodeListForEach(fields, function (node, i) {
                if (percentages[i] > 0) {
                    node.textContent = percentages[i] + '%';
                } else {
                    node.textContent = '-';
                }
            })
        },

        clearFields: function () {
            var fields = document.querySelectorAll(DomStrings.inputDescription + ', ' + DomStrings.inputValue);

            var array = Array.prototype.slice.call(fields);
            array.forEach(function (field) {
                field.value = '';
            })

        },

        displayMonth: function () {
            var now, months, month, year;

            now = new Date();
            //var christmas = new Date(2016, 11, 25);

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DomStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function() {

            var fields = document.querySelectorAll(
                DomStrings.inputType + ',' +
                DomStrings.inputDescription + ',' +
                DomStrings.inputValue);

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DomStrings.inputBtn).classList.toggle('red');

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

        document.querySelector(Dom.container).addEventListener('click', deleteItem);

        document.querySelector(Dom.inputType).addEventListener('change', uiController.changedType);
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

    var updatePercentages = function () {
        // 1. Calculate percentages
        budgetController.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetController.getPercentages();

        // 3. Update the UI with the new percentages
        uiController.displayPercentages(percentages);

    };

    var deleteItem = function (event) {
        var itemID, type, id;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;


        if (itemID) {
            var split = itemID.split('-');

            type = split[0];
            id = parseInt(split[1]);

            console.log(type, id);

            // 1. delete the item from the data structure
            budgetController.deleteItem(type, id);

            // 2. Delete the item from the UI
            uiController.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();
        }

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
            updatePercentages();
        }


    };

    return {
        start: function () {
            UiController.displayMonth();
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



