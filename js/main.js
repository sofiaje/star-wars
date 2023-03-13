//global
let charactersDiv = document.getElementById("charactersDiv");
const getDataBtn = document.getElementById("getDataBtn")

const list1 = document.getElementById("list1");
const list2 = document.getElementById("list2");


//class character
class Character {
    constructor(name, height, mass, hairColor, skinColor, eyeColor, gender, films, img) {
        this.name = name;
        this.height = height;
        this.mass = mass;
        this.hair_color = hairColor;
        this.skin_color = skinColor;
        this.eye_color = eyeColor;
        this.gender = gender;
        this.films = films;
        this.img = img;
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
        let firstCharacter = await createInstance(list1.value);
        let secondCharacter = await createInstance(list2.value);

        charactersDiv.innerHTML = "";
        // console.log(firstCharacter)
        displayData(firstCharacter);
        let compareBtn = document.createElement("button");
        compareBtn.innerText = "Compare characters";
        compareBtn.classList.add("compareBtn")

        charactersDiv.append(compareBtn)
        displayData(secondCharacter);
    } else {
        console.log("du måste välja karaktärer")
    }
})



function displayData(character) {
    // console.log(character)
    let { name, height, mass, hair_color, skin_color, eye_color, gender, films, img } = character

    let section = document.createElement("section")
    section.innerHTML = `<img src="images/${img}.webp" class="small img" alt=""><h2>${name}</h2>`
    charactersDiv.append(section);
}

/* <p>Height: ${height}<br>
mass: ${mass}<br>
hair color: ${hair_color}<br>
skin color: ${skin_color}<br>
eye color: ${eye_color}<br>
gender: ${gender}<br>
</p> */