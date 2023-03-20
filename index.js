const productName = document.getElementById('productName');
const productPrice = document.getElementById('productPrice');
const productCategory = document.getElementById('productCategory');
const inputForm = document.getElementById('inputForm');
const table = document.getElementById('mainTable');
const API = 'https://crudcrud.com/api/12b46c38320f493dae46046421e59030';
let editDataID = undefined;
let confirmation = undefined;


//loading data after refreshing

window.addEventListener('DOMContentLoaded',() => {
    axios.get(`${API}/produc-list`)
    .then((res)=>{
        for(item of res.data)
            {

                switch (item.category) {
                    case 'Electronics' : electronicsTable (creatingElements(item))
                        break;
                    case 'Cosmetics' : cosmeticsTable(creatingElements(item))
                        break;
                    default: accessoriesTable(creatingElements(item)) 
    
                }     
            }
    }).catch((err) => {
        console.log(err);
    })
})

//On Submit Event 
inputForm.addEventListener('submit', addingDataToServer);


function addingDataToServer(e){
        e.preventDefault()
        if(
            //Checking That All Inputs Are Empty Or Not
            productName.value == '' ||
            productPrice.value == '' || 
            productCategory.value == '' 
        ){
                alert("Please Fill Up The Form")
        }
        else {
                if(editDataID === undefined){
                     //Saving Data To The Server
                    axios.post(`${API}/produc-list`,{
                        name: productName.value,
                        price: productPrice.value,
                        category: productCategory.value
                    }).then((res) => {
                        alert('Product Added')
                        location.reload();
                    })
                }
                else{
                    //Changing Data of Server
                    axios.put(API + '/produc-list/'+ editDataID, {
                        name: productName.value,
                        price: productPrice.value,
                        category: productCategory.value
                      })
                      .then(response => {
                        alert('Edited')
                        location.reload();
                        editDataID = undefined;
                      })
                      .catch(error => {
                        console.log(error);
                      });
                      
                }

        }
    
}

// Element Creations
function creatingElements(data){
        //creating Tr
        let newTr = document.createElement('tr');
        newTr.dataset.id = data._id;
        newTr.dataset.category = data.category;

    
        //Creating Name Td 
        let nameTd = document.createElement('td');
        nameTd.className='Name';
        let nameText = document.createTextNode(data.name)
        nameTd.appendChild(nameText);
        
        //Creating Price Td 
        let priceTd =document.createElement('td');
        priceTd.className='Price';
        let priceText = document.createTextNode(data.price)
        priceTd.appendChild(priceText);

        //Creating Actions Td 
        let actionTd = document.createElement('td');

         //Creating Delete Button 
         let editBtn = document.createElement('button');
         let editBtnText = document.createTextNode('Edit')
         editBtn.appendChild(editBtnText);
         editBtn.className='btn btn-success mr-2 edit';
         actionTd.appendChild(editBtn);

        //Creating Delete Button 
        let deleteBtn = document.createElement('button');
        let deleteBtnText = document.createTextNode('Delete')
        deleteBtn.appendChild(deleteBtnText);
        deleteBtn.className='btn btn-warning delete';
        actionTd.appendChild(deleteBtn);

    
        //appending Td inside Tr
        newTr.appendChild(nameTd)
        newTr.appendChild(priceTd)
        newTr.appendChild(actionTd)   

        return newTr;
}

//appending Tr inside Table Body 
function electronicsTable (tr) {

    //appending Tr inside Table Body
    document.getElementById('electronicsTable').appendChild(tr)
   
}

//appending Tr inside Table Body
function cosmeticsTable (tr) {
   //appending Tr inside Table Body
   document.getElementById('cosmeticsTable').appendChild(tr) 

}

//appending Tr inside Table Body
function accessoriesTable (tr) {
    //appending Tr inside Table Body
    document.getElementById('accessoriesTable').appendChild(tr)

}



//Delete and edit event Event

table.addEventListener('click', deleteAndEdit);

function deleteAndEdit(e){
    
    let clickedTable = e.target.parentElement.parentElement.parentElement
    if(e.target.classList.contains('delete')){
        if(confirm('Are You Sure?')){
            //Storing Delete Element
            let deleteElement = e.target.parentElement.parentElement;
            
            //Storing Delete Element's Data ID
            let deleteElementID = deleteElement.getAttribute('data-id');

            //Deleting Element From Table
            clickedTable.removeChild(deleteElement);


            //Deleting Data From The Server
            axios
            .delete(API + '/produc-list/' + deleteElementID)
            .then(res => console.log(res))
            .catch(err => console.log(err))
        }
    }
    else if(e.target.classList.contains('edit')){
            if(confirm('Do You Want To Edit')){

                // find tr element of the clicked button
                const editElement = e.target.parentElement.parentElement;

                //selecting dataset's values
                const category = editElement.dataset.category;
                const id = editElement.dataset.id;

                // selecting the name and price element's value
                const name = editElement.querySelector('.Name').textContent;
                const price = editElement.querySelector('.Price').textContent;

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








