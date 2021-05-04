const urlParams = new URLSearchParams(window.location.search);

const idProduct = urlParams.get("product");

var productInfo;

window.addEventListener("load", fetchProduct);

/*------------------cart-----------*/
const CART = {
  KEY: "60843bf122a6f434001050b0",
  contents: [],
  init() {
    //check localStorage and initialize the contents of CART.contents
    let _contents = localStorage.getItem(CART.KEY);
    if (_contents) {
      CART.contents = JSON.parse(_contents);
    } else {
      //dummy test data
      CART.contents = [
        { id: 1, title: "Apple", qty: 5, itemPrice: 0.85 },
        { id: 2, title: "Banana", qty: 3, itemPrice: 0.35 },
        { id: 3, title: "Cherry", qty: 8, itemPrice: 0.05 },
      ];
      CART.sync();
    }
  },
  async sync() {
    let _cart = JSON.stringify(CART.contents);
    await localStorage.setItem(CART.KEY, _cart);
  },
  find(id) {
    //find an item in the cart by it's id
    let match = CART.contents.filter((item) => {
      if (item.id == id) return true;
    });
    if (match && match[0]) return match[0];
  },
  add(id) {
    //add a new item to the cart
    //check that it is not in the cart already
    if (CART.find(id)) {
      CART.increase(id, 1);
    } else {
      let arr = PRODUCTS.filter((product) => {
        if (product.id == id) {
          return true;
        }
      });
      if (arr && arr[0]) {
        let obj = {
          id: arr[0].id,
          title: arr[0].title,
          qty: 1,
          itemPrice: arr[0].price,
        };
        CART.contents.push(obj);
        //update localStorage
        CART.sync();
      } else {
        //product id does not exist in products data
        console.error("Invalid Product");
      }
    }
  },
  increase(id, qty = 1) {
    //increase the quantity of an item in the cart
    CART.contents = CART.contents.map((item) => {
      if (item.id === id) item.qty = item.qty + qty;
      return item;
    });
    //update localStorage
    CART.sync();
  },
  reduce(id, qty = 1) {
    //reduce the quantity of an item in the cart
    CART.contents = CART.contents.map((item) => {
      if (item.id === id) item.qty = item.qty - qty;
      return item;
    });
    CART.contents.forEach(async (item) => {
      if (item.id === id && item.qty === 0) await CART.remove(id);
    });
    //update localStorage
    CART.sync();
  },
  remove(id) {
    //remove an item entirely from CART.contents based on its id
    CART.contents = CART.contents.filter((item) => {
      if (item.id !== id) return true;
    });
    //update localStorage
    CART.sync();
  },
  empty() {
    //empty whole cart
    CART.contents = [];
    //update localStorage
    CART.sync();
  },
  sort(field = "title") {
    //sort by field - title, price
    //return a sorted shallow copy of the CART.contents array
    let sorted = CART.contents.sort((a, b) => {
      if (a[field] > b[field]) {
        return 1;
      } else if (a[field] < a[field]) {
        return -1;
      } else {
        return 0;
      }
    });
    return sorted;
    //NO impact on localStorage
  },
  logContents(prefix) {
    console.log(prefix, CART.contents);
  },
};
let PRODUCTS = [];

document.addEventListener("DOMContentLoaded", () => {
  CART.init();
  // showCart();
});

/*--------------endcart-----------*/

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

let productLocal = {};
let product_name_local;

function showProduct(product) {
  productLocal = JSON.stringify(product);
  product_name_local = product.product_name;

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
  console.log(localStorage);

  localStorage.setItem(`"${product_name_local}"`, productLocal);
  console.log(localStorage);
}

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
    copy.querySelector("a").href = `product.html?product=${product._id}`;

    copy.querySelector("img").src = product.image_url;
    copy.querySelector("img").alt = product.product_name;

    //append
    document.querySelector(".productListContainer").appendChild(copy);
  });
}
