let listFilteredRecipes = [];
let listFilteredRecipesIngredients = [];
let listFilteredRecipesAppareils = [];
let listFilteredRecipesUstensiles = [];
let tagsIngredient = [];
let tagsAppareil = [];
let tagsUstensil = [];

const getRecipes = async () => {
  const response = await fetch("./data/recipe.json");
  return await response.json();
};

function displayRecipes(recipes) {
  const recipesSection = document.querySelector(".recipes");
  // vérifie si la liste est vide (le mot clef ne correspond à rien)
  if (recipes.length === 0) {
    recipesSection.innerHTML = `<p>Aucune recette ne correspond à votre critère… vous pouvez
    chercher « tarte aux pommes », « poisson », etc</p>`;
    return;
  }
  recipesSection.innerHTML = "";
  recipes.forEach((recipe) => {
    const { name, ingredients, time, description } = recipe;
    const listeIngredients = ingredients
      .map(
        ({ ingredient, quantity, unit }) =>
          `<li>${ingredient}: <span>${quantity ?? ""} ${unit ?? ""}</span></li>`
      )
      .join("");
    const templateRecipeSection = `
    <article class="recipe">
      <div class="recipe__img">
      </div>
      <div class="recipe__explanation">
        <div class="recipe-header">
          <h2 class="recipe-header__title">${name}</h2>
          <div class="recipe-header__time">
            <i class="recipe-header__time-icon far fa-clock"></i>
            ${time} min
          </div>
        </div>
        <div class="recipe-body">
          <div class="recipe-body__ingredients"><ul>${listeIngredients}</ul></div>
          <div class="recipe-body__description">${description}</div>
        </div>
      </div>
    </article>
    `;
    recipesSection.insertAdjacentHTML("beforeend", templateRecipeSection);
  });
}

const getKeywordsAdvancedSearch = (recipes) => {
  const ingredientNames = recipes.flatMap(({ ingredients }) =>
    ingredients.map(({ ingredient }) => ingredient)
  );
  const appareilNames = recipes.map(({ appliance }) => appliance);
  const ustensileNames = recipes.flatMap(({ ustensils }) => ustensils);

  // supprime les doublons grâce à un Set puis le retransforme en tableau
  listFilteredRecipesIngredients = [...new Set(ingredientNames)];
  listFilteredRecipesAppareils = [...new Set(appareilNames)];
  listFilteredRecipesUstensiles = [...new Set(ustensileNames)];
};

function displayAdvancedSearchIngredient(ingredients) {
  const tag = document.querySelector(".tag");
  const keywordListIngredient = document.getElementById("list-ingredient");
  keywordListIngredient.innerHTML = "";
  const ingredientHTML = ingredients
    .map((ingredient) => `<li>${ingredient.toLowerCase()}</li>`)
    .join("");
  keywordListIngredient.insertAdjacentHTML("beforeend", ingredientHTML);
  keywordListIngredient.querySelectorAll("li").forEach((ingredient) => {
    ingredient.addEventListener("click", () => {
      if (tagsIngredient.indexOf(ingredient.textContent) === -1) {
        tagsIngredient.push(ingredient.textContent);
        const templateTagIngredient = `<div>${tagsIngredient.pop()}<div>`;
        tag.insertAdjacentHTML("beforeend", templateTagIngredient);
      }
      // const tagIngredientHTML = `<div>${tagsIngredient}<div>`.join("");
      // const templateTagIngredient = `<div>${tagsIngredient.pop()}<div>`;
      // tag.insertAdjacentHTML("beforeend", templateTagIngredient);
    });
  });
}

function displayAdvancedSearchAppareil(appareils) {
  const keywordListAppareil = document.getElementById("list-appareil");
  keywordListAppareil.innerHTML = "";

  const appareilHTML = appareils
    .map((appliance) => `<li>${appliance}</li>`)
    .join("");
  keywordListAppareil.insertAdjacentHTML("beforeend", appareilHTML);
  keywordListAppareil.querySelectorAll("li").forEach((appliance) => {
    appliance.addEventListener("click", () => {
      if (tagsAppareil.indexOf(appliance.textContent) === -1) {
        tagsAppareil.push(appliance.textContent);
      }
    });
  });
}

function displayAdvancedSearchUstensile(ustensiles) {
  const keywordListUstensile = document.getElementById("list-ustensile");
  keywordListUstensile.innerHTML = "";

  const ustensilHTML = ustensiles
    .map((ustensils) => `<li>${ustensils}</li>`)
    .join("");
  keywordListUstensile.insertAdjacentHTML("beforeend", ustensilHTML);
  keywordListUstensile.querySelectorAll("li").forEach((ustensil) => {
    ustensil.addEventListener("click", () => {
      if (tagsUstensil.indexOf(ustensil.textContent) === -1) {
        tagsUstensil.push(ustensil.textContent);
      }
    });
  });
}

function openCloseDropdownButtons() {
  const dropdowns = document.querySelectorAll(".filter__keyword");
  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".keyword-search__icon");
    button.addEventListener("click", () => {
      dropdown.classList.toggle("open");
    });
  });
}

const initSearchBar = (recipes) => {
  const search = document.querySelector(".search__bar");
  const searchButton = document.querySelector(".search__icon");
  const searchIngredient = document.querySelector("#search-input-ingredients");
  const searchAppareils = document.querySelector("#search-input-appareils");
  const searchUstensiles = document.querySelector("#search-input-ustensiles");
  search.addEventListener("keyup", (event) => {
    filterRecipes(event.target.value, recipes);
  });
  searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    // filterRecipes(event.target.value, recipes);
  });
  searchIngredient.addEventListener("keyup", (event) => {
    filterIngredients(event.target.value);
  });
  searchAppareils.addEventListener("keyup", (event) => {
    filterAppareils(event.target.value);
  });
  searchUstensiles.addEventListener("keyup", (event) => {
    filterUstensiles(event.target.value);
  });
};

const filterRecipes = (search, recipes) => {
  // si la longueur de event.target.value
  // (ce que l'on a tapé dans la barre de recherche
  // event -> keyup, target -> input, value -> valeur de l'input)
  // est plus grand ou égal à 3
  if (search.length >= 3) {
    // searchValue = la valeur de l'input en minuscule
    const keywords = search
      .toLowerCase()
      // split scinde searchValue en plusieurs chaine de caractère
      //(nouvelle chaine chaque fois qu'il y a un espace) et les places dans un tableau
      .split(" ")
      // supprime les chaines vides dans le tableau
      .filter((string) => string.length > 0);
    // retourne un nouveau tableau contenant toutes les recettes incluant la valeur de l'input
    listFilteredRecipes = recipes.filter((recipe) => {
      // vérifie que la recette inclut chaque mot clef du tableau
      return keywords.every((keyword) => {
        return (
          // le nom de la recette en minuscule inclut le mot clef
          recipe.name.toLowerCase().includes(keyword) || //ou
          // la description de la recette en minuscule le mot clef
          recipe.description.toLowerCase().includes(keyword) || //ou
          // dans le tableau des ingredients teste si au moins un ingredient du tableau
          recipe.ingredients.some(({ ingredient }) =>
            // en minuscule inclut le mot clef
            ingredient.toLowerCase().includes(keyword)
          )
        );
      });
    });
    getKeywordsAdvancedSearch(listFilteredRecipes);
    displayRecipes(listFilteredRecipes);
    displayAdvancedSearchIngredient(listFilteredRecipesIngredients);
    displayAdvancedSearchAppareil(listFilteredRecipesAppareils);
    displayAdvancedSearchUstensile(listFilteredRecipesUstensiles);
  } else {
    getKeywordsAdvancedSearch(recipes);
    displayRecipes(recipes);
    displayAdvancedSearchIngredient(listFilteredRecipesIngredients);
    displayAdvancedSearchAppareil(listFilteredRecipesAppareils);
    displayAdvancedSearchUstensile(listFilteredRecipesUstensiles);
  }
};

const filterIngredients = (searchIngredient) => {
  if (searchIngredient.length >= 1) {
    const keywords = searchIngredient
      .toLowerCase()
      .split(" ")
      .filter((string) => string.length > 0);
    const filteredIngredients = listFilteredRecipesIngredients.filter(
      (ingredient) => {
        return keywords.every((keyword) => {
          return ingredient.toLowerCase().includes(keyword);
        });
      }
    );
    displayAdvancedSearchIngredient(filteredIngredients);
  } else {
    displayAdvancedSearchIngredient(listFilteredRecipesIngredients);
  }
};

const filterAppareils = (searchAppareils) => {
  if (searchAppareils.length >= 1) {
    const keywords = searchAppareils
      .toLowerCase()
      .split(" ")
      .filter((string) => string.length > 0);
    const filteredAppareils = listFilteredRecipesAppareils.filter(
      (ingredient) => {
        return keywords.every((keyword) => {
          return ingredient.toLowerCase().includes(keyword);
        });
      }
    );
    displayAdvancedSearchAppareil(filteredAppareils);
  } else {
    displayAdvancedSearchAppareil(listFilteredRecipesAppareils);
  }
};

const filterUstensiles = (searchUstensiles) => {
  if (searchUstensiles.length >= 1) {
    const keywords = searchUstensiles
      .toLowerCase()
      .split(" ")
      .filter((string) => string.length > 0);
    const filteredUstensiles = listFilteredRecipesUstensiles.filter(
      (ingredient) => {
        return keywords.every((keyword) => {
          return ingredient.toLowerCase().includes(keyword);
        });
      }
    );
    displayAdvancedSearchUstensile(filteredUstensiles);
  } else {
    displayAdvancedSearchUstensile(listFilteredRecipesUstensiles);
  }
};

async function init() {
  const { recipes } = await getRecipes();
  displayRecipes(recipes);
  openCloseDropdownButtons();
  getKeywordsAdvancedSearch(recipes);
  initSearchBar(recipes);
  displayAdvancedSearchIngredient(listFilteredRecipesIngredients);
  displayAdvancedSearchAppareil(listFilteredRecipesAppareils);
  displayAdvancedSearchUstensile(listFilteredRecipesUstensiles);
}

init();
