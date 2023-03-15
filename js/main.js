//global
let charactersDiv = document.getElementById("charactersDiv");
let compareDiv = document.createElement("div");
compareDiv.classList.add("compareDiv", "hidden")
compareDiv.setAttribute("id", "compare")
const getDataBtn = document.getElementById("getDataBtn")
const pError = document.querySelector("p.error");
const pSpinner = document.querySelector("p.spinnerP");
let buttonWrapper = document.createElement("div");
buttonWrapper.classList.add("buttonWrapper")

const list1 = document.getElementById("list1");
const list2 = document.getElementById("list2");

let characters = [];


//class character
class Character {
    constructor(name, height, mass, hairColor, skinColor, eyeColor, gender, films, img, homeworld, vehicles, starships) {
        this.name = name;
        this.height = Number(height) ? Number(height) : "unknown";
        this.mass = Number(mass) ? Number(mass) : "unknown";
        this.hair_color = hairColor === "n/a" ? "no hair on this body" : hairColor;
        this.skin_color = skinColor;
        this.eye_color = eyeColor;
        this.gender = gender === "n/a" ? "no gender" : gender;
        this.films = films;
        this.img = Number(img);
        this.homeworld = homeworld;
        this.transports = vehicles.concat(starships)
    }

    async expensiveVehicles() {
        loading(compareDiv);
        let transports = this.transports;

        if (transports.length < 1) {
            compareDiv.innerHTML = `${this.name} has no vehicles`
        } else if (transports.length === 1) {
            let res = await getData(transports[0])
            compareDiv.innerHTML = `${this.name} only has one vehicle. The name is <i>${res.name}</i> ${res.cost_in_credits === "unknown" ? "but" : "and"} the price is ${res.cost_in_credits}.`
        } else {
            let promises = transports.map(vehicle => getData(vehicle))
            let result = await Promise.all(promises);

            let filtered = result.filter(item => { return item.cost_in_credits !== "unknown" });
            let sortedByPrice = filtered.sort((a, b) => { return Number(b.cost_in_credits) - Number(a.cost_in_credits) })
            compareDiv.innerHTML = `${this.name} has ${this.transports.length} vehicles, the most expensive one is <i>${sortedByPrice[0].name}</i> with the price of ${sortedByPrice[0].cost_in_credits}.`
        }
    }

    compareHeight(character) {
        let p = document.createElement("p");

        if (this.height === character.height) {
            p.innerHTML = `They have the same height`;
        } else {
            p.innerHTML = `${this.name} is ${this.height > character.height ? "taller" : "shorter"} than ${character.name}`;
        }

        compareDiv.append(p);
    }

    compareMass(character) {
        let p = document.createElement("p");
        if (!Number(this.mass) || !Number(character.mass)) {
            p.innerHTML = "Someone is keeping their weight a secret"
        } else if (this.mass === character.mass) {
            p.innerHTML = `They have the same weight`;
        } else {
            p.innerHTML = `${this.name} ${this.mass > character.mass ? "is heavier" : "weight less"} than ${character.name}`;
        }
        compareDiv.append(p);
    }

    compareFilms(character) {
        let p = document.createElement("p");
        if (this.films.length === character.films.length) {
            p.innerHTML = `They star in the same amount of films`;
        } else {
            p.innerHTML = `${this.name} appears in ${this.films.length > character.films.length ? "more" : "less"} movies than ${character.name}`;
        }
        compareDiv.append(p);
    }

    compareGender(character) {
        let p = document.createElement("p");
        if (this.gender === "no gender" && character.gender === "no gender") {
            p.innerHTML = `Robots don't have genders—they're metal and plastic and silicon, and filled with ones and zeroes`
        } else if (this.gender === character.gender) {
            p.innerHTML = `They share the same gender`;
        }
        compareDiv.append(p);
    }

    compareHairAndSkin(character) {
        let p = document.createElement("p");
        if (this.hair_color === "no hair on this body" && character.hair_color === "no hair on this body") {
            p.innerHTML = `Robots don't do hair`
        } else if (this.hair_color === character.hair_color) {
            p.innerHTML = `They share the same haircolor. `
        } else if (this.hair_color.includes(character.hair_color) || character.hair_color.includes(this.hair_color)) {
            p.innerHTML = `Some hairs are the same color. `
        }

        this.skin_color === character.skin_color ? p.innerHTML += `They share the same skincolor` : "";
        compareDiv.append(p);
    }

    async firstFilm(character) {
        loading(compareDiv);
        let data1 = await getData(this.films[0])
        let data2 = "";
        if (this.name !== character.name) {
            data2 = await getData(character.films[0])
        }
        compareDiv.innerHTML = `${this.name} first appered in the movie <i>${data1.title}</i>, released in ${data1.release_date}. `
        if (data1.title === data2.title && this.name !== character.name) {
            compareDiv.innerHTML += `${character.name} was first seen in the same movie.`
        }
        return compareDiv;
    }

    async movies(character) {
        loading(compareDiv);
        let commonFilms = this.films.filter(url => character.films.includes(url))
        if (commonFilms.length < 1) {
            compareDiv.innerHTML = `The characters do not have any movies in common`
        } else {
            let promises = commonFilms.map(film => getData(film))
            let result = await Promise.all(promises);
            compareDiv.innerHTML = `<p>${this.name === character.name ? `${this.name} appear in:` : `Both characters appear in:`}</p>`;
            result.forEach(film => {
                compareDiv.innerHTML += `<p>${film.title} - ${film.release_date.slice(0, 4)}</p>`
            })
        }
    }

    async planets(character) {
        loading(compareDiv);

        let data1 = await getData(this.homeworld);
        let data2 = "";
        if (this.name !== character.name) {
            data2 = await getData(character.homeworld);
        }

        if (data1.name === data2.name && this.name !== character.name) {
            compareDiv.innerHTML = `${this.name} and ${character.name} share the same home planet, the name of this planet is ${data1.name}.`;
        } else if (this.name === character.name) {
            compareDiv.innerHTML = `The name of ${this.name}'s home planet is ${data1.name}.`
        } else {
            compareDiv.innerHTML = `The name of ${this.name}'s home planet is ${data1.name}. The name of ${character.name}'s home planet is ${data2.name}.`
        }
    }
}




// ---------------------------------------------------------------------------------------------------------------------------------------------
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
    console.log(value)
    let test = characters.filter(e => e.img === Number(value))
    if (test.length > 0) {
        console.log("har redan hämtats en gång")
        return test[0]
    }

    let person = await getData(`https://swapi.dev/api/people/${value}`);

    let { name, height, mass, hair_color, skin_color, eye_color, gender, films, homeworld, vehicles, starships } = person

    let newPerson = new Character(name, height, mass, hair_color, skin_color, eye_color, gender, films, value, homeworld, vehicles, starships)
    console.log(newPerson)
    characters.push(newPerson)
    return newPerson
}



// ---------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------


//get info button
getDataBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    compareDiv.classList.add("hidden");

    console.log(list1.value, list2.value)
    if (Number(list1.value) === 0 || Number(list2.value) === 0) {
        pError.innerText = "Choose two characters";
    } else {
        clear(pError)
        loading(pSpinner, "2xl")


        // compareDiv.innerText = "";
        let firstCharacter = await createInstance(Number(list1.value));
        let secondCharacter = await createInstance(Number(list2.value));
        console.log("first character", firstCharacter)
        clear(pSpinner)
        clear(charactersDiv)

        let sectionOne = displayData(firstCharacter);

        let sectionTwo = document.createElement("section");
        sectionTwo.classList.add("textSection")
        let compareBtn = createBtn("compare characters", "compareBtn")

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
    section.innerHTML = `<img src="images/${img}.png" class="small img" alt=""><h2>${name}</h2>`
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


    let filmBtn = createBtn("First apperence", "smallBtn")
    let vehiclesBtn = createBtn("Vechicles", "smallBtn")
    section.append(filmBtn, vehiclesBtn);

    filmBtn.addEventListener("click", () => {
        character.firstFilm(characterTwo)
    })

    vehiclesBtn.addEventListener("click", () => {
        character.expensiveVehicles()
    })

    //kolla min array
}

