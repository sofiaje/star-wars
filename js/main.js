
//class character
class Character {
    constructor(name, height, mass, hairColor, skinColor, eyeColor, gender, films) {
        this.name = name;
        this.height = height;
        this.mass = mass;
        this.hairColor = hairColor;
        this.skinColor = skinColor;
        this.eyeColor = eyeColor;
        this.gender = gender;
        this.films = films;
        // this.img = img;
    }
}


//get data
async function getData(url) {
    let res = await fetch(`https://swapi.dev/api/${url}`);
    let data = await res.json();

    console.log(data)
    return data
}


let luke = new Character("Luke skywalker", 172, 77, "blond", "fair", "blue", "male", 5);

// console.log(luke)




async function loadPage() {
    let person = await getData("people/4");

    let { name, height, mass, hair_color, skin_color, eye_color, gender, films } = person
    
    let newPerson = new Character(name, height, mass, hair_color, skin_color, eye_color, gender, films)
    console.log(newPerson)
}

loadPage()
