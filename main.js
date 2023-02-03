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

  if (
    shoppingResultContainer.contains(
      document.getElementsByClassName("network-error-p")[0]
    )
  ) {
    shoppingResultContainer.removeChild(
      document.getElementsByClassName("network-error-p")[0]
    );
  }
});

userInputField.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const paragraph = document.createElement("p");
    paragraph.className = "shopping-item";
    paragraph.innerText = userInputField.value;
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
  console.log("after shopping list", finishedShoppingList);
  btnComplete.classList.add("ready-btn");
  btnGetPrice.classList.remove("disabled-btn");
});

btnGetPrice.addEventListener("click", async () => {
  btnGetPrice.classList.add("disabled-btn");
  // axios GET request to API

  const parsedQuery = parseParam(finishedShoppingList);
  responseArray = await getData(parsedQuery);

  if (typeof responseArray !== "string") {
    //looping array change for testing
    const loopingArray = responseArray;

    for (let i = 0; i < loopingArray.length; i++) {
      let amount = 0;
      const divStore = document.createElement("div");
      const productGridDiv = document.createElement("div");
      divStore.classList = "store-div";
      productGridDiv.classList = "product-div";
      const paragraphStore = document.createElement("h2");
      paragraphStore.innerText = loopingArray[i].store;
      divStore.appendChild(paragraphStore);
      divStore.appendChild(productGridDiv);
      responsListContainer.appendChild(divStore);

      //refactor
      for (let j = 0; j < loopingArray[i].shoppingList.length; j++) {
        const divProductInfo = document.createElement("div");
        divProductInfo.classList = "product-info-div";
        const paragraphProduct = document.createElement("p");
        const paragraphPrice = document.createElement("p");
        paragraphProduct.innerText =
          loopingArray[i].shoppingList[j].productName;
        const productPrice = loopingArray[i].shoppingList[j].price;
        amount += increaseAmount(productPrice);
        paragraphPrice.innerText = `${productPrice} kr`;
        divProductInfo.appendChild(paragraphProduct);
        divProductInfo.appendChild(paragraphPrice);
        productGridDiv.appendChild(divProductInfo);
      }
      const divProductInfo = document.createElement("div");
      divProductInfo.classList = "product-info-div";
      const totalPriceLabel = document.createElement("p");
      const totalPriceAmount = document.createElement("p");
      totalPriceLabel.classList.add("tota-sum");
      totalPriceAmount.classList.add("tota-sum");
      totalPriceLabel.innerText = "Total";
      totalPriceAmount.innerText = `${amount.toFixed(2)} kr`;
      divProductInfo.appendChild(totalPriceLabel);
      divProductInfo.appendChild(totalPriceAmount);
      productGridDiv.appendChild(divProductInfo);
    }
  } else {
    const paragraph = document.createElement("p");
    paragraph.classList.add("network-error-p");
    paragraph.innerText = "Network error! Try again!";
    shoppingResultContainer.appendChild(paragraph);
    console.log("else:", responseArray);
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
        productName: "Ost med kebab allting på extra",
        price: "1777",
      },
      { productName: "smör", price: "23" },
    ],
  },
];
