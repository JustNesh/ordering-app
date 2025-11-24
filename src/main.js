import menuArray from './data.js'
import {generateUUID, randomizeBetweenNumberToChar} from './helperFunctions.js';
const DISCOUNT = .2;
const userCheckoutModal = document.getElementById("user-checkout-modal");
const orderInfoContainerEl = document.getElementById("order-info-container");
let orderArray = [];
let isAllowedToPay = false;
let totalCost = 0;
let burgerPizzaBeerDiscount = false;

document.addEventListener("click",(event)=>{
    if(event.target.dataset.food){
        handleAddItem(event)
    } else if(event.target.dataset.foodUuid){
        handleRemoveItem(event)
    } else if(event.target.id === "complete-order-btn"){
        document.querySelector("form").classList.remove("hidden");
    } else if (!userCheckoutModal.classList.contains("hidden") && !userCheckoutModal.contains(event.target)){
        userCheckoutModal.classList.toggle("hidden")
    }
})

document.querySelector("form").addEventListener("submit",(e)=>{
    e.preventDefault()
    if(isAllowedToPay){
        const fName = document.getElementById("full-name").value.split(" ")[0];
        document.querySelector("form").classList.add("hidden");
        orderInfoContainerEl.innerHTML = `
            <div class="thank-you">Thanks, ${fName}! Your order is on its way!</div>
        `
    }
})

document.addEventListener("input", (event)=>{
    const eventId = event.target.id;
    //Ensures that only numbers can be placed into the field

    if (eventId === "card-number" || eventId === "cvv"){
        event.target.value = event.target.value.replace(/\D/g,"");
    } else if (eventId ==="full-name"){
        event.target.value = event.target.value.replace(/\d/g,"");
    }
    if(eventId === "card-number"){
        //Seperates the card number with dashes for readability
        event.target.value = event.target.value.split("").map((currentChar,i)=>{
            if(i === 4 || i===8|| i===12 ){
                return `-${currentChar}`
            }
            return currentChar
        }).join("");
    }

    //Checks if the user has properly filled out the form before allowing submission
    if(document.querySelector("#card-number").value.length === 19 &&
       document.querySelector("#cvv").value.length === 3 &&
       document.querySelector("#full-name").value.length > 0){
        isAllowedToPay=true
        document.querySelector("#pay-btn").removeAttribute("disabled");
       } else {
        isAllowedToPay=false
        document.querySelector("#pay-btn").setAttribute("disabled","disabled");
       }
})

// Plus button functionality
function handleAddItem(event){
    const menuItemToAdd = menuArray.filter((current)=>current.name === event.target.dataset.food)[0];
    orderArray.push({
        ...menuItemToAdd,
        uuid:generateUUID()
    })
    console.log(orderArray)
    renderOrders()
}

//Remove button functionality
function handleRemoveItem(event){
    const uuidToRemove = event.target.dataset.foodUuid;
    orderArray = orderArray.filter((current)=>current.uuid!=uuidToRemove);
    renderOrders()
}

//Renders orders onto the screen from the global orderArray variable
function renderOrders(){
    const itemsPricesContainer = document.getElementById("items-prices-container");
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
    totalCost = orderArray.reduce((acc,current)=>acc + current.price,0) || 0;
    handleDiscount()
    if(burgerPizzaBeerDiscount){
        orderArrayHtml+=`
            <div class="inner-item-prices-container">
                <p class="item">Bundle discount</p>
                <p class="price">-$${((menuArray[0].price + menuArray[1].price + menuArray[2].price) * DISCOUNT).toFixed(2)}</p>
            </div>
        `
    }
    itemsPricesContainer.innerHTML = orderArrayHtml;
    renderTotalCost()
}

//Renders total cost onto the screen from the totalCost variable
function renderTotalCost(){
    const priceEl = document.getElementById("total-price-value");
    priceEl.textContent = "$"+totalCost;
}

// Determines if the user has selected all 3 items and applies the bundle
function handleDiscount(){
    const containsPizza = orderArray.filter((item)=>item.name === "Pizza").length > 0;
    const containsHamburger = orderArray.filter((item)=>item.name === "Hamburger").length > 0;
    const containsBeer = orderArray.filter((item)=>item.name === "Beer").length > 0;

    console.log(containsHamburger)
    console.log(containsPizza)
    if(containsBeer && containsHamburger && containsPizza){
        burgerPizzaBeerDiscount = true;
        totalCost =  ((totalCost - (menuArray[0].price + menuArray[1].price + menuArray[2].price) + ((menuArray[0].price + menuArray[1].price + menuArray[2].price) * (1-DISCOUNT)))).toFixed(2)
    } else {
        burgerPizzaBeerDiscount = false;
    }
}

// Renders the menu from menyArray on load.
function renderMenuArray(){
    const outerItemsContainer = document.getElementById("outer-items-container");
    let menuItemsHtml = ""; 
    menuArray.forEach((current)=>{
        menuItemsHtml+= `
            <div class="items-container">
            <img class="icon" src="/images/${current.name.toLowerCase()}.png" alt="photo of ${current.name}" />
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