const socket = io();

var username;
var chats = document.querySelector(".chats");
var usersList = document.querySelector(".users-list");
var usersCount = document.querySelector(".users-count");
var msgSend = document.querySelector("#user-send");
var userMsg = document.querySelector("#user-msg");

do{
    username = prompt("Enter your name: ");
}while(!username);

// it will call when user will join
socket.emit("new-user-joined", username);


// notifying that user is joined
socket.on("user-connected", (socket_name) => {
    userJoinLeft(socket_name, 'joined');
})


// function to create joined/left status div
function userJoinLeft(name, status) {
    let div = document.createElement('div');
    div.classList.add('user-join');
    let content = `<p><b>${name}</b> ${status} the chat</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}


// notifying that user has left
socket.on("user-disconnected", (user) => {
    userJoinLeft(user, "Left");
})



// for updating users list and user counts
socket.on("user-list", (users) => {
    usersList.innerHTML = "";
    users_arr = Object.values(users);
    for(i=0;i<users_arr.length;i++){
        let p = document.createElement('p');
        p.innerHTML = users_arr[i];
        usersList.appendChild(p);
    }
    usersCount.innerHTML = users_arr.length;
})



// for sending message
msgSend.addEventListener('click', () => {
    let data = {
        user: username,
        msg: userMsg.value
    }

    if(userMsg.value != ""){
        appendMessage(data, "outgoing");
        socket.emit("message", data);
        userMsg.value = "";
    }
})


function appendMessage(data, status) {
    let div = document.createElement('div');
    div.classList.add("message", status);
    let content = `
        <h5>${data.user}</h5>
        <p>${data.msg}</p>
    `;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
};


socket.on("message", (data) => {
    appendMessage(data, "incoming");
})
