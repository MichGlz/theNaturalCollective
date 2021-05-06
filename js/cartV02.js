let cartItems = Number(localStorage.getItem("cartItems"));
let sub_total;
let total_cart;
const cartItemTemplete = `<template id="cart-item-template">
<div class="cart-item">
  <label for="fid-">NAME</label>
  <div class="plus-minus">
    <button class="minus" type="button">-</button>
    <input type="number" name="NAME-" id="fid-" min="0" max="20" />
    <button class="plus" type="button">+</button>
  </div>
  <p class="price-row">DKK<span></span></p>
  <p class="price-each">DKK<span></span> each</p>
</div>
</template>`;

const cartInNav = `
<a href="search.html"><img src="assets/search.svg" alt="icon" /></a
            ><a class="cartIcon" href="cart.html"
              ><img src="assets/cart.svg" alt="icon"
            /></a>
<!---start dropdown cart---->
<div class="cart">
  <h3>Shopping Cart</h3>
  <form>
    <div class="cart-content">
      <h4>THE CART IS EMPTY</h4>
    </div>
    <!-- .END .cart-content-->
    <button id="checkout-pay" type="button">CHECKOUT & PAY</button>
  </form>
</div>
<!---end dropdown cart---->
<div class="cartItemsCounter"><p></p></div>`;
document.querySelector("head").innerHTML +=
  '<link rel="stylesheet" href="css/appCart.css" type="text/css"/>';

document.querySelector("main").innerHTML += cartItemTemplete;
document.querySelector(".search-cart").innerHTML = cartInNav;

document.querySelector(".cartItemsCounter").classList.add("hideCartCounter");

console.log(localStorage);

const CART = {
  KEY: "basket",
  contents: [],
  init() {
    //_contents is a temporary string
    let _contents = localStorage.getItem(CART.KEY);
    console.log(_contents);

    if (_contents.length == 0) {
      CART.contents = [
        {
          _id: "607f216322a6f434000e601e",
          img: "http://Kari.ca/",
          qty: 5,
          name: "Ut dolores",
          price: 730,
        },
        {
          _id: "2",
          img: "nonoe",
          qty: 3,
          name: "Hej there",
          price: 500,
        },
        {
          _id: "3",
          img: "nonoe",
          qty: 2,
          name: "Hej there",
          price: 500,
        },
      ];
    } else {
      {
        //if there's anything there, turn it into JS objects, that we can access with the dot . notation
        CART.contents = JSON.parse(_contents);
      }
    }
    //I want to update the
    //this.updateDOM(); //lacj!!! use this when we're not hardcoding the contents, and the content is read from localStorage
    CART.sync();
  },
  sync() {
    //turn CART contents array of objects into a string that we can write in localStorage
    let _cart = JSON.stringify(CART.contents);
    localStorage.setItem(CART.KEY, _cart);
    CART.updateDOM();
  },
  updateDOM() {
    const cartcontentEl = document.querySelector(".cart-content");

    cartcontentEl.innerHTML = "";

    //If we have an empty array / an array with the length of 0
    if (CART.contents.length === 0) {
      cartcontentEl.innerHTML = "<h4>The cart is empty</h4>";
    } else {
      CART.contents.forEach((element) => {
        // console.log(element);

        const tempItem = document.querySelector("#cart-item-template").content;

        const itemcopy = tempItem.cloneNode(true);

        // itemcopy.querySelector("h2").textContent = element.product_name;
        const id = element._id;
        const labelEl = itemcopy.querySelector("label");

        labelEl.textContent = element.product_name;
        labelEl.setAttribute("for", "fid-" + id);

        const minusBtn = itemcopy.querySelector(".minus");
        minusBtn.addEventListener("click", () => {
          CART.minusOne(id);
        });

        const inputEl = itemcopy.querySelector("input");
        inputEl.id += id;
        inputEl.name += id;
        inputEl.value = element.qty;

        inputEl.addEventListener("input", () => {
          const itemQty = inputEl.valueAsNumber;
          element.qty = itemQty;
          /*  console.log("element");
            console.log(element); */
          CART.update(element);
        });

        inputEl.addEventListener("focus", (e) => {
          e.target.select();
        });

        const plusBtn = itemcopy.querySelector(".plus");
        plusBtn.addEventListener("click", () => {
          CART.plusOne(id);
        });

        const priceEl = itemcopy.querySelector(".price-row span");
        priceEl.textContent = Number(element.price) * Number(element.qty);
        if (element.sale) {
          priceEl.textContent = Math.floor(
            Number(element.price) *
              (1 - Number(element.discount) / 100) *
              Number(element.qty)
          );
        }
        const priceEleach = itemcopy.querySelector(".price-each span");
        priceEleach.textContent = Number(element.price);
        if (element.sale) {
          priceEleach.textContent = Math.floor(
            Number(element.price) * (1 - Number(element.discount) / 100)
          );
        }

        cartcontentEl.appendChild(itemcopy);
      });
    }
    logCartCounting();

    /*----countin items in cart---*/
    // document
    //   .querySelectorAll(`.cart form input[type="number"]`)
    //   .forEach((item) => {
    //     cartItems = cartItems + Number(item.value);
    //   });
    /*----------------------------- */
  },
  add(obj) {
    const index = CART.contents.findIndex((element) => element._id == obj._id);
    if (index == -1) {
      console.log(obj);
      obj.qty = 1;
      console.log(CART.contents);
      CART.contents.push(obj);
      cartItems = cartItems + 1;
    } else {
      CART.contents[index].qty += 1;
      cartItems++;
    }
    logCartCounting();
    console.log(CART.contents);
    this.sync();
  },
  update(obj) {
    //find the index of the object
    const index = CART.contents.findIndex((element) => element._id == obj._id);

    //If the qty is 0 we'll remove from the CART.contens array of objects, so that it's nol onger show in the cart
    if (obj.qty === 0) {
      //The splice() method changes the contents of an array by removing or replacing existing elements and/or adding new elements in place -- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
      //1. parameter start (index in the array), 2. paramter: how many? - here 1
      CART.contents.splice(index, 1);
      // cartItems--;
      // logCartCounting();
    } else {
      //we'll have to read the data from the input field
      /* const inputEl = document.querySelector("#fid-" + obj._id);
      CART.contents[index].qty = inputEl.valueAsNumber; */
      CART.contents[index].qty = obj.qty;
    }

    CART.sync();
  },

  deleteProduct(id) {
    const indexObj = CART.contents.find((element) => element._id == id);
    cartItems = cartItems - indexObj.qty;
    indexObj.qty = indexObj.qty - indexObj.qty;
    console.log(indexObj);
    CART.update(indexObj);

    logCartCounting();
  },

  minusOne(id) {
    const indexObj = CART.contents.find((element) => element._id == id);
    indexObj.qty--;
    console.log(indexObj);
    CART.update(indexObj);
    cartItems--;
    logCartCounting();
  },
  plusOne(id) {
    const indexObj = CART.contents.find((element) => element._id == id);
    indexObj.qty++;
    console.log(indexObj);
    CART.update(indexObj);
    cartItems++;
    logCartCounting();
  },
};

console.log(localStorage.getItem("basket"));
CART.init();

function logCartCounting() {
  if ((cartItems < 1) | (cartItems == null)) {
    cartItems = 0;
    document
      .querySelector(".cartItemsCounter")
      .classList.add("hideCartCounter");
  } else {
    document.querySelector(".cartItemsCounter p").textContent = cartItems;
    localStorage.setItem("cartItems", cartItems);
    document
      .querySelector(".cartItemsCounter")
      .classList.remove("hideCartCounter");
  }
}

function subtotal() {
  let x = 0;
  let subTotal = document.querySelectorAll(".cart-page .price-row span");
  subTotal.forEach((dkk) => {
    x = x + Number(dkk.textContent);
    console.log(x);
  });
  if (subTotal.length < 1) {
    x = 0;
  }
  document.querySelector(".subtotalP").textContent = `${x} DKK`;
  document.querySelector(".totalP").textContent = `${x} DKK`;
  sub_total = x;
  document.querySelector(".form-shipping").addEventListener("change", (e) => {
    total_cart = sub_total + Number(e.target.value);
    document.querySelector(".totalP").textContent = `${total_cart} DKK`;
  });
}
