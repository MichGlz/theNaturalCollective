const urlParams = new URLSearchParams(window.location.search);

const idProduct = urlParams.get("product");

var productInfo;
let cartItems = Number(localStorage.getItem("cartItems"));
document.querySelector(".cartItemsCounter").classList.add("hideCartCounter");

window.addEventListener("load", fetchProduct);

console.log(localStorage);

function fetchProduct() {
  fetch(`https://kea21spring-0a0d.restdb.io/rest/silfenproducts/${idProduct}`, {
    method: "GET",
    headers: {
      "x-apikey": "60534ad0ff8b0c1fbbc28be2",
    },
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(response);
      showProduct(response);

      fetchSmallCards();
    })
    .catch((err) => {
      console.error(err);
    });
}

// const fetch_url = "https://s2021-8556.restdb.io/rest/t9products?max=20";

// fetch(fetch_url, {
//   method: "GET",
//   headers: {
//     "x-apikey": "6034ed655ad3610fb5bb655d",
//   },
// })
//   .then((res) => res.json())
//   .then((response) => {
//     // console.log(response);
//     showproducts(response);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

// function showproducts(data) {
//   // console.table(data);
//   data.forEach((product) => {
//     showproduct(product);
//   });
// }

//loop

function showProduct(product) {
  // productLocal = JSON.stringify(product);
  // product_name_local = product.product_name;

  document.querySelector(".productName").textContent = product.product_name;
  document.querySelector(".price").textContent = `${product.price} kr.`;
  if (product.sale) {
    newPrice = Math.floor(product.price * ((100 - product.discount) / 100));
    let youSave = product.price - newPrice;
    document.querySelector(
      ".price"
    ).innerHTML = `<span class="prevPrice">${product.price} kr.</span><span class="newPrice">${newPrice} kr.</span><span class="youSave"> you save ${youSave} kr.</span>`;
    document.querySelector(".saleIcon").classList.add("visible");
  }
  if (product.recycled) {
    document.querySelector(".recycledIcon").classList.add("visible");
  }
  document.querySelector(".description").textContent = product.description;

  document.querySelector(".imageContainerBig img").src = product.image_url;
  document.querySelector(".imageContainerBig img").alt = product.product_name;

  product.colours.forEach((c) => {
    const box = document.createElement("div");
    box.classList.add(c);
    document.querySelector(".colorsList").appendChild(box);
  });

  document.querySelector(`.${product.color}`).classList.add("selected");

  document.querySelectorAll(".miniPic img").forEach((pic) => {
    pic.src = product.image_url;
  });
  btnEl = document.querySelector("#addToCart");
  btnEl.dataset.id += product._id;
  btnEl.addEventListener("click", () => {
    // alert("hey");
    // console.log(product);
    CART.add(product);
  });
}

// function showproduct(product) {
//   //   console.log(product);
//   const tempProd = document.querySelector("#product-template").content;

//   const clone = tempProd.cloneNode(true);

//   const h2El = clone.querySelector("h2");
//   h2El.textContent = product.name;

//   const pEl = clone.querySelector("p");
//   pEl.textContent = product.price;

//   btnEl = clone.querySelector("button");
//   // btnEl.dataset.id += product._id;

//   btnEl.addEventListener("click", () => {
//     // alert("hey");
//     // console.log(product);
//     CART.add(product);
//   });

//   const productsEl = document.querySelector(".products");
//   productsEl.appendChild(clone);
// }

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

        const priceEl = itemcopy.querySelector(".price-each span");
        priceEl.textContent = element.price;

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

/*------------others also bought-------------------------*/

var productsArray = [];

function fetchSmallCards() {
  fetch(`https://kea21spring-0a0d.restdb.io/rest/silfenproducts`, {
    method: "GET",
    headers: {
      "x-apikey": "60534ad0ff8b0c1fbbc28be2",
    },
  })
    .then((res) => res.json())
    .then((response) => {
      var x = response.length;
      // console.log(x + "largo");
      var y;
      var i;
      for (i = 0; i < 4; i++) {
        y = Math.floor(Math.random() * x);
        productsArray.push(response[y]);
        // console.log(response[y]);
      }

      showProductList(productsArray);
    })
    .catch((err) => {
      console.error(err);
    });
}

function showProductList(products) {
  // console.log(posts);
  //grab the template
  const template = document.querySelector("template.productSmallCard").content;

  products.forEach((product) => {
    //clone
    const copy = template.cloneNode(true);
    //adjust stuff

    copy.querySelector("h2").textContent = product.product_name;
    copy.querySelector(".price").textContent = `${product.price} kr.`;
    if (product.sale) {
      newPrice = Math.floor(product.price * ((100 - product.discount) / 100));

      copy.querySelector(
        ".price"
      ).innerHTML = `<span class="prevPrice">${product.price} kr.</span> ${newPrice} kr.`;
      copy.querySelector(".saleIcon").classList.add("visible");
    }
    if (product.recycled) {
      copy.querySelector(".recycledIcon").classList.add("visible");
    }
    copy.querySelector("a").href = `product-copy.html?product=${product._id}`;

    copy.querySelector("img").src = product.image_url;
    copy.querySelector("img").alt = product.product_name;

    //append
    document.querySelector(".productListContainer").appendChild(copy);
  });
}

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
