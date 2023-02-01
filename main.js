"use strict";

// Elements
const btnAdd = document.getElementById("add-btn");
const btnComplete = document.getElementById("complete-btn");
const btnGetPrice = document.getElementById("get-price-btn");

const shoppingListContainer = document.getElementById("shopping-list-div");
const userInputField = document.getElementById("input-field");
const shoppingResultContainer = document.getElementById("result-container");
const responsListContainer = document.getElementById("respons-list");

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
  const paragraph = document.createElement("p");
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
  const parsedQuery = parseParam(finishedShoppingList);
  responseArray = await getData(parsedQuery);
  const loopingArray = responseArray;

  for (let i = 0; i < loopingArray.length; i++) {
    const paragraphStore = document.createElement("h2");
    paragraphStore.innerText = loopingArray[i].store;
    responsListContainer.appendChild(paragraphStore);

    for (let j = 0; j < loopingArray[i].shoppingList.length; j++) {
      const paragraphProduct = document.createElement("span");
      const paragraphPrice = document.createElement("span");
      paragraphProduct.innerText = loopingArray[i].shoppingList[j].productName;
      paragraphPrice.innerText = `${loopingArray[i].shoppingList[j].price} kr`;
      responsListContainer.appendChild(paragraphProduct);
      responsListContainer.appendChild(paragraphPrice);
      responsListContainer.appendChild(document.createElement("br"));
    }
  }
});
