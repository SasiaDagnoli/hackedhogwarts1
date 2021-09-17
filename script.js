"use strict";

window.addEventListener("DOMContentLoaded", getJsonData);

let arrayOfStudentObjects = [];
const Student = {
  firstName: "",
  middleName: "",
  nickName: "",
  lastName: "",
  house: "",
  prefect: false,
};

const settings = {
  houseType: "all",
  sortBy: "firstName",
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

  //displayList(arrayOfStudentObjects);
  buildList();
}
eventToButtons();

function eventToButtons() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));
  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectSort));
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

function selectFilter(event) {
  const filter = event.target.dataset.house;
  setFilter(filter);
}

function setFilter(filter) {
  settings.houseType = filter;
  buildList();
}

function selectSort(event) {
  const sortBy = event.target.dataset.sortname;
  setSort(sortBy);
}

function setSort(sortBy) {
  settings.sortBy = sortBy;
  buildList();
}

function filterHouse(filteredList) {
  //let filteredList = arrayOfStudentObjects;
  /* if (settings.houseType === "all") {
    displayList(filteredList);
  } else {
    settings.houseType = arrayOfStudentObjects.filter(filterByHouse);
  }
  function filterByHouse(student) {
    if (student.house === settings.houseType) {
      return true;
    } else {
      return false;
    }
  } */

  if (settings.houseType === "Gryffindor") {
    filteredList = arrayOfStudentObjects.filter(isGryffinfor);
  } else if (settings.houseType === "Hufflepuff") {
    filteredList = arrayOfStudentObjects.filter(isHufflepuff);
  } else if (settings.houseType === "Slytherin") {
    filteredList = arrayOfStudentObjects.filter(isSlytherin);
  } else if (settings.houseType === "Ravenclaw") {
    filteredList = arrayOfStudentObjects.filter(isRavenclaw);
  }

  return filteredList;
}

function isGryffinfor(student) {
  if (student.house === "Gryffindor") {
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

function sortList(sortedList) {
  //let sortedList = arrayOfStudentObjects;
  sortedList = sortedList.sort(sortByNames);

  function sortByNames(a, b) {
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1;
    } else {
      return 1;
    }
  }
  return sortedList;
}

function buildList() {
  const currentList = filterHouse(arrayOfStudentObjects);
  const sortedList = sortList(currentList);

  displayList(sortedList);
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

  //Make a student a prefect
  if (student.prefect === true) {
    clone.querySelector(".prefectstar").src = "prefectstarcolor.svg";
  } else {
    //clone.querySelector(".prefectstar").src = "prefectstar.svg";
  }
  clone.querySelector(".prefectstar").addEventListener("click", makePrefect);
  function makePrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakePrefect(student);
    }
    buildList();
  }

  const clickBtn = clone.querySelector(".modal-data");
  clickBtn.addEventListener("click", clickStudent);
  function clickStudent() {
    document.querySelector(".modal").classList.remove("hide");
    document.querySelector(
      ".firstname"
    ).textContent = `Firstname: ${student.firstName}`;
    document.querySelector(
      ".middlename"
    ).textContent = `Middlename: ${student.middleName}`;
    document.querySelector(
      ".lastname"
    ).textContent = `Firstname: ${student.lastName}`;

    decorateModal(student);
  }

  document.querySelector(".close").addEventListener("click", hideModal);

  function hideModal() {
    document.querySelector(".modal").classList.add("hide");
  }

  clone.querySelector(".house").textContent = student.house;

  main.appendChild(clone);
}

function decorateModal(student) {
  if (student.house === "Gryffindor") {
    document.querySelector(".modal-content").style.backgroundColor =
      "rgb(116,0,1)";
  } else if (student.house === "Slytherin") {
    document.querySelector(".modal-content").style.backgroundColor =
      "rgb(26,71,42)";
  } else if (student.house === "Ravenclaw") {
    document.querySelector(".modal-content").style.backgroundColor =
      "rgb(14,26,64)";
  } else {
    document.querySelector(".modal-content").style.backgroundColor =
      "rgb(240,199,94)";
  }
}

function tryToMakePrefect(selectedStudent) {
  const prefects = arrayOfStudentObjects.filter((student) => student.prefect);
  // const numberOfPrefects = prefects.length;
  const otherPrefects = prefects.filter(
    (student) => student.house === selectedStudent.house
  );
  if (otherPrefects[1] !== undefined) {
    console.log("THERE CAN ONLY BE 2 PREFECT FROM EACH HOUSE");
    removeAOrB(otherPrefects[0], otherPrefects[1]);
  } else {
    makeAPrefect(selectedStudent);
  }

  function removeAOrB(prefectA, prefectB) {
    document.querySelector("#prefectremove").classList.remove("hide");
    document.querySelector(
      ".removea"
    ).textContent = `Remove ${prefectA.firstName}`;
    document.querySelector(
      ".removeb"
    ).textContent = `Remove ${prefectB.firstName}`;
    document.querySelector(".removea").addEventListener("click", removeA);
    document.querySelector(".removeb").addEventListener("click", removeB);
    document
      .querySelector(".closeprefect")
      .addEventListener("click", closeDialogue);

    function removeA() {
      removePrefect(prefectA);
      makeAPrefect(selectedStudent);
      buildList();
      closeDialogue();
    }
    function removeB() {
      removePrefect(prefectB);
      makeAPrefect(selectedStudent);
      buildList();
      closeDialogue();
    }

    function closeDialogue() {
      document.querySelector("#prefectremove").classList.add("hide");
      document.querySelector(".removea").removeEventListener("click", removeA);
      document.querySelector(".removeb").removeEventListener("click", removeB);
    }
  }

  function removePrefect(winnerPrefect) {
    winnerPrefect.prefect = false;
  }

  function makeAPrefect(student) {
    student.prefect = true;
  }
}
