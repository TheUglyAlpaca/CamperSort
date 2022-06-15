//Randomizer algorithm
function randomize(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

//Randomly sorts campers into groups.
function trueRandom(numberOfGroups, selectedCampersArray, programName) {
    randomize(selectedCampersArray);

    let arr = [];
    for (var i = 1; i <= numberOfGroups; i++) {
        arr[i] = [];
    }

    //sorts campers into seperate groups
    for (let i = 0; i < selectedCampersArray.length; i++) {
        for (let j = 0; j < numberOfGroups; j++) {
            if (i % numberOfGroups == j) {
                arr[j + 1].push(selectedCampersArray[i]);
                arr[j + 1].sort();
            }
        }
    }

    createGroupsOnScreen(numberOfGroups, arr);

    $("#downloadButton").unbind().click(function () {
        generateDocument(arr, numberOfGroups, programName)
    });
}

//Sorts campers into groups so that Rookies and Posts are evenly distributed.
function evenRookiePostSort(numberOfGroups, rookies, posts, programName) {
    randomize(rookies);
    randomize(posts);

    let arr = [];
    for (var i = 1; i <= numberOfGroups; i++) {
        arr[i] = [];
    }

    //sorts rookies into seperate groups
    for (let i = 0; i < rookies.length; i++) {
        for (let j = 0; j < numberOfGroups; j++) {
            if (i % numberOfGroups == j) {
                arr[j + 1].push(rookies[i]);
                arr[j + 1].sort();
            }
        }
    }

    //sorts posts into seperate groups
    for (let i = 0; i < posts.length; i++) {
        for (let j = 0; j < numberOfGroups; j++) {
            if (i % numberOfGroups == j) {
                arr[j + 1].push(posts[i]);
                arr[j + 1].sort();
            }
        }
    }

    createGroupsOnScreen(numberOfGroups, arr);

    $("#downloadButton").unbind().click(function () {
        generateDocument(arr, numberOfGroups, programName)
    });
}

//Sorts campers into groups so that genders are evenly distributed.
function evenGendersSort(numberOfGroups, males, females, programName) {
    randomize(males);
    randomize(females);

    let arr = [];
    for (var i = 1; i <= numberOfGroups; i++) {
        arr[i] = [];
    }

    //sorts males into seperate groups
    for (let i = 0; i < males.length; i++) {
        for (let j = 0; j < numberOfGroups; j++) {
            if (i % numberOfGroups == j) {
                arr[j + 1].push(males[i]);
                arr[j + 1].sort();
            }
        }
    }

    //sorts females into seperate groups
    for (let i = 0; i < females.length; i++) {
        for (let j = 0; j < numberOfGroups; j++) {
            if (i % numberOfGroups == j) {
                arr[j + 1].push(females[i]);
                arr[j + 1].sort();
            }
        }
    }

    createGroupsOnScreen(numberOfGroups, arr);

    $("#downloadButton").unbind().click(function () {
        generateDocument(arr, numberOfGroups, programName)
    });
}

//Organizes sorted groups into a formatted word document for download
function generateDocument(campers, numberOfGroups, programName) {

    console.table(campers)
    let groups = [numberOfGroups];
    let staffNames = [numberOfGroups];

    for (let i = 0; i < numberOfGroups; i++) {
        staffNames[i] = (
            new docx.Paragraph({
                text: "Staff Leaders: ",
                spacing: {
                    after: 100,
                    before: 100,
                },
                heading: docx.HeadingLevel.HEADING_3,
            })
        )

        let thing = campers[i + 1].join(", ")

        groups[i] = (
            new docx.Table({
                rows: [
                    new docx.TableRow({
                        cantSplit: true,
                        children: [
                            new docx.TableCell({
                                children: [
                                    new docx.Paragraph({
                                        children: [new docx.TextRun(thing),],
                                    }),
                                ]
                            }),
                        ],
                        width: {
                            size: [1],
                            type: "pct",
                        },
                    }),
                ],
            }))
    }

    let doc = new docx.Document({
        styles: {
            paragraphStyles: [
                {
                    id: "TitleStyle",
                    basedOn: "Normal",
                    run: {
                        bold: true,
                        size: 28,
                        font: "Arial",
                    },
                },
                {
                    id: "staffName",
                    basedOn: "Normal",
                    run: {
                        bold: true,
                        size: 25,
                        font: "Arial",
                    },
                }]
        },

        sections: [
            {
                children: [
                    new docx.Paragraph({
                        text: programName,
                        style: "TitleStyle",
                        heading: docx.HeadingLevel.TITLE,
                        alignment: docx.AlignmentType.CENTER,

                    }),

                    staffNames[0],
                    groups[0],
                    staffNames[1],
                    groups[1],
                    staffNames[2],
                    groups[2],
                    staffNames[3],
                    groups[3],
                    staffNames[4],
                    groups[4],
                    staffNames[5],
                    groups[5],
                    staffNames[6],
                    groups[6],
                    staffNames[7],
                    groups[7],
                    staffNames[8],
                    groups[8],
                    staffNames[9],
                    groups[9],
                    staffNames[10],
                    groups[10],
                    staffNames[11],
                    groups[11],
                    staffNames[12],
                    groups[12],
                    staffNames[13],
                    groups[13],
                    staffNames[14],
                    groups[14],
                    staffNames[15],
                    groups[15],
                    staffNames[16],
                    groups[16],
                    staffNames[17],
                    groups[17],
                    staffNames[18],
                    groups[18],
                    staffNames[19],
                    groups[19],

                ],
            },
        ],
    });

    docx.Packer.toBlob(doc).then(blob => {
        saveAs(blob, programName + " Sorted.docx");
        console.log("Document created successfully");
    });
}

//generic sort
function genericSort(numberOfGroups, highToLow, programName) {
    let arr = [];
    for (var i = 1; i <= numberOfGroups; i++) {
        arr[i] = [];
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
    });

	createGroupsOnScreen(numberOfGroups, arr);

    $("#downloadButton").unbind().click(function () {
        generateDocument(arr, numberOfGroups, programName)
    });
}

let once = false;

function createGroupsOnScreen(numberOfGroups, arrayOfCampers) {
    $("#sortedCampers").empty();
    $("#createGroupsButton").empty();
    $("#createGroupsButton").append(`Reshuffle! <i class="fa-solid fa-dice"></i> `);

    if (!once) {
        $("#importantButtons").append(`<button id="downloadButton">Download <i class="fa-solid fa-file-arrow-down"></i></button>`);
    }


    for (let i = 0; i < numberOfGroups; i++) {
        let camperGroup = arrayOfCampers[i + 1].join(", ")
        $("#sortedCampers").append(`<div id=\"camperSquare\"><p>${camperGroup}</p></div>`);
    }

    once = true;
}