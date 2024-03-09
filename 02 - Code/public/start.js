document.addEventListener('DOMContentLoaded', () => {  
  fetch('/api/user-logged-in')
    .then(response => response.json())
    .then(data => {
        isLoggedIn = data.message === "User is logged in";

        if (isLoggedIn) {

            const gridContainer = document.querySelector('.grid-container');

            const logoutButton = document.createElement('button');
            logoutButton.textContent = 'Log out';
            const logoutGridItem = document.createElement('div');
            logoutGridItem.classList.add('grid-item');
            logoutGridItem.appendChild(logoutButton);
            gridContainer.appendChild(logoutGridItem);
            logoutButton.addEventListener('click', logout); // Keine () hier
        } else {
    
            const gridContainer = document.querySelector('.grid-container');
        
            // Textbox für E-Mails erstellen und hinzufügen
            const emailInput = document.createElement('input');
            emailInput.setAttribute('type', 'email');
            emailInput.setAttribute('placeholder', 'Email');
            const emailGridItem = document.createElement('div');
            emailGridItem.classList.add('grid-item');
            emailGridItem.appendChild(emailInput);
            gridContainer.appendChild(emailGridItem);

            // Textbox für Passwörter erstellen und hinzufügen
            const passwordInput = document.createElement('input');
            passwordInput.setAttribute('type', 'password');
            passwordInput.setAttribute('placeholder', 'Password');
            const passwordGridItem = document.createElement('div');
            passwordGridItem.classList.add('grid-item');
            passwordGridItem.appendChild(passwordInput);
            gridContainer.appendChild(passwordGridItem);

            // Login-Knopf erstellen und hinzufügen
            const loginButton = document.createElement('button');
            loginButton.textContent = 'Log in';
            const loginGridItem = document.createElement('div');
            loginGridItem.classList.add('grid-item');
            loginGridItem.appendChild(loginButton);
            gridContainer.appendChild(loginGridItem);
            loginButton.addEventListener('click', login);

            // Register-Knopf erstellen und hinzufügen
            const registerButton = document.createElement('button');
            registerButton.textContent = 'Register';
            const registerGridItem = document.createElement('div');
            registerGridItem.classList.add('grid-item');
            registerGridItem.appendChild(registerButton);
            gridContainer.appendChild(registerGridItem);
            registerButton.addEventListener('click', register);

            // Textelement für user feedback (login) erstellen und hinzufügen
            const textElement = document.createElement('p');
            textElement.textContent = '';
            const textGridItem = document.createElement('div');
            textGridItem.classList.add('grid-item');
            textGridItem.appendChild(textElement);
            gridContainer.appendChild(textGridItem);
        }
    })
    .catch(error => console.error('Fehler beim Überprüfen des Benutzerlogins:', error));
});

function login() {
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  
  if (emailInput.value === '' || passwordInput.value === '') {
      displayErrorMessage('Email and password must be filled.');
      return;
  }
  
  const email = emailInput.value;
  const password = passwordInput.value;
  
  fetch('/api/login?email=' + email + '&password=' + password)
      .then(response => response.json())
      .then(data => {
          if (data.status === "Success") {
              // Bei erfolgreicher Anmeldung neu laden
              location.reload();
          } else {
              // Bei fehlgeschlagener Anmeldung Fehler anzeigen
              if (data === false) {
                  displayErrorMessage('Password not correct. Please try again.');
              } else {
                  console.log(data);
                  displayErrorMessage(data);
              }
          }
      })
      .catch(error => {
          displayErrorMessage('Email not registered. Please register first.');
      });
}

function displayErrorMessage(message) {
  const textElement = document.querySelector('.grid-item p');
  textElement.textContent = message;
}

function register() {
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  
  if (emailInput.value === '' || passwordInput.value === '') {
      displayErrorMessage('Email and password must be filled.');
      return;
  }
  
  const email = emailInput.value;
  const password = passwordInput.value;
  
  fetch('/api/register?email=' + email + '&password=' + password)
      .then(response => response.json())
      .then(data => {
          if (data.status === "Success") {
              // Do something after successful registration
              location.reload();
          } else {
              // Do something after failed registration
              const textElement = document.querySelector('.grid-item p');
              textElement.textContent = data.message;
          }
      })
      .catch(error => console.error('Error registering:', error));
}

function logout() {
  fetch('/api/logout')
      .then(response => response.json())
      .then(data => {
          if (data.message === "User logged out") {
              location.reload();
          } else {
              console.log(data.message);
          }
      })
      .catch(error => console.error('Error logging out:', error));
}

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
      "Vättern dass!",
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