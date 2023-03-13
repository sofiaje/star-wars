//global
let charactersDiv = document.getElementById("charactersDiv");
let compareDiv = document.getElementById("compareDiv");
const getDataBtn = document.getElementById("getDataBtn")
const p = document.querySelector("p.error");
let buttonWrapper = document.createElement("div");
buttonWrapper.classList.add("buttonWrapper")



const list1 = document.getElementById("list1");
const list2 = document.getElementById("list2");


//class character
class Character {
    constructor(name, height, mass, hairColor, skinColor, eyeColor, gender, films, img, homeworld) {
        this.name = name;
        this.height = Number(height) ? Number(height) : "unknown";
        this.mass = Number(mass) ? Number(mass) : "unknown";
        this.hair_color = hairColor === "n/a" ? "no hair on this body" : hairColor;
        this.skin_color = skinColor;
        this.eye_color = eyeColor;
        this.gender = gender === "n/a" ? "no gender" : gender;
        this.films = films;
        this.img = img;
        this.homeworld = homeworld
    }


    compareHeight(character) {
        let p = document.createElement("p");
        if (this.height > character.height) {
            p.innerHTML = `${this.name} is taller than ${character.name}`;
        } else if (this.height < character.height) {
            p.innerHTML = `${character.name} is taller than ${this.name}`;
        } else {
            p.innerHTML = `They have the same height`;
        }
        compareDiv.append(p);
    }


    compareMass(character) {
        let p = document.createElement("p");
        if (!Number(this.mass) || !Number(character.mass)) {
            p.innerHTML = "Someone is keeping their weight a secret!"
        } else if (this.mass > character.mass) {
            p.innerHTML = `${this.name} is heavier than ${character.name}`;
        } else if (this.mass < character.mass) {
            p.innerHTML = `${character.name} is heavier than ${this.name}`;
        } else {
            p.innerHTML = `They have the same weight`;
        }
        compareDiv.append(p);
    }


    compareFilms(character) {
        let p = document.createElement("p");
        if (this.films.length > character.films.length) {
            p.innerHTML = `${this.name} stars in more films then ${character.name}`;
        } else if (this.films.length < character.films.length) {
            p.innerHTML = `${character.name} stars in more films then ${this.name}`;
        } else {
            p.innerHTML = `They star in the same amount of films`;
        }
        compareDiv.append(p);
    }


    compareGender(character) {
        let p = document.createElement("p");

        this.gender === character.gender ? p.innerHTML = `Same gender` : "";

        compareDiv.append(p);
    }


    compareHairAndSkin(character) {
        let p = document.createElement("p");
        if (this.hair_color === "no hair on this body" && character.hair_color === "no hair on this body") {
            console.log("robots don't do hair")
        } else if (this.hair_color === character.hair_color) {
            p.innerHTML = `Same haircolor. `
        } else if (this.hair_color.includes(character.hair_color) || character.hair_color.includes(this.hair_color)) {
            p.innerHTML = `(Some hairs are the same color). `
        }

        this.skin_color === character.skin_color ? p.innerHTML += `Same skincolor` : "";
        compareDiv.append(p);
    }
    async firstFilm() {
        let data = await getData(this.films[0])
        compareDiv.innerHTML = `${this.name} first appered in the movie <i>${data.title}</i>, released ${data.release_date}`
    }
    async movies(character) {

    }
    async planets(character) {
        let data1 = await getData(this.homeworld);
        let data2 = await getData(character.homeworld);
        // console.log(data1.name + " and " + data2.name);
        if (data1.name === data2.name) {
            compareDiv.innerHTML = `${this.name} and ${character.name} share the same home world, the name is ${data1.name}`;
        } else {
            compareDiv.innerHTML = `The name of ${this.name}'s home world is ${data1.name}. `
            compareDiv.innerHTML += `The name of ${character.name}'s home world is ${data2.name}.`
        }
    }
}


//get data
async function getData(url) {
    let res = await fetch(`${url}`);
    let data = await res.json();

    return data
}



//create new instance depening on user choice
async function createInstance(value) {
    let person = await getData(`https://swapi.dev/api/people/${value}`);

    let { name, height, mass, hair_color, skin_color, eye_color, gender, films, homeworld } = person

    let newPerson = new Character(name, height, mass, hair_color, skin_color, eye_color, gender, films, value, homeworld)
    return newPerson
}


//get info button
getDataBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    if (Number(list1.value) !== 0 && Number(list2.value) !== 0) {
        p.innerText = "";
        compareDiv.innerText = "";
        let firstCharacter = await createInstance(list1.value);
        let secondCharacter = await createInstance(list2.value);

        charactersDiv.innerHTML = "";
        let sectionOne = displayData(firstCharacter);


        let sectionTwo = document.createElement("section");
        let compareBtn = document.createElement("button");
        compareBtn.innerText = "compare characters";
        compareBtn.classList.add("btn", "compareBtn")
        charactersDiv.append(sectionTwo)
        sectionTwo.append(compareBtn)

        let sectionThree = displayData(secondCharacter);

        compareBtn.addEventListener("click", () => {
            compareDiv.innerHTML = ""
            buttonWrapper.innerHTML = ""
            // compareBtn.disabled = true;
            if (firstCharacter.name === secondCharacter.name) {
                let p = document.createElement("p");
                p.innerHTML = `Same person or evil twin? Who knows?`
                compareDiv.append(p);
            } else {
                firstCharacter.compareHeight(secondCharacter);
                firstCharacter.compareMass(secondCharacter);
                firstCharacter.compareFilms(secondCharacter);
                firstCharacter.compareGender(secondCharacter);
                firstCharacter.compareHairAndSkin(secondCharacter);
            }


            sectionTwo.append(buttonWrapper);
            let commonFilmsBtn = document.createElement("button")
            commonFilmsBtn.innerText = "Common films";
            commonFilmsBtn.classList.add("btn", "smallBtn")

            let planetBtn = document.createElement("button")
            planetBtn.innerText = "Planet";
            planetBtn.classList.add("btn", "smallBtn")

            buttonWrapper.append(commonFilmsBtn, planetBtn)

            addData(firstCharacter, sectionOne)
            addData(secondCharacter, sectionThree)

            planetBtn.addEventListener("click", () => {
                firstCharacter.planets(secondCharacter)
            })

        })
    } else {
        p.innerText = "Choose two characters"
    }
})


//displays data in browser
function displayData(character) {
    let { name, img } = character

    let section = document.createElement("section")
    section.innerHTML = `<img src="images/${img}.png" class="small img" alt=""><h2>${name}</h2>`
    charactersDiv.append(section);
    return section;
}


//add additional data
function addData(character, section) {
    let { name, height, mass, hair_color, skin_color, eye_color, gender, films, img } = character

    section.innerHTML = `<img src="images/${img}.png" class="small img" alt=""><h2>${name}</h2><p>
    Height: ${height}<br>
    Mass: ${mass}<br>
    Hair color: ${hair_color}<br>
    Skin color: ${skin_color}<br>
    Eye color: ${eye_color}<br>
    Gender: ${gender}<br>
    Films: ${films.length}<br>
    </p>`;

    let filmBtn = document.createElement("button")
    filmBtn.innerText = "First apperence";
    filmBtn.classList.add("btn", "smallBtn")

    let commonFilmsBtn = document.createElement("button")
    commonFilmsBtn.innerText = "Common films";
    commonFilmsBtn.classList.add("btn", "smallBtn")

    let vehiclesBtn = document.createElement("button")
    vehiclesBtn.innerText = "Vechicles";
    vehiclesBtn.classList.add("btn", "smallBtn")

    section.append(filmBtn, vehiclesBtn)

    filmBtn.addEventListener("click", () => {
        character.firstFilm()
    })

}
