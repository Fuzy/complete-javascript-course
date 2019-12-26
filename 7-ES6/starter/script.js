/////////////////////////////////
// CODING CHALLENGE

/*

Suppose that you're working in a small town administration, and you're in charge of two town elements:
1. Parks
2. Streets

It's a very small town, so right now there are only 3 parks and 4 streets. All parks and streets have a name and a build year.

At an end-of-year meeting, your boss wants a final report with the following:
1. Tree density of each park in the town (forumla: number of trees/park area)
2. Average age of each town's park (forumla: sum of all ages/number of parks)
3. The name of the park that has more than 1000 trees
4. Total and average length of the town's streets
5. Size classification of all streets: tiny/small/normal/big/huge. If the size is unknown, the default is normal

All the report data should be printed to the console.

HINT: Use some of the ES6 features: classes, subclasses, template strings, default parameters, maps, arrow functions, destructuring, etc.

*/

class Property {
    constructor(name, year) {
        this.name = name;
        this.year = year;
    }
}

class Park extends Property {
    constructor(name, year, area, numTrees) {
        super(name, year);
        this.area = area;
        this.numTrees = numTrees;
    }

    treeDensity() {
        const density = this.numTrees / this.area;
        console.log(`${this.name} has a tree density of ${density} trees per square km.`);
    }
}

class Street extends Property {
    constructor(name, year, length, size) {
        super(name, year);
        this.length = length;
        this.size = size;
    }

    classify() {
        const classification = new Map();
        classification.set(1, 'tiny');
        classification.set(2, 'small');
        classification.set(3, 'normal');
        classification.set(4, 'big');
        classification.set(5, 'huge');
        console.log(`Street ${this.name} build in ${this.year} is ${classification.get(this.size)} size`);
    }
}

function calcSumAvg(array) {
    let sum = array.reduce((acc, cur) => acc + cur, 0);

    return [sum, sum / array.length];
}

const allParks = [new Park('Green Park', 1987, 0.2, 215),
    new Park('National Park', 1894, 2.9, 3541),
    new Park('Oak Park', 1953, 0.4, 949)];

const allStreets = [new Street('Ocean Avenue', 1999, 1.1, 4),
    new Street('Evergreen Street', 2008, 2.7, 2),
    new Street('4th Street', 2015, 0.8),
    new Street('Sunset Boulevard', 1982, 2.5, 5)];

function reportParks(parks) {
    console.log('-----PARKS REPORT-----');

    // Density
    parks.forEach(el => el.treeDensity());

    // Average age
    const ages = parks.map(el => new Date().getFullYear() - el.year);
    const [totalAge, avgAge] = calcSumAvg(ages);
    console.log(`Our ${parks.length} parks have an average of ${avgAge} years.`);

    // Which park has more than 1000 trees
    const i = parks.map(el => el.numTrees).findIndex(el => el >= 1000);
    console.log(`${parks[i].name} has more than 1000 trees.`);
}

function reportStreets(streets) {
    console.log('-----STREETS REPORT-----');
    //Total and average length of the town's streets
    let lengths = streets.map(s => s.length);
    const [total, average] = calcSumAvg(lengths);
    console.log(`Total lenght is ${total}, average is ${average}`);

    // CLassify sizes
    streets.forEach(s => s.classify());
}

reportParks(allParks);
reportStreets(allStreets);

