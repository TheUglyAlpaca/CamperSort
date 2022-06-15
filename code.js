let keys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    65: "a",
    66: "b"
}

let code = ["up", "down", "up", "down", "left", "right", "left", "right", "a", "b"]

document.addEventListener("keydown", checkCode, false);

keyCount = 0;

let timerID;

function checkCode(event) {
    let keyPressed = keys[event.keyCode]

    if (keyPressed === code[keyCount]) {
        keyCount++;

        //clears timer
        window.clearTimeout(timerID);

        //makes a new timer 1 second long
        timerID = window.setTimeout(resetKeyState,1000)

        if (keyCount === code.length) {
            codeSuccess();
            resetKeyState();
        }
    } else {
        resetKeyState();
    }
}

function resetKeyState() {
    keyCount = 0;
    window.clearTimeout(timerID);
}

function codeSuccess() {
    hiddenDiv = document.getElementById("otherSorts")
    hiddenDiv.style.visibility = "visible";
}


//wip
function genericSort(numberOfGroups, highToLow, programName) {
    let arr = [];
    for (var i = 1; i <= numberOfGroups; i++) {
        arr[i] = []
    }

    let forwards = true;

    for (let i = 0; i < highToLow.length; i++) {
        if ((i % numberOfGroups == 0) && (i > 0)) {
            forwards = !forwards;
        }
        for (let j = 0; j < numberOfGroups; j++) {

            if (i % numberOfGroups == j) {
                if (forwards) {
                    arr[j + 1].push(highToLow[i]);
                } else {
                    arr[numberOfGroups - j].push(highToLow[i]);
                }
            }
        }
    }

    arr.forEach(camper => {
        camper.sort();
    })

    generateDocument(arr, numberOfGroups, programName)
}