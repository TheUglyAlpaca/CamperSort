let sheetData = null;
let sortMode = null;


backgrounds = [
    'url("https://theuglyalpaca.github.io/CamperSort/photo1.jpg")',
     'url("https://theuglyalpaca.github.io/CamperSort/photo2.jpg")',
]

function randomizeBackground() {
    selectedImage = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    document.body.style.background = selectedImage;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
}

// fetch data from google sheet
fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSJCkQKlmRxz6qgU4o4tbHkwx9qPEYECdslflOytiguegF2IGnxvDHrD-Qqtuy6bewspfMbYS-p1ntf/pub?output=tsv")
    .then(res => res.text()).then(csv => {
        // csv parsing lets fucking GOOO
        sheetData = csv.replace(/"|\r/g, "") // remove quotation marks and whatever \r is
            .split("\n") // split at each line
            .map(x => x.split("\t")) // split each line at each tab (its actually tsv not csv lmao)
        console.table(sheetData);

        function getColumn(table, column) {
            return table.map(x => x[column]);
        }

        //Camper Names
        let names = getColumn(sheetData, 0).slice(1); //cuts off first index of names array (header text)
        names.sort();

        //Camper Units (Rookie or Post)
        let units = getColumn(sheetData, 2).slice(1);

        let rookies = [];
        let posts = [];

        for (let i = 0; i < names.length; i++) {
            if (units[i] == ("Rookie")) {
                rookies.push(names[i]);
            }
            else {
                posts.push(names[i]);
            }
        }

        //Camper Units (Male or Female)
        let genders = getColumn(sheetData, 3).slice(1);

        let males = [];
        let females = [];

        for (let i = 0; i < names.length; i++) {
            if (genders[i] == ("male")) {
                males.push(names[i]);
            }
            else {
                females.push(names[i]);
            }
        }

        //Checked For Sorting
        let checkedSort = names;

        function addNames(data) {
            const camperList = $("#camperlist");
            data.forEach(camper => {
                let camperString = `<div class="camper"><label class="switch" id="activateButton"><input checked class="camperCheck" type="checkbox" camper="${camper}"><span class="slider round"></span></label><p>${camper}</p></div>`
                camperList.append(camperString);
            })
            console.log(checkedSort);
        }

        addNames(names);

        document.getElementById("otherSorts").style.visibility = 'hidden';

        //clicking name also toggles checkbox
        $(".camper p").click(function () {
            $(this).parent().find("input").trigger("click")
            camperName = $(this).text();
        })

        $(".camperCheck").on("input", updateNameCounts);

        function updateNameCounts() {
            //displays number of unchecked campers
            let totalUnselected = $(".camperCheck:not(:checked)");
            $("#totalUnselected").text(totalUnselected.length)

            //displays number of unchecked campers as a ratio
            $("#ratio").text(`${names.length - totalUnselected.length}/${names.length}`)
        }

        $(".sortBtn").click(function () {
            $(".sortBtn").removeClass("selectedSort");
            $(this).addClass("selectedSort");

            sortMode = $(this).attr("sortMode");
        })

        //CLICK BUTTON
        $("#createGroupsButton").click(function () {

            let numGroups = +$("#quantity").val()
            let programName = $("#name").val()

            document.getElementById("sortedCampers").style.display = "flex";

            //checks for empty values
            if (!numGroups) return alert("Please select the number of groups to sort.")
            if (numGroups > 20) return alert("Please select a number between 2 and 20")
            else if (!sortMode) return alert("Please select the sorting method.")

            //returns an array of all selected campers (camper attribute for selected campers)
            let checkedCampers = [];
            $(".camperCheck:checked").each(function () {
                return checkedCampers.push($(this).attr("camper"))
            })

            //Sorting rookies and posts into two different arrays
            let checkedRookies = [];
            let checkedPosts = [];

            for (let i = 0; i < rookies.length; i++) {
                for (let j = 0; j < checkedCampers.length; j++) {
                    if (rookies[i] == checkedCampers[j]) {
                        checkedRookies.push(rookies[i])
                    }
                }
            }

            for (let i = 0; i < posts.length; i++) {
                for (let j = 0; j < checkedCampers.length; j++) {
                    if (posts[i] == checkedCampers[j]) {
                        checkedPosts.push(posts[i])
                    }
                }
            }

            //Sorting males and females into two different arrays
            let checkedMales = [];
            let checkedFemales = [];

            for (let i = 0; i < males.length; i++) {
                for (let j = 0; j < checkedCampers.length; j++) {
                    if (males[i] == checkedCampers[j]) {
                        checkedMales.push(males[i])
                    }
                }
            }

            for (let i = 0; i < females.length; i++) {
                for (let j = 0; j < checkedCampers.length; j++) {
                    if (females[i] == checkedCampers[j]) {
                        checkedFemales.push(females[i])
                    }
                }
            }

            //Generic 
            let genericScore = getColumn(sheetData, 4).slice(1);

            bestToWorst = [];
            temporarySort = [];

            //sorts highest to lowest
            for (let i = 10; i > 0; i--) {
                for (let j = 0; j < genericScore.length; j++) {
                    if (genericScore[j] == i) {
                        temporarySort.push(names[j]);

                    }
                }
                randomize(temporarySort);
                temporarySort.forEach(camper => {
                    bestToWorst.push(camper)
                })
                temporarySort = []
            }

            checkedGeneric = [];

            for (let i = 0; i < bestToWorst.length; i++) {
                for (let j = 0; j < checkedCampers.length; j++) {
                    if (bestToWorst[i] == checkedCampers[j]) {
                        checkedGeneric.push(bestToWorst[i])
                    }
                }
            }

            //SORTS BASED ON SELECTED SORT METHOD
            switch (sortMode) {
                case "trueRandom":
                    trueRandom(numGroups, checkedCampers, programName);
                    break;

                case "evenRookiePostSort":
                    evenRookiePostSort(numGroups, checkedRookies, checkedPosts, programName);
                    break;

                case "evenGendersSort":
                    evenGendersSort(numGroups, checkedMales, checkedFemales, programName);
                    break;

                case "genericSort": //wip
                    genericSort(numGroups, checkedGeneric, programName);
                    break;
            }
        })

        randomizeBackground();
        updateNameCounts();

    })
