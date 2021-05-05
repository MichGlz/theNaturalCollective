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
