const gameData = {
    level: 1,
    highestScore: 0,
    currentTimePeriod: "00:00:00",
    currentLevelLightSequence: [],
    currentLevelUsersGuess: [],
    lightColours: ["#48D8C5", "#E7CE16", "#20CE2B", "#7133E9", "#D421FA", "#FF9D09"]
};


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
function turnLightOn(lightID) {

    // Get light URI
    var lightURI = getLightURI(lightID);

    // Check to see if specified light is currently active and toggle
    if(!checkLightStatus(lightURI)) {
        $.ajax({
            url: lightURI,
            type: "PUT",
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

function updateGameStatusBoard(statusType) {

    var counter = 0;

    if(statusType == "startLightsCounter") {

        $("#statusTitle").text("Watch the lights in");
        $("#statusCounter").text("3");

        var x = setInterval(function() {
            $("#statusCounter").text(`${3 - counter}`);
            counter++;

            if(counter == 4)  {
                clearInterval(x);
                counter = 0;
            }
        }, 1000)
    }
    else if(statusType == "startGuessSequenceCountDown") {

        $("#statusTitle").text("What is the sequence?");
        $("#statusCounter").text("30");

        var x = setInterval(function() {
            $("#statusCounter").text(`${30 - counter}`);
            counter++

            if(counter == 31) {
                clearInterval(x);
                counter = 0;
            }
        }, 1000)
    }
    else {
        console.log("[ERROR] - Invalid statusType in status board");
    }
}

function startLevel(level) {

    // Start status board
    updateGameStatusBoard("startLightsCounter");

}

function startGame() {
    turnAllLightsOff();
}


/*                                                               jQuery */
/*----------------------------------------------------------------------*/


$(document).ready(function()
{
    applyLightColoursToLightButtons();

    // Waits for game state button to be triggered
    $("#startGameBtn").click(function() {

        //startGame();
        startLevel();
    });
});

