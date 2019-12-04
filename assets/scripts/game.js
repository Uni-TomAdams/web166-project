const gameData = {
    level: 1,
    highestScore: 0,
    currentTimePeriod: "00:00:00",
    currentLevelLightSequence: [],
    currentLevelUsersGuess: [],
    lightColours: ["#48D8C5", "#E7CE16", "#20CE2B", "#7133E9", "#D421FA", "#FF9D09"]
};


/*                                                     Helper Functions */
/*----------------------------------------------------------------------*/


function getRandomInteger() {
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

    return `${URI}${lightID}/`;
}

/*
*   @Params: lightURI - Provides the URI for the specified light
*   @Description: Checks the specified lights status and returns the given
*   state of the light.
* */
function checkLightStatus(lightURI) {

    $.getJSON(lightURI, function(lightData) {

        if(lightData["state"]["on"]) {

            return true
        }

        return false
    })
}

/*
*   @Params: lightID - Provides the ID of the specific light;
*   @Description: Fetches the light state and checks to see if its currently active,
*   and turns it off when active.
* */
function turnLightOff(lightID) {

    // Get light URI
    var lightURI = getLightURI(lightID);

    // Check to see if specified light is currently active and toggle
    if(checkLightStatus(lightURI)) {
        $.ajax({
            url: lightURI,
            type: "PUT",
            data: JSON.stringify({"on": false})
        })
    }
};

/*
*   @Params: lightID - Provides the ID of the specific light;
*   @Description: Fetches the light state and checks to see if its currently active,
*   and turns it on when active.
* */
function turnLightOn(lightID, colour) {

    // Get light URI
    var lightURI = getLightURI(lightID);

    // Check to see if specified light is currently active and toggle
    if(!checkLightStatus(lightURI)) {
        $.ajax({
            url: lightURI,
            type: "PUT",
            hue: colour,
            bri: 254,
            data: JSON.stringify({"on": true})
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


/*                                                       Game Functions */
/*----------------------------------------------------------------------*/


/*
*   @Params: none;
*   @Description: Applies RGB colours to the interactive light buttons and can be changed
*   if the lightsColours object is mutated. This does not update the actual hue lights.
* */
function applyLightColoursToLightButtons() {

    // Iterate over each light button and apply the CSS background colour it corresponds too
    for(var i = 0; i < 6; i++) {

        $(`#mem_Btn_${i + 1}`).css("background-color", `${gameData.lightColours[i]}`);
    }
}

/*
*   @Params: none;
*   @Description: An async function used to update the game status board, that informs
*   the user of the current state of their game level. Two different modes defined.
* */
function updateGameStatusBoard(statusType) {

    var counter = 0;

    // A count-down clock from 3 to 0, being the time given to complete the sequence
    if(statusType == "startLightsCountDown") {

        $("#statusTitle").text("Watch the lights in");
        $("#statusCounter").text("3");

        // Return a promise that resolves after the counter has finished
        return new Promise(resolve => {
            const x = setInterval(function() {
                $("#statusCounter").text(`${3 - counter}`);
                counter++;

                // End interval clock and resolve
                if(counter == 4)  {
                    clearInterval(x);
                    resolve(true);
                }
            }, 1000);
        });
    }

    // A count-down clock from 30 to 0, being the time given to complete the sequence
    if(statusType == "startGuessSequenceCountDown") {

        $("#statusTitle").text("What is the sequence?");
        $("#statusCounter").text("30");

        // Return a promise that resolves after the counter has finished
        return new Promise(resolve => {
            const x = setInterval(function() {
                $("#statusCounter").text(`${30 - counter}`);
                counter++;

                // End interval clock and resolve
                if(counter == 31) {
                    clearInterval(x);
                    resolve(true);
                }
            }, 1000)
        });
    }
}

/*
*   @Params: level - the current level of the users game session;
*   @Description: Generates the current levels light sequence which is randomly
*   generated and stored into the currentLevelLightSequence.
* */
function generateRandomLightSequenceByLevel(level) {

    let counter = 0;

    return new Promise(resolve => {
        const intervalClock = setInterval(function() {
            let randomNumber = getRandomInteger();

            // Turn random light on
            //turnLightOn(randomNumber, gameData.lightColours[randomNumber]);

            // Push light ID into the light sequence array
            gameData.currentLevelLightSequence.push(randomNumber);
            counter++;

            console.log(randomNumber)
            // Break-point
            if(counter == (level + 1)) {
                clearInterval(intervalClock);
                resolve(true);
            }
        }, 3000);
    });
}

/*
*   @Params: level - the current level of the users game session;
*   @Description: The entry-point of the specified level, each level will invoke this
*   function to get the same functionality per level basis.
* */
async function startLevel() {
    await updateGameStatusBoard("startLightsCountDown");
    console.log("Game Status done...");
    await generateRandomLightSequenceByLevel(gameData.level);
    console.log("Light Sequence done...");
}

function startGame() {
    if (turnAllLightsOff) {

    }

}


/*                                                               jQuery */
/*----------------------------------------------------------------------*/


$(document).ready(function()
{
    applyLightColoursToLightButtons();

    // Waits for game start button to be triggered
    $("#startGameBtn").click(function() {

        startLevel(gameData.level);
    });
});

