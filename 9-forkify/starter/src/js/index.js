// Global app controller
import Search from './model/Search';
import * as SearchView from './views/searchView';
import {elements} from "./views/base";

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

const controlSearch = async () => {
    // 1) Get query from view
    const query = SearchView.getInput();

    if (query) {
        console.log(query);
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        SearchView.clearInput();
        SearchView.clearResults();

        // 4) Search for recipes
        await state.search.getResults();
        SearchView.renderRecipes(state.search.result);
        console.log(state.search.result.length);

    }
};


elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

