import axios from 'axios';


export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (e) {
            console.log(res);
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'g', 'kg'];

        this.ingredients = this.ingredients.map(el => {

            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^]*\) */g, ' ').trim();

            // 3) Parse ingredients into count, unit and ingredient
            let obj = {count: 1, unit: '', ingredient: ingredient};

            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]

                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrCount.join('+'));
                }

                if (count) {
                    obj.count = count;
                }

                obj.unit = arrIng[unitIndex];
                obj.ingredient = arrIng.slice(unitIndex + 1).join(' ');

            }

            if (unitIndex === -1) {
                var number = parseInt(arrIng[0], 10);
                // There is NO unit, but 1st element is number
                if (number) {
                    obj.count = number;
                    obj.ingredient = arrIng.slice(1).join(' ');
                }
            }

            return obj;
        });

    }

    updateServings(type) {
        let previousServings = this.servings;

        if (type === 'inc') {
            this.servings += 1;
        } else {
            if (this.servings > 1) {
                this.servings -= 1;
            }
        }

        this.ingredients.forEach(i => {
            i.count = i.count / previousServings * this.servings;
        });
    }
}
