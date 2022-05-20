let allRecipes;
let listFilteredRecipes = [];
let listFilteredRecipesIngredients = [];
let listFilteredRecipesAppareils = [];
let listFilteredRecipesUstensiles = [];
let tagsIngredient = [];
let tagsAppareil = [];
let tagsUstensil = [];
let searchString = "";

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
    const listeIngredients = ingredients.map(({ ingredient, quantity, unit }) => `<li>${ingredient}: <span>${quantity ?? ""} ${unit ?? ""}</span></li>`).join("");
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
  const ingredientNames = recipes.flatMap(({ ingredients }) => ingredients.map(({ ingredient }) => ingredient));
  const appareilNames = recipes.map(({ appliance }) => appliance);
  const ustensileNames = recipes.flatMap(({ ustensils }) => ustensils);

  // supprime les doublons grâce à un Set puis le retransforme en tableau
  listFilteredRecipesIngredients = [...new Set(ingredientNames)];
  listFilteredRecipesAppareils = [...new Set(appareilNames)];
  listFilteredRecipesUstensiles = [...new Set(ustensileNames)];
};

function displayAdvancedSearchIngredient(ingredients) {
  const keywordListIngredient = document.getElementById("list-ingredient");
  keywordListIngredient.innerHTML = "";
  const ingredientHTML = ingredients.map((ingredient) => `<li>${ingredient.toLowerCase()}</li>`).join("");
  keywordListIngredient.insertAdjacentHTML("beforeend", ingredientHTML);
  keywordListIngredient.querySelectorAll("li").forEach((ingredient) => {
    ingredient.addEventListener("click", () => {
      addTagIngredient(ingredient.textContent);
    });
  });
}

function addTagIngredient(name) {
  if (tagsIngredient.indexOf(name) === -1) {
    tagsIngredient.push(name);
    const tag = document.querySelector(".tag");
    const templateTagIngredient = document.createElement("div");
    templateTagIngredient.innerHTML = `<div class="tag__element tag__element--ingredient">${name}<i class="fa-regular fa-circle-xmark"></i></div>`;
    //event to remove tag
    templateTagIngredient.querySelector(".fa-regular").addEventListener("click", (event) => {
      tagsIngredient.splice(tagsIngredient.indexOf(name), 1);
      event.currentTarget.closest(".tag__element").remove();
      filterRecipes();
    });
    tag.appendChild(templateTagIngredient.firstChild);
    filterRecipes();
  }
}

function displayAdvancedSearchAppareil(appareils) {
  const keywordListAppareil = document.getElementById("list-appareil");
  keywordListAppareil.innerHTML = "";
  const appareilHTML = appareils.map((appliance) => `<li>${appliance.toLowerCase()}</li>`).join("");
  keywordListAppareil.insertAdjacentHTML("beforeend", appareilHTML);
  keywordListAppareil.querySelectorAll("li").forEach((appliance) => {
    appliance.addEventListener("click", () => {
      addTagAppareil(appliance.textContent);
    });
  });
}

function addTagAppareil(name) {
  if (tagsAppareil.indexOf(name) === -1) {
    tagsAppareil.push(name);
    const tag = document.querySelector(".tag");
    const templateTagAppareil = document.createElement("div");
    templateTagAppareil.innerHTML = `<div class="tag__element tag__element--appareil">${name}<i class="fa-regular fa-circle-xmark"></i></div>`;
    templateTagAppareil.querySelector(".fa-regular").addEventListener("click", (event) => {
      tagsAppareil.splice(tagsIngredient.indexOf(name), 1);
      event.currentTarget.closest(".tag__element").remove();
      filterRecipes();
    });
    tag.appendChild(templateTagAppareil.firstChild);
    filterRecipes();
  }
}

function displayAdvancedSearchUstensile(ustensiles) {
  const keywordListUstensile = document.getElementById("list-ustensile");
  keywordListUstensile.innerHTML = "";

  const ustensilHTML = ustensiles.map((ustensil) => `<li>${ustensil.toLowerCase()}</li>`).join("");
  keywordListUstensile.insertAdjacentHTML("beforeend", ustensilHTML);
  keywordListUstensile.querySelectorAll("li").forEach((ustensil) => {
    ustensil.addEventListener("click", () => {
      addTagUstensile(ustensil.textContent);
    });
  });
}

function addTagUstensile(name) {
  if (tagsUstensil.indexOf(name) === -1) {
    tagsUstensil.push(name);
    const tag = document.querySelector(".tag");
    const templateTagUstensile = document.createElement("div");
    templateTagUstensile.innerHTML = `<div class="tag__element tag__element--ustensile">${name}<i class="fa-regular fa-circle-xmark"></i></div>`;
    templateTagUstensile.querySelector(".fa-regular").addEventListener("click", (event) => {
      tagsUstensil.splice(tagsUstensil.indexOf(name), 1);
      event.currentTarget.closest(".tag__element").remove();
      filterRecipes();
    });
    tag.appendChild(templateTagUstensile.firstChild);
    filterRecipes();
  }
}

function openCloseDropdownButtons() {
  const dropdowns = document.querySelectorAll(".filter__keyword");
  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".keyword-search__icon");
    button.addEventListener("click", () => {
      dropdown.classList.toggle("open");
    });
  });
  document.body.addEventListener("click", (event) => {
    if (document.body.contains(event.target) && !event.target.closest(".filter__keyword")) {
      dropdowns.forEach((dropdown) => dropdown.classList.remove("open"));
    }
  });
}

const initSearchBar = () => {
  const searchInput = document.querySelector(".search__bar");
  const searchButton = document.querySelector(".search__icon");
  const searchIngredient = document.querySelector("#search-input-ingredients");
  const searchAppareils = document.querySelector("#search-input-appareils");
  const searchUstensiles = document.querySelector("#search-input-ustensiles");
  searchInput.addEventListener("keyup", (event) => {
    searchString = event.target.value;
    filterRecipes();
  });
  searchButton.addEventListener("click", (event) => {
    event.preventDefault();
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

const filterRecipes = () => {
  if (searchString.length < 3 && tagsIngredient.length === 0 && tagsAppareil.length === 0 && tagsUstensil.length === 0) {
    getKeywordsAdvancedSearch(allRecipes);
    displayRecipes(allRecipes);
    displayAdvancedSearchIngredient(listFilteredRecipesIngredients);
    displayAdvancedSearchAppareil(listFilteredRecipesAppareils);
    displayAdvancedSearchUstensile(listFilteredRecipesUstensiles);
    return;
  }

  listFilteredRecipes = allRecipes;
  if (searchString.length >= 3) {
    // .filter((string) => string.length > 0);
    // .toLowerCase()
    // split scinde searchString en plusieurs chaine de caractère
    //(nouvelle chaine chaque fois qu'il y a un espace) et les places dans un tableau
    // .split(" ");
    // supprime les chaines vides dans le tableau
    const keywords = [];
    for (const keyword of searchString.toLowerCase().split(" ")) {
      if (keyword.length > 0) {
        keywords.push(keyword);
      }
    }
    // retourne un nouveau tableau contenant toutes les recettes incluant la valeur de l'input
    listFilteredRecipes = allRecipes.filter((recipe) => {
      // vérifie que la recette inclut chaque mot clef du tableau
      return keywords.every((keyword) => {
        return (
          // le nom de la recette en minuscule inclut le mot clef
          recipe.name.toLowerCase().includes(keyword) || //ou
          // la description de la recette en minuscule inclut le mot clef
          recipe.description.toLowerCase().includes(keyword) || //ou
          // dans le tableau des ingredients teste si au moins un ingredient du tableau
          recipe.ingredients.some(({ ingredient }) =>
            // en minuscule inclut le mot clef
            ingredient.toLowerCase().includes(keyword)
          )
        );
      });
    });
  }

  tagsIngredient.forEach((tagIngredient) => {
    listFilteredRecipes = listFilteredRecipes.filter((recipe) => {
      return recipe.ingredients.some(({ ingredient }) => ingredient.toLowerCase() === tagIngredient);
    });
  });

  tagsAppareil.forEach((tagAppareil) => {
    listFilteredRecipes = listFilteredRecipes.filter((recipe) => {
      return recipe.appliance.toLowerCase() === tagAppareil;
    });
  });

  tagsUstensil.forEach((tagUstensil) => {
    listFilteredRecipes = listFilteredRecipes.filter((recipe) => {
      return recipe.ustensils.some((ustensil) => ustensil.toLowerCase() === tagUstensil);
    });
  });

  getKeywordsAdvancedSearch(listFilteredRecipes);
  displayRecipes(listFilteredRecipes);
  displayAdvancedSearchIngredient(listFilteredRecipesIngredients);
  displayAdvancedSearchAppareil(listFilteredRecipesAppareils);
  displayAdvancedSearchUstensile(listFilteredRecipesUstensiles);
};

const filterIngredients = (searchIngredient) => {
  if (searchIngredient.length >= 1) {
    const keywords = searchIngredient
      .toLowerCase()
      .split(" ")
      .filter((string) => string.length > 0);
    const filteredIngredients = listFilteredRecipesIngredients.filter((ingredient) => {
      return keywords.every((keyword) => {
        return ingredient.toLowerCase().includes(keyword);
      });
    });
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
    const filteredAppareils = listFilteredRecipesAppareils.filter((ingredient) => {
      return keywords.every((keyword) => {
        return ingredient.toLowerCase().includes(keyword);
      });
    });
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
    const filteredUstensiles = listFilteredRecipesUstensiles.filter((ingredient) => {
      return keywords.every((keyword) => {
        return ingredient.toLowerCase().includes(keyword);
      });
    });
    displayAdvancedSearchUstensile(filteredUstensiles);
  } else {
    displayAdvancedSearchUstensile(listFilteredRecipesUstensiles);
  }
};

async function init() {
  const { recipes } = await getRecipes();
  allRecipes = recipes;
  displayRecipes(recipes);
  openCloseDropdownButtons();
  getKeywordsAdvancedSearch(recipes);
  initSearchBar();
  displayAdvancedSearchIngredient(listFilteredRecipesIngredients);
  displayAdvancedSearchAppareil(listFilteredRecipesAppareils);
  displayAdvancedSearchUstensile(listFilteredRecipesUstensiles);
}

init();
