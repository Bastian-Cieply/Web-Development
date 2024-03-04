function myFunction(x) {
    x.classList.toggle("change");
    toggleSidebar();
}

function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}

window.onload = function randomText() {
    // Array of different texts
    var texts = [
      "Embrace the spirit of Småland!",
      "Also try Göteborg!",
      "The best of the Köpings!",
      "Limited edition!",
      "Made in Sweden!",
      "Wow!",
      "In color!",
      "Now with more ducks!",
      ""
    ];

    // Select the paragraph element
    var paragraph = document.getElementById("dynamic-text");

    // Choose a random text from the array
    var randomIndex = Math.floor(Math.random() * texts.length);
    var newText = texts[randomIndex];

    // Set the text of the paragraph
    paragraph.textContent = newText;
  };