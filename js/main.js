//global
let charactersDiv = document.getElementById("charactersDiv");
let compareDiv = document.getElementById("compareDiv");
const getDataBtn = document.getElementById("getDataBtn")
const p = document.querySelector("p.error");


const list1 = document.getElementById("list1");
const list2 = document.getElementById("list2");


//class character
class Character {
    constructor(name, height, mass, hairColor, skinColor, eyeColor, gender, films, img) {
        this.name = name;
        this.height = Number(height) ? Number(height) : "unknown";
        this.mass = Number(mass) ? Number(mass) : "unknown";
        this.hair_color = hairColor === "n/a" ? "no hair on this body" : hairColor;
        this.skin_color = skinColor;
        this.eye_color = eyeColor;
        this.gender = gender === "n/a" ? "no gender" : gender;
        this.films = films;
        this.img = img;
    }
    compareHeight(character) {
        let p = document.createElement("p");
        if (this.height > character.height) {
            p.innerHTML += `${this.name} is taller than ${character.name}`;
        } else if (this.height < character.height) {
            p.innerHTML += `${character.name} is taller than ${this.name}`;
        } else {
            p.innerHTML += `They have the same height`;
        }
        compareDiv.append(p);
    }
    compareMass(character) {
        let p = document.createElement("p");
        if (this.mass > character.mass) {
            p.innerHTML += `${this.name} is heavier than ${character.name}`;
        } else if (this.mass < character.mass) {
            p.innerHTML += `${character.name} is heavier than ${this.name}`;
        } else {
            p.innerHTML += `They have the same weight`;
        }
        compareDiv.append(p);

    }
    compareFilms(character) {
        let p = document.createElement("p");
        if (this.films.length > character.films.length) {
            p.innerHTML += `${this.name} stars in more films then ${character.name}`;
        } else if (this.films.length < character.films.length) {
            p.innerHTML += `${character.name} stars in more films then ${this.name}`;
        } else {
            p.innerHTML += `They star in the same amount of films`;
        }
        compareDiv.append(p);
    }
    compareGender(character) {
        let p = document.createElement("p");

        this.gender === character.gender ? p.innerHTML += `Same gender` : ""

        compareDiv.append(p);

    }
    compareHairandSkin(character) {
        let p = document.createElement("p");
        if (this.hair_color === character.hair_color) {
            p.innerHTML += `Same haircolor`
        }
        if (this.skin_color === character.skin_color) {
            p.innerHTML += `Same skincolor`
        }
        compareDiv.append(p);
    }
}


//get data
async function getData(url) {
    let res = await fetch(`https://swapi.dev/api/${url}`);
    let data = await res.json();

    console.log(data)
    return data
}




async function createInstance(value) {
    let person = await getData(`people/${value}`);

    let { name, height, mass, hair_color, skin_color, eye_color, gender, films } = person

    let newPerson = new Character(name, height, mass, hair_color, skin_color, eye_color, gender, films, value)
    // console.log(newPerson)
    return newPerson
}

// loadPage()





getDataBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    if (parseInt(list1.value) !== 0 && parseInt(list2.value) !== 0) {
        p.innerText = "";
        compareDiv.innerText = "";
        let firstCharacter = await createInstance(list1.value);
        let secondCharacter = await createInstance(list2.value);

        charactersDiv.innerHTML = "";
        let sectionOne = displayData(firstCharacter);

        let compareBtn = document.createElement("button");
        compareBtn.innerText = "compare";
        compareBtn.classList.add("compareBtn")
        charactersDiv.append(compareBtn)

        let sectionTwo = displayData(secondCharacter);

        compareBtn.addEventListener("click", () => {
            compareDiv.innerHTML = ""
            firstCharacter.compareHeight(secondCharacter);
            firstCharacter.compareMass(secondCharacter);
            firstCharacter.compareFilms(secondCharacter);
            firstCharacter.compareGender(secondCharacter);
            firstCharacter.compareHairandSkin(secondCharacter);

            addData(firstCharacter, sectionOne)
            addData(secondCharacter, sectionTwo)
        })
    } else {
        p.innerText = "Du måste välja två karaktärer"
    }
})



function displayData(character) {
    // console.log(character)
    let { name, height, mass, hair_color, skin_color, eye_color, gender, films, img } = character

    let section = document.createElement("section")
    section.innerHTML = `<img src="images/${img}.png" class="small img" alt=""><h2>${name}</h2>`
    let btn
    charactersDiv.append(section);
    return section;
}


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

    // console.log(height, hair_color, mass, films.length)
}

/* <p>Height: ${height}<br>
mass: ${mass}<br>
hair color: ${hair_color}<br>
skin color: ${skin_color}<br>
eye color: ${eye_color}<br>
gender: ${gender}<br>
</p> */