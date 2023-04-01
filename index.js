const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productCategory = document.getElementById("productCategory");
const inputForm = document.getElementById("inputForm");
const table = document.getElementById("mainTable");
const API = "https://crudcrud.com/api/7c702623c35c4bc1ad3edee80bdc3b76";
let editDataID = undefined;

//loading data after refreshing
window.addEventListener("DOMContentLoaded", () => {
  gettingAllData();
});

//Getting All Data To display on The Document
async function gettingAllData() {
  try {
    let response = await axios.get(`${API}/produc-list`);
    for (item of response.data) {
      switch (item.category) {
        case "Electronics":
          electronicsTable(creatingElements(item));
          break;
        case "Cosmetics":
          cosmeticsTable(creatingElements(item));
          break;
        default:
          accessoriesTable(creatingElements(item));
      }
    }
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
}

// Element Creations
function creatingElements(data) {
  //creating Tr
  let newTr = document.createElement("tr");
  newTr.dataset.id = data._id;
  newTr.dataset.category = data.category;

  //Creating Name Td
  let nameTd = document.createElement("td");
  nameTd.className = "Name";
  let nameText = document.createTextNode(data.name);
  nameTd.appendChild(nameText);

  //Creating Price Td
  let priceTd = document.createElement("td");
  priceTd.className = "Price";
  let priceText = document.createTextNode(data.price);
  priceTd.appendChild(priceText);

  //Creating Actions Td
  let actionTd = document.createElement("td");

  //Creating Delete Button
  let editBtn = document.createElement("button");
  let editBtnText = document.createTextNode("Edit");
  editBtn.appendChild(editBtnText);
  editBtn.className = "btn btn-success mr-2 edit";
  actionTd.appendChild(editBtn);

  //Creating Delete Button
  let deleteBtn = document.createElement("button");
  let deleteBtnText = document.createTextNode("Delete");
  deleteBtn.appendChild(deleteBtnText);
  deleteBtn.className = "btn btn-warning delete";
  actionTd.appendChild(deleteBtn);

  //appending Td inside Tr
  newTr.appendChild(nameTd);
  newTr.appendChild(priceTd);
  newTr.appendChild(actionTd);

  return newTr;
}

//appending Tr inside Table Body
function electronicsTable(tr) {
  //appending Tr inside Table Body
  document.getElementById("electronicsTable").appendChild(tr);
}

//appending Tr inside Table Body
function cosmeticsTable(tr) {
  //appending Tr inside Table Body
  document.getElementById("cosmeticsTable").appendChild(tr);
}

//appending Tr inside Table Body
function accessoriesTable(tr) {
  //appending Tr inside Table Body
  document.getElementById("accessoriesTable").appendChild(tr);
}

//On Submit Event
inputForm.addEventListener("submit", addingDataToServer);

function addingDataToServer(e) {
  e.preventDefault();
  if (
    //Checking That All Inputs Are Empty Or Not
    productName.value == "" ||
    productPrice.value == "" ||
    productCategory.value == ""
  ) {
    alert("Please Fill Up The Form");
  } else {
    if (editDataID === undefined) {
      //Saving Data To The Server
      savingAllData()

    } else {
      //Changing Data of Server
      editingAllData()
    }
  }
}

//Saving All Data To Sarver
async function savingAllData() {
    try {
      await axios.post(`${API}/produc-list`,{
        name: productName.value,
        price: productPrice.value,
        category: productCategory.value,
      });
      alert("Product Added");
          location.reload();
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  }

  //Editing All Data To Sarver
async function editingAllData() {
    try {
      await axios.put(`${API}/produc-list/${editDataID}`,{
        name: productName.value,
        price: productPrice.value,
        category: productCategory.value,
      });
      alert("Edited");
      location.reload();
      editDataID = undefined;
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  }



//Delete and edit event Event
table.addEventListener("click", deleteAndEdit);

function deleteAndEdit(e) {
  let clickedTable = e.target.parentElement.parentElement.parentElement;
  if (e.target.classList.contains("delete")) {
    if (confirm("Are You Sure?")) {
      //Storing Delete Element
      let deleteElement = e.target.parentElement.parentElement;

      //Storing Delete Element's Data ID
      let deleteElementID = deleteElement.getAttribute("data-id");

      //Deleting Element From Table
      clickedTable.removeChild(deleteElement);

      //Deleting Data From The Server
      deleteRow(deleteElementID)
    }

  } else if (e.target.classList.contains("edit")) {
    if (confirm("Do You Want To Edit")) {
      // find tr element of the clicked button
      const editElement = e.target.parentElement.parentElement;

      //selecting dataset's values
      const category = editElement.dataset.category;
      const id = editElement.dataset.id;

      // selecting the name and price element's value
      const name = editElement.querySelector(".Name").textContent;
      const price = editElement.querySelector(".Price").textContent;

      //Setting The input's Place Holders
      productName.value = name;
      productPrice.value = price;
      productCategory.value = category;
      editDataID = id;

      //Deleting Element From Table
      clickedTable.removeChild(editElement);
    }
  }
}
//Delete function
async function  deleteRow(id) {
  try {
    await axios.delete(`${API}/produc-list/${id}`)
  } catch (error) {
    console.log(error)
  }
}
