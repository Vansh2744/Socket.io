const socket = io();

// socket.emit("msg", "Welcome to Socket.io part");

// socket.on("msg", (msg) => {
//   console.log(msg);
// });

// using callbacks-:
// socket.emit("msg", "How are You brother", (res) => {
//   console.log(res.status);
//   console.log(socket.id);
// });

const btn = document.querySelector(".btn");
const enter = document.querySelector(".enter");
const username = document.querySelector("#username");
const chat = document.querySelector("#chat");
const listItems = document.querySelector(".listItems");

document.querySelector(".container").classList.add("hide");
listItems.classList.add("hide");

enter.addEventListener("click", () => {
  document.querySelector(".userDetails").classList.add("hide");
  document.querySelector(".container").classList.remove("hide");
  listItems.classList.remove("hide");
  socket.emit("user", username.value);
});

btn.addEventListener("click", () => {
  socket.emit("msg", chat.value, username.value);
  chat.value = "";
});

socket.on("chat", (chat) => {
  const list = document.createElement("li");
  list.innerText = `${chat.username}:${chat.msg}`;
  listItems.appendChild(list);
});

socket.on("joinUser", (user) => {
  const p = document.createElement("p");
  p.innerText = `${user} has been joined chat`;
  listItems.appendChild(p);
});

socket.on("disconnectUser", (user) => {
  const p = document.createElement("p");
  p.innerText = `${user} has been disconnected`;
  listItems.appendChild(p);
});

socket.on("activeUser", (active) => {
  const p = document.createElement("p");
  p.innerText = `Active Users : ${active}`;
  listItems.appendChild(p);
});
