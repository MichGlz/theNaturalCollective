const urlParams = new URLSearchParams(window.location.search);

const idProduct = urlParams.get("product");
const silfenPlay = urlParams.get("collection");

var productInfo;

if (silfenPlay) {
  document.querySelector("body").classList.add("silfenPlay");
  document.querySelector(".logo img").src = "assets/silfenplayLogo.svg";
}

window.addEventListener("load", fetchProduct);

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
  btnEl = document.querySelector("#addToCart");
  btnEl.dataset.id += product._id;
  btnEl.addEventListener("click", () => {
    // alert("hey");
    // console.log(product);
    CART.add(product);
  });
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
        while (response[y].silfen_play) {
          y = Math.floor(Math.random() * x);
          console.log(response[y].silfen_play);
        }
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
