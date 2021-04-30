/* filter not working properly: https://s2021-8556.restdb.io/rest/testing?apikey=6034ed655ad3610fb5bb655d&q={}&filter= */

const form = document.querySelector("form.search");

console.log(form.elements);
document.querySelector(".btnSearch").addEventListener("click", submit);

function submit(e) {
  document.querySelector(".message").classList.remove("displaySMS");
  document.querySelector(".message p").textContent = "searching...";
  document.querySelector(".message").classList.add("displaySMS");
  document.querySelectorAll(".productMatch").forEach((element) => {
    element.remove();
  });
  e.preventDefault();
  //alert(form.elements.query.value);
  const q = form.elements.query.value;
  const url = `https://kea21spring-0a0d.restdb.io/rest/silfenproducts?q={"$or": [{"product_name": {"$regex":"${q}"}},{"type": {"$regex":"${q}"}}, {"color": {"$regex":"${q}"}}, {"collection": {"$regex":"${q}"}}]}`;

  console.log(url);

  fetch(url, {
    method: "GET",
    headers: { "x-apikey": "60534ad0ff8b0c1fbbc28be2" },
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(response);
      document.querySelector(".message").classList.remove("displaySMS");
      if (response.length < 1) {
        document.querySelector(".message p").innerHTML = "&#128531 no results!";
        document.querySelector(".message").classList.add("displaySMS");
      }
      show(response, q);
    })
    .catch((err) => {
      console.error(err);
    });
}

function show(matches, q) {
  matches.forEach((match) => {
    console.log(match);
    const template = document.querySelector("#productmatch").content;
    const copy = template.cloneNode(true);

    const h2Content = match.product_name;
    /*match.username.replaceAll(
      q,
      '<span class="red">' + q + "</span>"
    );*/
    console.log(h2Content);
    copy.querySelector("h2").innerHTML = h2Content;

    copy.querySelector(".price").textContent = `${match.price} kr.`;
    if (match.sale) {
      newPrice = Math.floor(match.price * ((100 - match.discount) / 100));
      copy.querySelector(
        ".price"
      ).innerHTML = `<span class="prevPrice">${match.price} kr.</span> ${newPrice} kr.`;
    }
    copy.querySelector(".description").innerHTML = match.type.replaceAll(
      q,
      `<span class="red">${q}</span>`
    );
    copy.querySelector("a").href = `product.html?product=${match._id}`;
    copy.querySelector("img").src = match.image_url;
    copy.querySelector("img").alt = match.product_name;

    /*  createAndFilter(copy, match, "h3", "email", q); */
    document.querySelector("section.matchList").appendChild(copy);
  });

  /*  function createAndFilter(copy, match, element, key, q) {
    copy.querySelector(element).innerHTML = match.key.replaceAll(
      q,
      '<span class="red">' + q + "</span>"
    );
  }*/
}
