"use strict";

// Elements
const btnComplete = document.getElementById("complete-btn");
const btnGetPrice = document.getElementById("get-price-btn");
const btnClear = document.getElementById("clear-btn");

const shoppingListContainer = document.getElementById("added-list-div");
const userInputField = document.getElementById("input-field");
const shoppingResultContainer = document.getElementById("result-container");
const responsListContainer = document.getElementById("response-list");
const addedProductContainer = document.getElementById("added-products-div");

//Variables
let finishedShoppingList;
let responseArray = [];

// Functions
const getAllShoppingListItems = () =>
  document.querySelectorAll(".shopping-item");

const getData = async (parsedQuery) => {
  console.log(parsedQuery);
  const response = await axios.get("http://localhost:8081/getPrice", {
    params: { products: parsedQuery },
  });
  return response.data;
};

const parseParam = (lista) => {
  let str = "";
  for (let i = 0; i < lista.length; i++) {
    str += lista[i] + ",";
  }
  return str.substring(0, str.length - 1);
};

// Buttons
btnClear.addEventListener("click", () => {
  btnGetPrice.classList.add("disabled-btn");
  btnComplete.classList.remove("ready-btn");
  const shoppingItems = getAllShoppingListItems();
  while (responsListContainer.firstChild) {
    responsListContainer.removeChild(responsListContainer.firstChild);
  }
  shoppingItems.forEach((element) => element.parentNode.removeChild(element));
});

userInputField.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const paragraph = document.createElement("p");
    paragraph.className = "shopping-item";
    paragraph.innerText = userInputField.value.toUpperCase();
    addedProductContainer.appendChild(paragraph);
    userInputField.value = "";
  }
});

btnComplete.addEventListener("click", () => {
  finishedShoppingList = [];
  console.log("before shopping list", finishedShoppingList);
  const shoppingItems = getAllShoppingListItems();
  for (let i = 0; i < shoppingItems.length; i++) {
    finishedShoppingList.push(shoppingItems[i].textContent);
  }
  console.log("after shopping list", finishedShoppingList);
  btnComplete.classList.add("ready-btn");
  btnGetPrice.classList.remove("disabled-btn");
});

btnGetPrice.addEventListener("click", async () => {
  /*
  // axios GET request to API
  const parsedQuery = parseParam(finishedShoppingList);
  responseArray = await getData(parsedQuery);
  */

  //looping array change for testing
  const loopingArray = testObject;

  for (let i = 0; i < loopingArray.length; i++) {
    const divStore = document.createElement("div");
    const productGridDiv = document.createElement("div");
    divStore.classList = "store-div";
    productGridDiv.classList = "product-div";
    const paragraphStore = document.createElement("h2");
    paragraphStore.innerText = loopingArray[i].store;
    divStore.appendChild(paragraphStore);
    divStore.appendChild(productGridDiv);
    responsListContainer.appendChild(divStore);

    for (let j = 0; j < loopingArray[i].shoppingList.length; j++) {
      const divProductInfo = document.createElement("div");
      divProductInfo.classList = "product-info-div";
      const paragraphProduct = document.createElement("p");
      const paragraphPrice = document.createElement("p");
      paragraphProduct.innerText = loopingArray[i].shoppingList[j].productName;
      paragraphPrice.innerText = `${loopingArray[i].shoppingList[j].price} kr`;
      divProductInfo.appendChild(paragraphProduct);
      divProductInfo.appendChild(paragraphPrice);
      productGridDiv.appendChild(divProductInfo);
    }
  }
  btnGetPrice.classList.add("disabled-btn");
});

const testObject = [
  {
    store: "Ica",
    shoppingList: [
      {
        productName: "kvarg",
        price: "19",
      },
      {
        productName: "Ost",
        price: "152",
      },
      { productName: "smör", price: "25" },
    ],
  },
  {
    store: "Hemköp",
    shoppingList: [
      {
        productName: "kvarg",
        price: "21",
      },

      {
        productName: "Ost med kebab allting på extra",
        price: "1777",
      },
      { productName: "smör", price: "23" },
    ],
  },
];
