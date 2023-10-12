document.addEventListener("DOMContentLoaded", function() {
    let loginBtn = document.getElementById("loginBtn");
    let loginUser = document.getElementById("loginUser");
    let loginPopup = document.getElementById("loginPopup");
    let closeBtn = loginPopup.querySelector(".close-btn");
    let loginForm = document.getElementById("login-form");
    let loginSubmit = document.getElementById("loginSubmit");
    let welcomePage = document.querySelector(".welcomePage");
    let playground = document.querySelector(".playground");

    // Function to handle the logout
    function logout() {
        loginBtn.textContent = "Login"; // Set the button text back to "Login"
        loginUser.style.display = "none"; // Hide the user info
        loginUser.textContent = ""; // Clear user info
        loginUser.removeAttribute("email"); // Remove email attribute

        // Animate the welcomePage appearing and playground disappearing
        welcomePage.style.display = "block";
        welcomePage.style.transform = "scale(1)";
        welcomePage.style.opacity = "1";

        playground.style.opacity = "0";
        playground.style.transform = "translateY(100%)";

    setTimeout(() => {
      playground.style.display = "none";
    }, 1000); // Adjust the delay as needed
  }


    // Show the login form when login button is clicked
loginBtn.addEventListener("click", function () {
  if (loginBtn.textContent === "Login") {
    loginPopup.style.display = "block";
  } else {
    // If the button text is "Logout," perform logout
    logout();
  }
});


    // Close the login form when close button is clicked
    closeBtn.addEventListener("click", function() {
        loginPopup.style.display = "none";
    });

    // Handle the form submission
    loginSubmit.addEventListener("click", function(event) {
        event.preventDefault();  // Prevent the form from submitting the traditional way

        let emailInput = document.getElementById("email");
        let passwordInput = document.getElementById("password");

        let email = emailInput.value;
        let password = passwordInput.value;

        // Call the Google Apps Script endpoint
        fetch('https://script.google.com/macros/s/AKfycbxhaPnMJbT9tQqWbiTp8-42ROYUMPw2H30HPQGQON7nHkZCaqwoKUPFMVoUwC8huyCrYw/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `action=authenticate&email=${email}&password=${password}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update the login button text with the user's name
                loginBtn.textContent = "Logout";
                loginUser.style.display ="block"
                loginUser.textContent = data.userName;
                loginUser.setAttribute('email', email);
                loginPopup.style.display = "none";  // Close the login form
                
                // Animate the welcomePage shrinking and playground appearing
                welcomePage.style.transform = "scale(0)";
                welcomePage.style.opacity = "0";
                    setTimeout(() => {
                welcomePage.style.display = "none";
                playground.style.display = "flex";
                    setTimeout(() => {
                playground.style.opacity = "1";
                playground.style.transform = "translateY(0)";
                    }, 140);
                }, 2000); 
            } else {
                alert(data.message);  // Alert the user if authentication failed
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error occurred while logging in.');
        });
    });
});


document.addEventListener("DOMContentLoaded", function() {
    let quizContainers = document.querySelectorAll('.quizContainer');
    
    quizContainers.forEach(container => {
        let clickCount = 0;
        let clickTimer;

        container.addEventListener('click', () => {
            clickCount++;

            if (clickCount === 1) {
                // Start a timer. If no subsequent click occurs within 300ms, this is a single click.
                clickTimer = setTimeout(() => {
                    let currentlyActive = document.querySelector('.active');

                    if (currentlyActive && currentlyActive !== container) {
                        currentlyActive.classList.remove('active');
                    }

                    container.classList.add('active'); // Enlarge the container on single click
                    clickCount = 0; // Reset the counter after handling the click
                }, 300);
            } else if (clickCount === 2) {
                clearTimeout(clickTimer); // Clear the timer, as this is a double click
                container.classList.remove('active'); // Shrink the container on double click
                clickCount = 0; // Reset the counter after handling the click
            }
        });
    });
   //TO SHOW QUESTION
// ... Other code ...
let startButtons = document.querySelectorAll('.startButton');
startButtons.forEach(button => {
    button.addEventListener('click', function() {
        let container = button.closest('.quizContainer');
        let quizContent = container.querySelector('.quizContent');
        let scoreElem = container.querySelector('.score');
        
        // Reset the question index
        container.setAttribute('data-question-index', '0');

        // Reset the score
        scoreElem.textContent = `SCORE: 0`;
        
        // Hide the askSaveButton
        container.querySelector('.askSaveButton').style.display = "none";

        // Load the first question
        loadQuestion(container);
        quizContent.style.display = 'block';
    });
});


let submitButtons = document.querySelectorAll('.submitAnswer');
submitButtons.forEach(button => {
    button.addEventListener('click', function() {
        let container = button.closest('.quizContainer');
        let input = container.querySelector('.answer');
        let correctAnswer = container.getAttribute('data-correct-answer');

        if(input.value.trim() === correctAnswer) {
            let scoreElem = container.querySelector('.score');
            let currentScore = parseInt(scoreElem.textContent.split(": ")[1]);
            scoreElem.textContent = `SCORE: ${currentScore + 5}`;
        }

        // Increase the question index to load the next question
        let currentIndex = parseInt(container.getAttribute('data-question-index'));
        container.setAttribute('data-question-index', currentIndex + 1);
        
        // Load the next question
        loadQuestion(container);

        input.value = '';  // Clear the input field
    });
});



function loadQuestion(container) {
    const containerValue = container.getAttribute('value');
    const loadfile = `${containerValue}.JSON`;
    
    fetch(loadfile)
    .then(response => response.json())
    .then(data => {
        let questionIndex = parseInt(container.getAttribute('data-question-index'));
        
        // If we've answered all questions, you can hide the container or inform the user
        if(questionIndex >= data.length) {
    container.querySelector('.quizContent').style.display = 'none';
    container.querySelector('.askSaveButton').style.display = "block";
    // Reset the question index for next time
    container.setAttribute('data-question-index', '0');
    return;
}


        let questionData = data[questionIndex];
        
        let questionNum = container.querySelector('.questionNum');
        let questionContent = container.querySelector('.questionContent');

        questionNum.textContent = "Question " + questionData[0] + ":";
        questionContent.textContent = questionData[1];
        
        container.setAttribute('data-correct-answer', questionData[2]);
    });
}

let saveForm = document.getElementById("saveForm");

function saveToGoogleSheet() {
     let saveForm = document.getElementById("saveForm");
    
    let userName = saveForm.querySelector(".userName").textContent;
    let userEmail = saveForm.querySelector(".userEmail").textContent;
    let testName = saveForm.querySelector(".testName").textContent;
    let testScore = saveForm.querySelector(".testScore").textContent;

    let formData = new FormData();
    formData.append('action', 'saveScore');
    formData.append('userName', userName);
    formData.append('userEmail', userEmail);
    formData.append('testName', testName);
    formData.append('testScore', testScore);
  
    fetch('https://script.google.com/macros/s/AKfycbwg7OnvoE4VmR6OUqEahHMbcZxT_TpAt6ki4FnHSgZZGR3iTqAX2ZikopcbnfCUKRCg_g/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `action=saveScore&userName=${userName}&userEmail=${userEmail}&testName=${testName}&testScore=${testScore}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Score saved successfully!');
        } else {
            alert('Error saving score.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error occurred while saving the score.');
    });
}

});

function updateSaveForm(container) {
    let userNameElem = saveForm.querySelector(".userName");
    let userEmailElem = saveForm.querySelector(".userEmail");
    let testNameElem = saveForm.querySelector(".testName");
    let testScoreElem = saveForm.querySelector(".testScore");

    let loginUser = document.getElementById("loginUser");
    let testName = container.querySelector("h1").textContent;
    let scoreElem = container.querySelector('.score');
    let currentScore = scoreElem.textContent.split(": ")[1];

    userNameElem.textContent = loginUser.textContent;
    userEmailElem.textContent = loginUser.getAttribute('email');
    testNameElem.textContent = testName;
    testScoreElem.textContent = currentScore;
}

let askSaveButtons = document.querySelectorAll('.askSaveButton');
askSaveButtons.forEach(button => {
    button.addEventListener('click', function() {
        let container = button.closest('.quizContainer');
        
        // Populate the saveForm
        let userName = document.getElementById("loginUser").textContent;
        let userEmail = document.getElementById("loginUser").getAttribute('email');
        let testName = container.querySelector('h1').textContent;
        let testScore = container.querySelector('.score').textContent.split(": ")[1];

        let saveForm = document.getElementById("saveForm");
        saveForm.querySelector(".userName").textContent = userName;
        saveForm.querySelector(".userEmail").textContent = userEmail;
        saveForm.querySelector(".testName").textContent = testName;
        saveForm.querySelector(".testScore").textContent = testScore;

        // Now, save the data to Google Sheet
        saveToGoogleSheet();

        // Once saved, hide the button
        button.style.display = "none";
    });
});


function saveToGoogleSheet() {
     let saveForm = document.getElementById("saveForm");
    
    let userName = saveForm.querySelector(".userName").textContent;
    let userEmail = saveForm.querySelector(".userEmail").textContent;
    let testName = saveForm.querySelector(".testName").textContent;
    let testScore = saveForm.querySelector(".testScore").textContent;

    let formData = new FormData();
    formData.append('action', 'saveScore');
    formData.append('userName', userName);
    formData.append('userEmail', userEmail);
    formData.append('testName', testName);
    formData.append('testScore', testScore);
  
    fetch('https://script.google.com/macros/s/AKfycbwg7OnvoE4VmR6OUqEahHMbcZxT_TpAt6ki4FnHSgZZGR3iTqAX2ZikopcbnfCUKRCg_g/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `action=saveScore&userName=${userName}&userEmail=${userEmail}&testName=${testName}&testScore=${testScore}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Score saved successfully!');
        } else {
            alert('Error saving score.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error occurred while saving the score.');
    });
}
 