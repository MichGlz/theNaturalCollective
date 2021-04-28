const urlParams = new URLSearchParams(window.location.search);
window.addEventListener("load", fetchProductList);

let newPrice;
let endPoint;

document.querySelector("#black").value;
document
  .querySelector("#colorsFilter")
  .addEventListener("change", fetchProductFilter);

function fetchProductList() {
  fetch(`https://kea21spring-0a0d.restdb.io/rest/silfenproducts`, {
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
  document.querySelectorAll(".smallCardContainer").forEach((card) => {
    console.log("hola");
    card.remove();
  });
  console.log(e.originalTarget.value);
  const color = e.originalTarget.value;
  if (color == "all") {
    fetchProductList();
    return;
  }
  endPoint = `?q={"color": "${color}"}`;
  fetch(`https://kea21spring-0a0d.restdb.io/rest/silfenproducts${endPoint}`, {
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
    copy.querySelector("a").href = `product.html?product=${product._id}`;

    copy.querySelector("img").src = product.image_url;
    copy.querySelector("img").alt = product.product_name;

    //append
    document.querySelector(".productListContainer").appendChild(copy);
  });
}

/*-------------------fade in aprove post---------------------*/
function approveArticle() {
  console.log("approve");
  fetch(`https://reicpe-9cc2.restdb.io/rest/posts/${articleId}`, {
    method: "PATCH",
    headers: {
      "x-apikey": "606d5dcef5535004310074f4",
      "Content-Type": "application/json",
    },
    body: '{"approved":true}',
  })
    .then((response) => {
      // console.log(response);
      window.open("index.html", "_self");
    })
    .catch((err) => {
      console.error(err);
    });
}
//-------------- fade in -------------------

const appearOptions = {
  threshold: 0,
  rootMargin: "0px 0px -150px 0px",
};

const appearOnScroll = new IntersectionObserver(function (
  entries,
  appearOnScroll
) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      console.log("hola");
      return;
    } else {
      entry.target.classList.add("appear");
      appearOnScroll.unobserve(entry.target);
    }
  });
},
appearOptions);

function faderMachine() {
  faders = document.querySelectorAll(".fade-in");
  console.log("fade-in");
  faders.forEach((fader) => {
    appearOnScroll.observe(fader);
  });
}
