
// ---------------------------------------------------------------------------------------------------------------------------------------------


//helping functions
function loading(element, size = "lg") {
    element.innerHTML = `<i class="fa-solid fa-spinner fa-spin fa-${size}"></i>`;
}

function clear(element) {
    element.innerHTML = ""
}

function createBtn(text, aclass) {
    let btn = document.createElement("button");
    btn.innerText = text;
    btn.classList.add("btn", aclass);
    return btn
}



// ---------------------------------------------------------------------------------------------------------------------------------------------



//get data from api
async function getData(url) {
    try {
        let res = await fetch(`${url}`);
        let data = await res.json();

        return data
    } catch (error) {
        console.log(error);
        clear(pSpinner);
        pError.innerHTML = `Something went wrong. Please try again.`
    }
}



//create new instance depending on user choice
async function createInstance(value) {
    let test = characters.filter(e => e.img === Number(value))
    if (test.length > 0) {
        return test[0]
    }

    let person = await getData(`https://swapi.dev/api/people/${value}`);

    let { name, height, mass, hair_color, skin_color, eye_color, gender, films, homeworld, vehicles, starships } = person

    let newPerson = new Character(name, height, mass, hair_color, skin_color, eye_color, gender, films, value, homeworld, vehicles, starships)
    characters.push(newPerson)
    return newPerson
}



// ---------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------


//get info button
getDataBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    compareDiv.classList.add("hidden");

    if (Number(list1.value) === 0 || Number(list2.value) === 0) {
        pError.innerText = "Choose two characters";
    } else {
        clear(pError)
        loading(pSpinner, "2xl")


        // compareDiv.innerText = "";
        let firstCharacter = await createInstance(Number(list1.value));
        let secondCharacter = await createInstance(Number(list2.value));
        clear(pSpinner)
        clear(charactersDiv)

        let sectionOne = displayData(firstCharacter);

        let sectionTwo = document.createElement("section");
        sectionTwo.classList.add("textSection")
        let compareBtn = createBtn("Compare characters", "compareBtn")

        sectionTwo.append(compareBtn)
        charactersDiv.append(sectionTwo)

        let sectionThree = displayData(secondCharacter);

        compareBtn.addEventListener("click", () => {
            sectionTwo.append(compareDiv)
            clear(compareDiv)
            clear(buttonWrapper)
            compareDiv.classList.remove("hidden");

            // compareBtn.disabled = true;
            if (firstCharacter.name === secondCharacter.name) {
                let p = document.createElement("p");
                p.innerHTML = `Same character or evil twin? Who knows?`;
                compareDiv.append(p);
            } else {
                firstCharacter.compareHeight(secondCharacter);
                firstCharacter.compareMass(secondCharacter);
                firstCharacter.compareFilms(secondCharacter);
                firstCharacter.compareGender(secondCharacter);
                firstCharacter.compareHairAndSkin(secondCharacter);
            }

            sectionTwo.insertBefore(buttonWrapper, compareDiv);
            let commonFilmsBtn = createBtn("Same movies", "smallBtn")
            let planetBtn = createBtn("Planets", "smallBtn")

            planetBtn.addEventListener("click", () => {
                firstCharacter.planets(secondCharacter)
            })

            commonFilmsBtn.addEventListener("click", () => {
                firstCharacter.movies(secondCharacter);
            })

            buttonWrapper.append(commonFilmsBtn, planetBtn);

            addData(firstCharacter, sectionOne, secondCharacter);
            addData(secondCharacter, sectionThree, firstCharacter);
        })
    }
})


//displays data in browser
function displayData(character) {
    let { name, img } = character;

    let section = document.createElement("section");
    section.innerHTML = `<img src="images/${img}.png" class="small img" alt="picturs of ${name}"><h2>${name}</h2>`
    charactersDiv.append(section);

    return section;
}


//add additional data
function addData(character, section, characterTwo) {
    let { name, height, mass, hair_color, skin_color, eye_color, gender, films, img } = character;

    section.innerHTML = `<img src="images/${img}.png" class="small img" alt=""><h2>${name}</h2><p>
    Height: ${height}<br>
    Mass: ${mass}<br>
    Hair color: ${hair_color}<br>
    Skin color: ${skin_color}<br>
    Eye color: ${eye_color}<br>
    Gender: ${gender}<br>
    Films: ${films.length}<br>
    </p>`;


    let filmBtn = createBtn("First appearance", "smallBtn")
    let vehiclesBtn = createBtn("Vehicles", "smallBtn")
    section.append(filmBtn, vehiclesBtn);

    filmBtn.addEventListener("click", () => {
        character.firstFilm(characterTwo)
    })

    vehiclesBtn.addEventListener("click", () => {
        character.expensiveVehicles()
    })

}

