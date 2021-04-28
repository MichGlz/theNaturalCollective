const urlParams = new URLSearchParams(window.location.search);

const brandId = urlParams.get("brand");
const startId = urlParams.get("start");
const limiiId = urlParams.get("limit");
const seasonId = urlParams.get("season");

// document.querySelector("#next").addEventListener("click", nextN);
// document.querySelector("#prev").addEventListener("click", prevN);
// document.querySelector("#season").addEventListener("change", selectSeason);
// document.querySelector("#contOnPage").addEventListener("change", contOnPage);

// let contPage = document.querySelector("#contOnPage");
// let season = document.querySelector("#season");

let nextNo = Number(startId);
let xNo = Number(limiiId);
if (xNo < 12) {
  xNo = 12;
}

let urlNew;
let seasonUrl;
if (seasonId) {
  seasonUrl = `&season=${seasonId}`;
  document.querySelector("#season option").textContent = seasonId;
  if (seasonId == "All") {
    seasonUrl = "";
  }
}

document.querySelector("#contOnPage option").textContent = xNo;
document.querySelector("#prev").textContent = `Prev ${xNo}`;
document.querySelector("#next").textContent = `Next ${xNo}`;

function selectSeason() {
  seasonUrl = `&season=${season.value}`;
  if (season.value == "All") {
    seasonUrl = "";
  }
  location.href = `productlist.html?brand=${brandId}&limit=${xNo}&start=${nextNo}${seasonUrl}`;
}

function contOnPage() {
  xNo = Number(contPage.value);
  console.log(xNo);
  if (nextNo < xNo) {
    nextNo = 0;
  }
  location.href = `productlist.html?brand=${brandId}&limit=${xNo}&start=${nextNo}&season=${seasonId}`;
}

document.querySelector(".listCont").textContent = `${nextNo} - ${nextNo + xNo}`;

if (nextNo < xNo) {
  document.querySelector("#prev").removeEventListener("click", prevN);
}

function nextN() {
  console.log("nextN");
  nextNo = nextNo + xNo;
  console.log(nextNo);
  location.href = `productlist.html?brand=${brandId}&limit=${xNo}&start=${nextNo}&season=${seasonId}`;
  // document.querySelector(
  //   ".bottonContainer a:nth-child(2)"
  // ).href = `productlist.html?brand=${brandId}&limit=${xNo}&start=${nextNo}`;
}

function prevN() {
  console.log("prevN");
  nextNo = nextNo - xNo;
  console.log(nextNo);
  location.href = `productlist.html?brand=${brandId}&limit=${xNo}&start=${nextNo}&season=${seasonId}`;
  // document.querySelector(
  //   ".bottonContainer a"
  // ).href = `productlist.html?brand=${brandId}&limit=${xNo}&start=${nextNo}`;
}

const urlBrand = `https://kea-alt-del.dk/t7/api/products?brandname=${brandId}&limit=${xNo}&start=${nextNo}${seasonUrl}`;

const url = "https://kea-alt-del.dk/t7/api/products";

document.querySelector("main h2").textContent = brandId;

fetch(urlBrand)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    handleProductList(data);
  });

function handleProductList(data) {
  //console.log(data);
  data.forEach(showProduct);
  if (data.length < 1) {
    console.log("no hay productos");
    emptyData();
  }
}

function showProduct(product) {
  console.log(product);

  //grab the template
  const template = document.querySelector("#smallProductTemplate").content;
  //clone it
  const copy = template.cloneNode(true);
  //change content
  copy.querySelector(
    ".subtle"
  ).textContent = `${product.articletype} | ${product.brandname} | ${product.season}`;
  copy.querySelector("h3").textContent = product.productdisplayname;
  copy.querySelector(
    "img"
  ).src = `https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp`;
  copy.querySelector("img").alt = `
    ${product.brandname} ${product.productdisplayname}`;

  copy.querySelector(".price:not(span)").textContent = `DKK ${product.price},-`;

  if (product.soldout) {
    copy.querySelector("article").classList.add("soldOut");
  }

  if (product.discount) {
    copy.querySelector("article").classList.add("onSale");
    let newPrice = product.price * (1 - product.discount / 100);
    copy.querySelector(
      ".discounted p"
    ).textContent = `Now DKK ${newPrice.toFixed()},-`;
    copy.querySelector(
      ".discounted p:nth-child(2)"
    ).textContent = `- ${product.discount}%`;
    copy.querySelector(".price").textContent = `Prev. DKK ${product.price},-`;
  }

  copy.querySelector("a").href = `product.html?id=${product.id}`;

  //grab parent
  const parent = document.querySelector("main");
  //append
  parent.appendChild(copy);
}

function emptyData() {
  const template = document.querySelector("#empty").content;
  const copy = template.cloneNode(true);
  if (seasonId) {
    copy.querySelector(
      "h2"
    ).textContent = `There are not products ${brandId} in ${seasonId} season.`;
  } else {
    copy.querySelector(
      "h2"
    ).textContent = ` There are not more products ${brandId}`;
  }
  const parent = document.querySelector("main");
  parent.appendChild(copy);
}
