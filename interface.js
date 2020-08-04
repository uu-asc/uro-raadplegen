console.log("i have been summoned")

fetch("data.json")
  .then(response => response.json())
  .then(json => console.log(json));
