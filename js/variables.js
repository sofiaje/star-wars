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