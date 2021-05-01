const urlParams = new URLSearchParams(window.location.search);

const typeBag = urlParams.get("type");
const colorBag = urlParams.get("color");
const collectionBag = urlParams.get("collection");
let allBags = urlParams.get("all");

let newPrice;
let endPoint;
let urlFetch;

let titles = [typeBag, colorBag, collectionBag];
let inputValue = titles.join("");
let headerShop = inputValue.toUpperCase();

if (allBags == "true") {
  urlFetch = `https://kea21spring-0a0d.restdb.io/rest/silfenproducts`;
  console.log(allBags);
  inputValue = "all";
  headerShop = "SHOP";
} else {
  urlFetch = `https://kea21spring-0a0d.restdb.io/rest/silfenproducts?q={"$or": [{"type": "${typeBag}"}, {"color": "${colorBag}"}, {"collection": "${collectionBag}"}]}`;
}

document.querySelector(".filterName").textContent = headerShop;
document
  .querySelector(`input[value="${inputValue}"]`)
  .setAttribute("checked", "checked");
console.log(inputValue);

window.addEventListener("load", fetchProductList);

console.log(titles);

document.querySelector("#black").value;
document
  .querySelector("#colorsFilter")
  .addEventListener("change", fetchProductFilter);
document
  .querySelector("#typeFilter")
  .addEventListener("change", fetchProductFilter);
document
  .querySelector("#collectionFilter")
  .addEventListener("change", fetchProductFilter);

function fetchProductList() {
  fetch(urlFetch, {
    method: "GET",
    headers: {
      "x-apikey": "60534ad0ff8b0c1fbbc28be2",
    },
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(response);
      showProductList(response);
    })
    .catch((err) => {
      console.error(err);
    });
}

function fetchProductFilter(e) {
  console.log(e.originalTarget.value);
  const color = e.originalTarget.value;
  const name = e.originalTarget.name;
  if (color == "all") {
    location.href = `shop.html?all=true`;
    return;
  }

  location.href = `shop.html?${name}=${color}`;
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
