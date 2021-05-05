const urlInfo = new URLSearchParams(window.location.search);

const nameP = urlInfo.get("name");
const email = urlInfo.get("email");
const street = urlInfo.get("street");
const city = urlInfo.get("city");
const zipcode = urlInfo.get("zipcode");
const country = urlInfo.get("country");

document.querySelector(".persona h2").textContent = nameP;
document.querySelector(".persona h3").textContent = email;
document.querySelector(
  ".persona p"
).innerHTML = `${street} ${city} <br> ${zipcode} ${country}`;
const wrapperFormCart = document.querySelector(".cart-shipping");
const nextBtn = document.querySelector(".buttonsWrapper .nextBtn");
const formCC = document.querySelector(`form[name="CC"]`);
console.log(formCC);
nextBtn.addEventListener("click", confirm);

function confirm() {
  nextBtn.removeEventListener("click", confirm);
  nextBtn.textContent = "CONFIRM";
  nextBtn.classList.add("green");
  wrapperFormCart.classList.add("greyFilter");
  document.querySelector("#credit_card").value = "XXXX XXXX XXXX XXXX";
  document.querySelector("#expDate").value = "-- --";
  document.querySelector("#cvv").value = "---";
  nextBtn.addEventListener("click", cleanBasket);
}

function cleanBasket() {
  localStorage.setItem("basket", "[]");
  localStorage.setItem("cartItems", "0");
}
