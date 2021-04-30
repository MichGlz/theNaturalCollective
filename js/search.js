/* filter not working properly: https://s2021-8556.restdb.io/rest/testing?apikey=6034ed655ad3610fb5bb655d&q={}&filter= */

const form = document.querySelector("form");

console.log(form.elements);
document.querySelector("button").addEventListener("click", submit);

function submit(e) {
  e.preventDefault();
  //alert(form.elements.query.value);
  const q = form.elements.query.value;
  const url = `https://kea21spring-0a0d.restdb.io/rest/silfenproducts?q={"$or": [{"product_name": {"$regex":"${q}"}},{"type": {"$regex":"${q}"}}, {"color": {"$regex":"${q}"}}, {"collection": {"$regex":"${q}"}}]}`;

  console.log(url);
  /* const url =
    "https://s2021-8556.restdb.io/rest/testing?apikey=6034ed655ad3610fb5bb655d&q=%7B%7D&filter=" +
    q;*/
  fetch(url, {
    method: "GET",
    headers: { "x-apikey": "60534ad0ff8b0c1fbbc28be2" },
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(response);
      show(response, q);
    })
    .catch((err) => {
      console.error(err);
    });
}

function show(matches, q) {
  matches.forEach((match) => {
    console.log(match);
    const template = document.querySelector("template").content;
    const copy = template.cloneNode(true);

    const h2Content = match.product_name;
    /*match.username.replaceAll(
      q,
      '<span class="red">' + q + "</span>"
    );*/
    console.log(h2Content);
    copy.querySelector("h2").innerHTML = h2Content;

    copy.querySelector("h3").innerHTML = match.type.replaceAll(
      q,
      `<span class="red">${q}</span>`
    );
    /*  createAndFilter(copy, match, "h3", "email", q); */
    document.querySelector("section").appendChild(copy);
  });

  /*  function createAndFilter(copy, match, element, key, q) {
    copy.querySelector(element).innerHTML = match.key.replaceAll(
      q,
      '<span class="red">' + q + "</span>"
    );
  }*/
}
