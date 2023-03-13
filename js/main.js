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
        this.height = parseInt(height);
        this.mass = parseInt(mass);
        this.hair_color = hairColor;
        this.skin_color = skinColor;
        this.eye_color = eyeColor;
        this.gender = gender;
        this.films = films;
        this.img = img;
    }
    compareCaracters(character, sectionOne, sectionTwo) {
        compareDiv.innerText = "Du vill jämnföra " + this.name + " och " + character.name;
        addData(this, sectionOne)
        addData(character, sectionTwo)

    }
}


//get data
async function getData(url) {
    let res = await fetch(`https://swapi.dev/api/${url}`);
    let data = await res.json();

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
            firstCharacter.compareCaracters(secondCharacter, sectionOne, sectionTwo);
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