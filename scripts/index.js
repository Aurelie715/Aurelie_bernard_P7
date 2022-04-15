async function getRecipes() {
  const response = await fetch("./data/recipe.json");
  return await response.json();
}

function displayRecipe(recipes) {
  const recipesSection = document.querySelector(".recipes");
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

function displayFilterButtons(recipes) {
  const keywordListIngredient = document.getElementById("list-ingredient");
  const keywordListAppareil = document.getElementById("list-appareil");
  const keywordListUstensile = document.getElementById("list-ustensile");

  const ingredientNames = recipes.flatMap(({ ingredients }) =>
    ingredients.map(({ ingredient }) => ingredient)
  );
  const uniqueIngredients = [...new Set(ingredientNames)]
    .map((ingredient) => `<li>${ingredient}</li>`)
    .join("");
  keywordListIngredient.insertAdjacentHTML(
    "beforeend",
    uniqueIngredients.toLowerCase()
  );

  const appareilNames = recipes.map(({ appliance }) => appliance);
  const uniqueAppareil = [...new Set(appareilNames)]
    .map((appliance) => `<li>${appliance}</li>`)
    .join("");
  keywordListAppareil.insertAdjacentHTML("beforeend", uniqueAppareil);

  const ustensileNames = recipes.flatMap(({ ustensils }) => ustensils);
  const uniqueUstensil = [...new Set(ustensileNames)]
    .map((ustensils) => `<li>${ustensils}</li>`)
    .join("");
  keywordListUstensile.insertAdjacentHTML("beforeend", uniqueUstensil);
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

async function init() {
  const { recipes } = await getRecipes();
  displayRecipe(recipes);
  openCloseDropdownButtons();
  displayFilterButtons(recipes);
}

init();
