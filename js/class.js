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
            p.innerHTML = `${this.name} ${this.mass > character.mass ? "is heavier" : "weigh less"} than ${character.name}`;
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
            p.innerHTML = `Gender? Robots don't have genders — they're metal and plastic, filled with ones and zeroes.`
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

    async expensiveVehicles() {
        loading(compareDiv);
        compareDiv.scrollIntoView();
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

    async firstFilm(character) {
        loading(compareDiv);
        compareDiv.scrollIntoView();
        let data1 = await getData(this.films[0])
        let data2 = "";
        if (this.name !== character.name) {
            data2 = await getData(character.films[0])
        }
        compareDiv.innerHTML = `${this.name} first appeared in the movie <i>${data1.title}</i>, released in ${data1.release_date}. `
        if (data1.title === data2.title && this.name !== character.name) {
            compareDiv.innerHTML += `${character.name} was first seen in the same movie.`
        }
        return compareDiv;
    }

    async movies(character) {
        loading(compareDiv);
        compareDiv.scrollIntoView();
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
        compareDiv.scrollIntoView();

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