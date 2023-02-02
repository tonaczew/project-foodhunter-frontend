"use strict";

// Elements
const btnAdd = document.getElementById("add-btn");
const btnComplete = document.getElementById("complete-btn");
const btnGetPrice = document.getElementById("get-price-btn");

const shoppingListContainer = document.getElementById("shopping-list-div");
const userInputField = document.getElementById("input-field");
const shoppingResultContainer = document.getElementById("result-container");
const responsListContainer = document.getElementById("response-list");

//Variables
const finishedShoppingList = [];
let responseArray = [];

// Functions
const getData = async (parsedQuery) => {
  console.log(parsedQuery);
  // "http://localhost:8081/list2"
  // "http://localhost:8081/ica"
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
btnAdd.addEventListener("click", () => {
  const paragraph = document.createElement("span");
  paragraph.className = "shopping-item";
  paragraph.innerText = userInputField.value;
  shoppingListContainer.appendChild(paragraph);
});

btnComplete.addEventListener("click", () => {
  shoppingListContainer.style.border = "solid";
  const shoppingItems = document.querySelectorAll(".shopping-item");
  for (let i = 0; i < shoppingItems.length; i++) {
    finishedShoppingList.push(shoppingItems[i].textContent);
  }
  console.log("shopping list", finishedShoppingList);
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
        productName: "Ost med kebab",
        price: "177",
      },
      { productName: "smör", price: "23" },
    ],
  },
];
