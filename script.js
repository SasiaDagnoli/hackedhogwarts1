"use strict";

window.addEventListener("DOMContentLoaded", getJsonData);

let arrayOfStudentObjects = [];
const Student = {
  firstName: "",
  middleName: "",
  nickName: "",
  lastName: "",
  house: "",
  image: "",
  prefect: false,
  inquisitorial: false,
  expelled: false,
  bloodStatus: "",
};

let expelledArray = [];
let bloodData;

const settings = {
  houseType: "all",
  sortBy: "firstName",
  prefect: false,
};

async function getJsonData() {
  const response = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );
  const data = await response.json();

  const bloodStatus = await fetch(
    "https://petlatkea.dk/2021/hogwarts/families.json"
  );
  bloodData = await bloodStatus.json();

  convertJSONData(data);
}

/* function getJsonData() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((data) => convertJSONData(data));
} */

/* async function loadBloodStatus() {
  const response = await fetch(
    "https://petlatkea.dk/2021/hogwarts/families.json"
  );
  bloodData = await response.json();
  console.log(bloodData);
  //convertJSONData();
} */

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
    student.image = getImage(student.firstName, student.lastName);
    student.bloodStatus = getBloodStatus(student.lastName);
    // console.log(bloodData);
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
  document.querySelector("#search").addEventListener("input", searchField);
}

function getBloodStatus(lastname) {
  //console.log(bloodData);
  let bloodStatus;
  if (bloodData.half.includes(`${lastname}`)) {
    bloodStatus = "Halfblood";
  } else if (bloodData.pure.includes(`${lastname}`)) {
    bloodStatus = "Pureblood";
  } else {
    bloodStatus = "Mudblood";
  }
  return bloodStatus;
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

function getImage(firstname, lastname) {
  let imgName;
  if (lastname === "Patil") {
    if (firstname === "Padma") {
      imgName = "patil_padma.png";
    } else {
      imgName = "patil_pavarti.png";
    }
    return imgName;
  } else {
    const lowerCaseFirstName = firstname.toLowerCase().substring(1, 0);
    const lowerCaseLastName = lastname.toLowerCase();
    imgName = `${lowerCaseLastName}_${lowerCaseFirstName}.png`;
    //console.log(imgName);
    return imgName;
  }
}

//function getBloodStatus(lastname) {}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
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
  } else if (settings.houseType === "expelled") {
    filteredList = expelledArray;
  } else if (settings.houseType === "prefect") {
    filteredList = arrayOfStudentObjects.filter(isPrefect);
  }

  return filteredList;
}

function isPrefect(student) {
  if (student.prefect === true) {
    return true;
  } else {
    return false;
  }
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
  document.querySelector(
    ".numbercurrent"
  ).textContent = `Students displayed: ${currentList.length}`;
  const sortedList = sortList(currentList);

  displayList(sortedList);
}

function displayList(students) {
  // clear the list
  document.querySelector("tbody").textContent = "";

  // build a new list
  students.forEach(displayStudents);
}

function displayStudents(student) {
  console.log("display students");
  let tbody = document.querySelector("tbody");
  const clone = document.querySelector("template").content.cloneNode(true);

  clone.querySelector(".modal-data").textContent = `${student.firstName}`;
  clone.querySelector(".lastname").textContent = `${student.lastName}`;

  //Make a student a prefect
  if (student.prefect === true) {
    clone.querySelector(".prefectstar").src = "prefectstarcolor.svg";
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

  //Make a part of inquisitorial squad
  if (student.inquisitorial === true) {
    clone.querySelector(".inquisitorialimg").src = "inqtrue.svg";
  } else {
    clone.querySelector(".inquisitorialimg").src = "inqempty.svg";
  }
  clone
    .querySelector(".inquisitorialimg")
    .addEventListener("click", makeInquisitorial);
  function makeInquisitorial() {
    student.inquisitorial = !student.inquisitorial;
    buildList();
  }

  //Expel a student
  clone.querySelector(".doorexpel").addEventListener("click", clickExpel);
  function clickExpel() {
    student.expelled = true;
    console.log(student);
    const expelledStudent = arrayOfStudentObjects.indexOf(student);
    arrayOfStudentObjects.splice(expelledStudent, 1);
    expelledArray.unshift(student);
    console.log(expelledArray);
    console.log(arrayOfStudentObjects);
    buildList();
  }
  //Show modal about students
  const clickBtn = clone.querySelector(".modal-data");
  clickBtn.addEventListener("click", clickStudent);
  function clickStudent() {
    document.querySelector(".modal").classList.remove("hide");
    document.querySelector(".image").src = `images/${student.image}`;
    if (student.middleName === undefined) {
      document.querySelector(
        ".firstname"
      ).textContent = `Firstname: ${student.firstName}`;
      document.querySelector(
        ".lastnamemodal"
      ).textContent = `Lastname: ${student.lastName}`;
    } else {
      document.querySelector(
        ".firstname"
      ).textContent = `Firstname: ${student.firstName}`;
      document.querySelector(
        ".middlename"
      ).textContent = `Middlename: ${student.middleName}`;
      document.querySelector(
        ".lastnamemodal"
      ).textContent = `Lastname: ${student.lastName}`;
    }

    if (student.prefect === true) {
      document.querySelector(".prefectstarmodal").src = "prefectstarcolor.svg";
    } else {
      document.querySelector(".prefectstarmodal").src = "prefectstar.svg";
    }

    if (student.expelled === false) {
      document.querySelector(".expelledtrue").textContent = "Not expelled";
    } else {
      document.querySelector(".expelledtrue").textContent = "Expelled";
    }

    document.querySelector(
      ".bloodstatus"
    ).textContent = `Bloodstatus: ${student.bloodStatus}`;

    decorateModal(student);
  }

  document.querySelector(".close").addEventListener("click", hideModal);

  function hideModal() {
    document.querySelector(".modal").classList.add("hide");
  }

  clone.querySelector(".house").textContent = student.house;

  //Student info
  document.querySelector(
    ".numberofstudents"
  ).textContent = `Number of students: ${arrayOfStudentObjects.length}`;
  document.querySelector(
    ".numberexpelled"
  ).textContent = `Expelled: ${expelledArray.length}`;

  tbody.appendChild(clone);
}

function decorateModal(student) {
  if (student.house === "Gryffindor") {
    document.querySelector(".housecrest").src = "ghousecrest.svg";
  } else if (student.house === "Slytherin") {
    document.querySelector(".housecrest").src = "shousecrest.svg";
  } else if (student.house === "Ravenclaw") {
    document.querySelector(".housecrest").src = "rhousecrest.svg";
  } else {
    document.querySelector(".housecrest").src = "hhousecrest.svg";
  }
}

function tryToMakePrefect(selectedStudent) {
  const prefects = arrayOfStudentObjects.filter((student) => student.prefect);
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

//Make search field
function searchField(event) {
  const searchWord = document.querySelector("#search").value.toLowerCase();
  const filteredSearch = arrayOfStudentObjects.filter((student) => {
    return (
      student.firstName.toLowerCase().includes(searchWord) ||
      student.lastName.toLowerCase().includes(searchWord)
    );
  });
  displayList(filteredSearch);
}
