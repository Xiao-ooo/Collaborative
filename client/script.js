//creating glabal variable 

//using query selector is an easy way of selecting all img inside datatype tags
//all img are in menu section, now can be defined as menu items 
const menuItems = document.querySelectorAll("img[data-type]");
//get the id
const pizzaPan = document.getElementById("pizza-pan");
const clearBtn = document.getElementById("clear-btn");

//create new websocket, real time connection
let ws = new WebSocket("wss://collaborative-ievj.onrender.com");

//then go over each topping/base/sauce in menu
//when user clicks on the "menuItem", its gonna find which item then create an duplicate img
menuItems.forEach(item => {
    item.addEventListener("click", () => {
        const type = item.dataset.type;
        //so creating like a duplicate img and giving it new values
        const img = document.createElement("img");
        img.src = item.src;
        img.className = type;

        //then i wanted to structure in the center of the pizza pan
        //only if base/sauce/toppiing is selected, its going to be positioned in center
        if (type === "base" || type === "sauce" || type === "topping") {
            img.style.position = "absolute";
            img.style.top = "5%";
            img.style.left = "5%";
        }

        //duplicate of the clicked img is added into the pizzapan
        pizzaPan.appendChild(img);

        //sends the msg over to server of what just changed, added
        ws.send(JSON.stringify({
            type: "add",
            itemType: type,
            src: item.src
        }));
    });
});


//added an clear button, also usign event listener.
//when this is cliceked, its going to do ->
clearBtn.addEventListener("click", () => {
    //all duplicated img in the pizza pan is read and then removed
    pizzaPan.querySelectorAll("img").forEach(img => img.remove());
    ws.send(JSON.stringify({ type: "clear" }));
});

//this is where server recieves clients msg
//msg gets send back and forth whenever a change is done
ws.onmessage = event => {
    const msg = JSON.parse(event.data);

    //real time message shared, if another person add or delete something its going to send the message back to me
    if (msg.type === "add") {
        const img = document.createElement("img");
        img.src = msg.src;
        img.className = msg.itemType;

        img.style.position = "absolute";
        img.style.top = "5%";
        img.style.left = "5%";

        pizzaPan.appendChild(img);

    } else if (msg.type === "clear") {

        //other user action, shared back to me -> delete for all
        pizzaPan.querySelectorAll("img").forEach(img => img.remove());

    }
};
