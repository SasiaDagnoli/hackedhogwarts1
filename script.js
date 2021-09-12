"use strict";

window.addEventListener("DOMContentLoaded", getJsonData);

let arrayOfStudentObjects = [];
const Student = {
  firstName: "",
  middleName: "",
  nickName: "",
  lastName: "",
  house: "",
};

function getJsonData() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((data) => convertJSONData(data));
}

function convertJSONData(jsonDATA) {
  jsonDATA.forEach((elm) => {
    const student = Object.create(Student);
    const trimName = elm.fullname.trim();
    const trimHouse = elm.house.trim();
    student.firstName = getFirstName(trimName);
    student.middleName = getMiddleName(trimName);
    student.nickName = getNickName(trimName);
    student.lastName = getLastName(trimName);
    student.house = getHouse(trimHouse);
    arrayOfStudentObjects.push(student);
  });

  displayList(arrayOfStudentObjects);
}
eventToButtons();

function eventToButtons() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => addEventListener("click", selectFilter));
}

//Gets the firstname
function getFirstName(firstname) {
  //console.log("getFirstName", fullName);
  const firstName = firstname.substring(0, firstname.indexOf(" "));
  const lowerCase = firstName.toLowerCase();
  const firstLetterCapital =
    firstname[0].toUpperCase() + lowerCase.substring(1);
  //console.log("firstname", firstLetterCapital);
  return firstLetterCapital;
}

//Gets the middlename
function getMiddleName(middlename) {
  const indexLast = middlename.lastIndexOf(" ");
  const indexFirst = middlename.indexOf(" ");
  const middleName = middlename.substring(indexFirst + 1, indexLast);
  //If there is no middlename it is set to undefined
  if (indexFirst === indexLast) {
    return undefined;
  }
  if (middleName.includes('"')) {
    return undefined;
  }
  //Makes the first letter in the middlename capital
  const firstLetterCapital =
    middleName[0].toUpperCase() + middleName.substring(1);

  return firstLetterCapital;
}

function getNickName(nickname) {
  if (nickname.includes('"')) {
    const indexLast = nickname.lastIndexOf('"');
    const indexFirst = nickname.indexOf('"');
    const nickName = nickname.substring(indexFirst + 1, indexLast);
    return nickName;
  } else {
    return undefined;
  }
}

//Gets the lastname
function getLastName(lastname) {
  const indexLast = lastname.lastIndexOf(" ");
  //Finds the lastname
  const lastName = lastname.substring(indexLast + 1);
  //Make everything lowercase
  const lowerCase = lastName.toLowerCase();
  //Make the first character in uppercase
  const firstLetterCapital = lastName[0].toUpperCase() + lowerCase.substring(1);
  //console.log(firstLetterCapital);
  return firstLetterCapital;
}

//Gets the house
function getHouse(house) {
  //Make everything lowercase
  const lowerCase = house.toLowerCase();
  //Make the first character in uppercase
  const firstLetterCapital = house[0].toUpperCase() + lowerCase.substring(1);

  //console.log(firstLetterCapital);
  return firstLetterCapital;
}

console.log(arrayOfStudentObjects);

function selectFilter(event) {
  console.log("clicked");
  const filter = event.target.dataset.house;
  console.log(`user selected ${filter}`);
  filterHouse(filter);
}

function filterHouse(houseType) {
  let filteredList = arrayOfStudentObjects;
  if (houseType === "Gryffindor") {
    filteredList = arrayOfStudentObjects.filter(isGryffindor);
  } else if (houseType === "Slytherin") {
    filteredList = arrayOfStudentObjects.filter(isSlytherin);
  } else if (houseType === "Ravenclaw") {
    filteredList = arrayOfStudentObjects.filter(isRavenclaw);
  } else if (houseType === "Hufflepuff") {
    filteredList = arrayOfStudentObjects.filter(isHufflepuff);
  }
  displayList(filteredList);
}

function isGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}

function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}

function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}

function displayList(students) {
  // clear the list
  document.querySelector("main").textContent = "";

  // build a new list
  students.forEach(displayStudents);
}

function displayStudents(student) {
  console.log("display students");
  let main = document.querySelector("main");
  const clone = document.querySelector("template").content.cloneNode(true);

  if (student.middleName === undefined) {
    clone.querySelector(
      "h2"
    ).textContent = `${student.firstName} ${student.lastName}`;
  } else {
    clone.querySelector(
      "h2"
    ).textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
  }

  clone.querySelector(".house").textContent = student.house;

  main.appendChild(clone);
}
