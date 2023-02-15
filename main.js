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
let responseArray;

// Functions
const createHtmlElement = (element) => document.createElement(`${element}`);

const increaseAmount = (price) => {
  if (price !== "-") return Number(price);
  else return 0;
};

const getAllShoppingListItems = () =>
  document.querySelectorAll(".shopping-item");

const getData = async (parsedQuery) => {
  console.log(parsedQuery);
  try {
    const response = await axios.get("http://localhost:8081/getPrice", {
      params: { products: parsedQuery },
    });
    return response.data;
  } catch (err) {
    return err.message;
  }
};

const parseParam = (lista) => {
  let str = "";
  for (let i = 0; i < lista.length; i++) {
    str += lista[i] + ",";
  }
  return str.substring(0, str.length - 1);
};

const displayWebscrapingContent = (loopingObject) => {
  for (let i = 0; i < loopingObject.length; i++) {
    let amount = 0;
    const divStore = createHtmlElement("div");
    const productGridDiv = createHtmlElement("div");
    divStore.classList = "store-div";
    productGridDiv.classList = "product-div";
    const paragraphStore = createHtmlElement("h2");
    paragraphStore.innerText = loopingObject[i].store;
    divStore.appendChild(paragraphStore);
    divStore.appendChild(productGridDiv);
    responsListContainer.appendChild(divStore);

    for (let j = 0; j < loopingObject[i].shoppingList.length; j++) {
      const divProductInfo = createHtmlElement("div");
      divProductInfo.classList = "product-info-div";
      const paragraphProduct = createHtmlElement("p");
      const paragraphPrice = createHtmlElement("p");
      paragraphProduct.innerText = loopingObject[i].shoppingList[j].productName;
      const productPrice = loopingObject[i].shoppingList[j].price;
      amount += increaseAmount(productPrice);
      paragraphPrice.innerText = `${productPrice} kr`;
      divProductInfo.appendChild(paragraphProduct);
      divProductInfo.appendChild(paragraphPrice);
      productGridDiv.appendChild(divProductInfo);
    }
    const divProductInfo = createHtmlElement("div");
    divProductInfo.classList = "product-info-div";
    const totalPriceLabel = createHtmlElement("p");
    const totalPriceAmount = createHtmlElement("p");
    totalPriceLabel.classList.add("tota-sum");
    totalPriceAmount.classList.add("tota-sum");
    totalPriceLabel.innerText = "Total";
    totalPriceAmount.innerText = `${amount.toFixed(2)} kr`;
    divProductInfo.appendChild(totalPriceLabel);
    divProductInfo.appendChild(totalPriceAmount);
    productGridDiv.appendChild(divProductInfo);
  }
};

// Buttons
btnClear.addEventListener("click", () => {
  btnGetPrice.classList.add("disabled-btn");
  btnComplete.classList.remove("ready-btn");
  userInputField.value = "";
  const shoppingItems = getAllShoppingListItems();
  while (responsListContainer.firstChild) {
    responsListContainer.removeChild(responsListContainer.firstChild);
  }
  shoppingItems.forEach((element) => element.parentNode.removeChild(element));
  const networkErrorParagraph =
    document.getElementsByClassName("network-error-p")[0];
  if (shoppingResultContainer.contains(networkErrorParagraph)) {
    shoppingResultContainer.removeChild(networkErrorParagraph);
  }
});

userInputField.addEventListener("keypress", (event) => {
  if (event.key === "Enter" && userInputField.value.trim().length >= 2) {
    const paragraph = createHtmlElement("p");
    paragraph.className = "shopping-item";
    paragraph.innerText = userInputField.value.replace(",", ".");
    addedProductContainer.appendChild(paragraph);
    userInputField.value = "";
    paragraph.addEventListener("click", () => {
      addedProductContainer.removeChild(paragraph);
    });
  }
});

btnComplete.addEventListener("click", () => {
  finishedShoppingList = [];
  const shoppingItems = getAllShoppingListItems();
  for (let i = 0; i < shoppingItems.length; i++) {
    finishedShoppingList.push(shoppingItems[i].textContent);
  }
  if (finishedShoppingList.length >= 1) {
    btnComplete.classList.add("ready-btn");
    btnGetPrice.classList.remove("disabled-btn");
  }
});

const loadBanner = document.getElementById("load-banner");

btnGetPrice.addEventListener("click", async () => {
  btnGetPrice.classList.add("disabled-btn");
  loadBanner.classList.toggle("hide");

  // axios GET request to API
  const parsedQuery = parseParam(finishedShoppingList);
  responseArray = await getData(parsedQuery);

  loadBanner.classList.toggle("hide");
  if (typeof responseArray !== "string") {
    //looping array change for testing
    const loopingArray = responseArray;
    displayWebscrapingContent(loopingArray);
  } else {
    const paragraph = createHtmlElement("p");
    paragraph.classList.add("network-error-p");
    paragraph.innerText = "Network error! Try again!";
    shoppingResultContainer.appendChild(paragraph);
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
        productName: "Ost",
        price: "1777",
      },
      { productName: "smör", price: "23" },
    ],
  },
];
