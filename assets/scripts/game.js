let gameData = {
    level: 1,
    highestScore: 0,
    stopCountDownClock: false,
    isCountDownStillActive: false,
    currentTimePeriod: "00:00:00",
    currentLevelLightSequence: [],
    currentLevelPlayersGuess: [],
    lightColours: ["#48D8C5", "#E7CE16", "#20CE2B", "#7133E9", "#D421FA", "#FF9D09"],
    hueColours: [35531, 10000, 18000, 53000, 59000, 6000],
    gameOverLightColour: 65531,
    levelPassedLightColour: 18000
};

// Yellow 10000
// Green 18000
// Blue 35531
// Purple 53000
// Pink 59000
// Orange 6000

// Red 65531

/*                                                     Helper Functions */
/*----------------------------------------------------------------------*/


/*
*   @Params: none.
*   @Description: Generates a random integer between 1 and 6.
* */
function getRandomInteger() {
    // Get random float and then truncate to number
    const random = Math.trunc(Math.random() * 10);

    if(random > 6) {
        return 6;
    }
    else if(random < 1) {
        return 1;
    }
    else {
        return random;
    }
}

/*                                                      Light Functions */
/*----------------------------------------------------------------------*/


/*
*   @Params: lightID - Provides the ID of the specific light;
*   @Description: Constructs the URL for the interaction of a specified light by ID
* */
function getLightURI(lightID) {
    const IP = "http://192.168.0.50/api/";
    const username = "stlaB2I6VZ8O80Qepc-1xfmLrHgyTFvB9IGupaQz";
    const lights = "/lights/";
    const URI = `${IP}${username}${lights}`;

    return `${URI}${lightID}`;
}

/*
*   @Params: lightURI - Provides the URI for the specified light
*   @Description: Checks the specified lights status and returns the given
*   state of the light.
* */
function checkLightStatus(lightURI) {
    // GET light state
    $.getJSON(lightURI, function(lightData) {
        if(lightData["state"]["on"]) {
            return true
        }

        return false
    });
}

/*
*   @Params: lightID - Provides the ID of the specific light;
*   @Description: Fetches the light state and checks to see if its currently active,
*   and turns it off when active.
* */
function turnLightOff(lightID) {
    // Get light URI
    const lightURI = getLightURI(lightID);

    // Check to see if specified light is currently active and toggle
    if(!checkLightStatus(lightURI)) {
        $.ajax({
            url: lightURI + "/state/",
            type: "PUT",
            data: JSON.stringify({"on": false})
        })
    }
};

/*
*   @Params: lightID - Provides the ID of the specific light.
*            Colour - RGB colour for HUE light.
*   @Description: Fetches the light state and checks to see if its currently active,
*   and turns it on when active.
* */
function turnLightOn(lightID, colour) {
    // Get light URI
    const lightURI = getLightURI(lightID);

    // Check to see if specified light is currently active and toggle
    if(!checkLightStatus(lightURI)) {
        $.ajax({
            url: lightURI + "/state/",
            type: "PUT",
            data: JSON.stringify({"on": true, "hue": colour, "bri": 254})
        })
    }
};

/*
*   @Params: none.
*   @Description: Invokes the turnLightOff function for each hue light
*   and turns the given light off. This function is to turn ALL lights off.
* */
function turnAllLightsOff() {
    for(var i = 0; i < 6; i++) {
        turnLightOff(i + 1);
    }
}

/*
*   @Params: none.
*   @Description: Turns all lights on flashing a red colour for 1s and
*   then switches itself off.
* */
function turnGameOverLightsOn() {
    // Turn lights on
    for(var i = 0; i < 6; i++) {
        turnLightOn(i + 1, gameData.gameOverLightColour);
    }

    // Turn lights off
    setTimeout(() => {
        turnAllLightsOff();
    }, 1000);
}

/*
*   @Params: none.
*   @Description: Turns all lights on flashing a green colour for 1s and
*   then switches itself off.
* */
function turnPassedLevelLightsOn() {
    // Turn lights on
    for(var i = 0; i < 6; i++) {
        turnLightOn(i + 1, gameData.levelPassedLightColour);
    }

    // Turn lights off
    setTimeout(() => {
        turnAllLightsOff();
    }, 1000);
}

/*
*   @Params: level - current level.
*   @Description: Generates the current levels light sequence by getting the current level+1
*   and then randomly generating a light between 1 and 6, which is then stored into a local array.
* */
function generateRandomLightSequenceByLevel(level) {
    let counter = 0;

    return new Promise(resolve => {
        const intervalClock = setInterval(function() {
            // Generate a random number
            let randomNumber = getRandomInteger();

            // Turn random light on
            turnLightOn(randomNumber, gameData.hueColours[randomNumber - 1]);

            // Turn random light off after 1s
            setTimeout(() => {
                turnLightOff(randomNumber);
            }, 1000)

            // Push light ID into the light sequence array
            gameData.currentLevelLightSequence.push(randomNumber);
            counter++;

            console.log(randomNumber);

            // Break-point
            if(counter == (level + 1)) {
                clearInterval(intervalClock);
                resolve(true);
            }
        }, 3000);
    });
}


/*                                                       Game Functions */
/*----------------------------------------------------------------------*/


/*
*   @Params: none;
*   @Description: Applies RGB colours to the interactive light buttons and can be changed
*   if the lightsColours object is mutated. This does not update the actual hue lights via HTTP request.
* */
function applyLightColoursToLightButtons() {
    for(var i = 0; i < 6; i++) {
        $(`#${i + 1}`).css("background-color", `${gameData.lightColours[i]}`);
    }
}

function disableLightButtons(doDisable) {
    for(var i = 0; i < 6; i++) {
        $(`#${i + 1}`).prop('disabled', doDisable);
    }
}

/*
*   @Params: statusType - type of status clock to execute
*   @Description: Updates the status board informing the user of the countdown clocks
*   defined.
*
*   There are two different status types:
*   1) startLightsCountDown - A 3 second countdown clock informing the player to watch the lights.
*   2) startGuessSequenceCountDown - A 30 second countdown clock informing the player how long they
*      have left to answer the current levels sequence correctly, else the game will end.
* */
function updateGameStatusBoard(statusType) {
    let counter = 0;

    // A count-down clock from 3 to 0, being the time given to complete the sequence
    if(statusType == "startLightsCountDown") {
        // Inform player of countdown timer
        $("#statusTitle").text("Watch the lights in");
        $("#statusCounter").text("3");

        // Returns a promise that resolves after the counter has finished
        return new Promise(resolve => {
            // A clock decrementing the countdown p/s
            const x = setInterval(function() {
                $("#statusCounter").text(`${3 - counter}`);
                counter++;

                // Clear interval clock and resolve promise
                if(counter == 4)  {
                    clearInterval(x);
                    resolve(true);
                }
            }, 1000);
        });
    }

    // A count-down clock from 30 to 0, being the time given to complete the sequence
    if(statusType == "startGuessSequenceCountDown") {
        // Inform player of countdown timer
        $("#statusTitle").text("What is the sequence?");
        $("#statusCounter").text("30");

        // Returns a promise that resolves after the counter has finished
        return new Promise(resolve => {
            gameData.isCountDownStillActive = true;

            // A clock decrementing the countdown p/s
            const x = setInterval(function() {
                $("#statusCounter").text(`${30 - counter}`);
                counter++;

                // Clear interval clock and resolve promise
                if(counter == 31 || gameData.stopCountDownClock) {
                    clearInterval(x);
                    resolve(true);
                }
            }, 1000)
        });
    }
}

/*
*   @Params: level - current level.
*   @Description: Hooks an event handler onto the light buttons. The handler function will invoke
*   each time a light button is triggered, which will then proceed to check the users guesses so far
*   against the generated sequence.
* */
function lightButtonEventHandler(id) {
    $(`#${id}`).click(() => {
        // Check to see if the count down clock is active
        if(!gameData.isCountDownStillActive) return endGame();

        // Append players guess to array
        gameData.currentLevelPlayersGuess.push(id);

        // Compares generated light sequence against the players light sequence guess
        for(var i = 0; i < gameData.currentLevelPlayersGuess.length; i++) {
            if(gameData.currentLevelLightSequence[i] != gameData.currentLevelPlayersGuess[i]) {
                gameData.stopCountDownClock = true;
                return endGame();
            }
        }

        // Checks to see if the generated sequence size is the same size as number of player guesses
        if(gameData.currentLevelLightSequence.length != gameData.currentLevelPlayersGuess.length) return;

        // Start next level...
        gameData.stopCountDownClock = true;
        levelPassed();
    });
}

/*
*   @Params: none.
*   @Description: Informs the player that they've passed their current level and
*   resets specific settings back to default for the next level, and also invokes the next level.
* */
function levelPassed() {
    setTimeout(() => {
        // Inform player of level passed
        $("#statusTitle").text("Correct!");
        $("#statusCounter").text("Next Level...");
        $("#currentLevel").text(gameData.level + 1);

        turnPassedLevelLightsOn();

        // Reset data
        gameData = {
            ...gameData,
            level: gameData.level + 1,
            stopCountDownClock: false,
            currentLevelPlayersGuess: [],
            currentLevelLightSequence: [],
            isCountDownStillActive: false,
        };

        setTimeout(function() {
            startLevel(gameData.level);
        }, 3000);
    }, 1000);
}

/*
*   @Params: none.
*   @Description: Informs the player that they haven't passed their current level and resets
*   all settings back to default, ready for a new game session.
* */
function endGame() {
    setTimeout(() => {
        // Inform player of game end
        $("#statusTitle").text("Incorrect!");
        $("#statusCounter").text("GAME OVER");
        turnGameOverLightsOn();

        // Update highest level and display
        if(gameData.level > gameData.highestScore) {
            gameData.highestScore = gameData.level;

            $("#currentHighestScore").text(`${gameData.highestScore}`);
        }

        // Reset data
        gameData = {
            ...gameData,
            level: 1,
            stopCountDownClock: false,
            currentLevelPlayersGuess: [],
            currentLevelLightSequence: [],
            isCountDownStillActive: false,
        };

        console.log(gameData)
    }, 1000);
}

/*
*   @Params: level - current level.
*   @Description: The entry-point of the specified level, each level will invoke this
*   function to get the same functionality per level.
* */
async function startLevel(level) {
    disableLightButtons(true);
    console.log("Disabling light buttons...");
    await updateGameStatusBoard("startLightsCountDown");
    console.log("Start light countdown done...");
    await generateRandomLightSequenceByLevel(level);
    console.log("Light sequence done...");
    disableLightButtons(false);
    console.log("Enabling light buttons...");
    await updateGameStatusBoard("startGuessSequenceCountDown");
    console.log("Start guess sequence countdown done...");
}


/*                                                               jQuery */
/*----------------------------------------------------------------------*/


$(document).ready(function() {

    // Add light colours to buttons
    applyLightColoursToLightButtons();

    // Attach click event handlers to light buttons
    for(var i = 0; i < 6; i++) {
        lightButtonEventHandler(i + 1);
    }

    // Hooks an onclick handler onto the 'Start Game' button
    $("#startGameBtn").click(function() {

        // Ensure all lights are switched off
        turnAllLightsOff();

        // Start level
        startLevel(gameData.level);
    });
});

