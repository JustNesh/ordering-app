import menuArray from './data.js'
import {generateUUID, randomizeBetweenNumberToChar} from './helperFunctions.js';
let orderArray = [];

document.addEventListener("click",(event)=>{
    if(event.target.dataset.food){
        handleAddItem(event)
    } else if(event.target.dataset.foodUuid){
        handleRemoveItem(event)
    } else if(event.target.id === "complete-order-btn"){
        document.querySelector("form").classList.remove("hidden");
    } else if(event.target.id === "pay-btn"){
        const fName = document.getElementById("full-name").value.split(" ")[0];
        document.querySelector("form").classList.add("hidden");
        alert(`Thanks ${fName}!`)
    }
})

function handleAddItem(event){
    const menuItemToAdd = menuArray.filter((current)=>current.name === event.target.dataset.food)[0];
    orderArray.push({
        ...menuItemToAdd,
        uuid:generateUUID()
    })
    console.log(orderArray)
    renderOrders()
}

function handleRemoveItem(event){
    const uuidToRemove = event.target.dataset.foodUuid;
    orderArray = orderArray.filter((current)=>current.uuid!=uuidToRemove);
    renderOrders()
}

function renderOrders(){
    const orderInfoContainerEl = document.getElementById("order-info-container");
    const itemsPricesContainer = document.getElementById("items-prices-container");
    const priceEl = document.getElementById("total-price-value");

    orderArray.length < 1 ? orderInfoContainerEl.classList.add("hidden"): orderInfoContainerEl.classList.remove("hidden")
    let orderArrayHtml = "";
    orderArray.forEach((current)=>{
        orderArrayHtml += `
            <div class="inner-item-prices-container">
                <p class="item">${current.name}</p>
                <button class="remove-btn" data-food-uuid="${current.uuid}">remove</button>
                <p class="price">$${current.price}</p>
            </div>
            `
    })
    itemsPricesContainer.innerHTML = orderArrayHtml
    priceEl.textContent = "$"+(orderArray.reduce((acc,current)=>acc + current.price,0) || 0)
}

function renderMenuArray(){
    const outerItemsContainer = document.getElementById("outer-items-container");
    let menuItemsHtml = ""; 
    menuArray.forEach((current)=>{
        menuItemsHtml+= `
            <div class="items-container">
            <img class="icon" src="./public/${current.name.toLowerCase()}.png" alt="photo of ${current.name}" />
            <div class="food-information">
              <h3 class="food">${current.name}</h3>
              <p class="ingredients">${current.ingredients.join(", ")}</p>
              <p class="item-price">$${current.price}</p>
            </div>
            <button data-food="${current.name}" class="add-item">+</button>
          </div>
          <div class="item-seperator"></div>
        `
    });
    outerItemsContainer.innerHTML += menuItemsHtml 
}


renderMenuArray()
renderOrders()
randomizeBetweenNumberToChar()