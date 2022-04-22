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

const searchRecipes = (recipes) => {
  const search = document.querySelector(".search__bar");
  search.addEventListener("keyup", (event) => {
    // si la longueur de event.target.value
    // (ce que l'on a tapé dans la barre de recherche
    // event -> keyup, target -> input, value -> valeur de l'input)
    // est plus grand ou égal à 3
    if (event.target.value.length >= 3) {
      // searchValue = la valeur de l'input en minuscule
      const searchValue = event.target.value.toLowerCase();
      const keywords = searchValue
        // split scinde searchValue en plusieurs chaine de caractère
        //(nouvelle chaine chaque fois qu'il y a un espace) et les places dans un tableau
        .split(" ")
        // supprime les chaines vides dans le tableau
        .filter((string) => string.length > 0);
      // retourne un nouveau tableau contenant toutes les recettes incluant la valeur de l'input
      const filterByKeyword = recipes.filter((recipe) => {
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
      displayRecipes(filterByKeyword);
    } else {
      displayRecipes(recipes);
    }
  });
};

async function init() {
  const { recipes } = await getRecipes();
  displayRecipes(recipes);
  openCloseDropdownButtons();
  displayFilterButtons(recipes);
  searchRecipes(recipes);
}

init();
