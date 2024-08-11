const express = require("express");
const path = require("path");
require("dotenv").config();
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

const port = process.env.PORT;
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "./public")));

const io = new Server(httpServer);

let userDetails = {};

io.on("connection", (socket) => {
  // socket.on("msg", (msg) => {
  //   console.log(msg);
  // });

  // socket.emit("msg", "Thankyou");

  // using callbacks-:
  //   socket.on("msg", (msg, ack) => {
  //     console.log(msg);
  //     ack({
  //       status: "success",
  //     });
  //     console.log(socket.id);
  //   });

  socket.on("user", (username) => {
    userDetails[socket.id] = username;
    socket.broadcast.emit("joinUser", userDetails[socket.id]);
    let active = [];
    for (let i in userDetails) {
      active.push(userDetails[i]);
    }
    io.emit("activeUser", active);
  });

  socket.on("msg", (msg) => {
    socket.broadcast.emit("chat", {
      // send message to everyone except the one you send it
      msg: msg,
      username: userDetails[socket.id],
    });

    // send message to every client connected to the server-:
    // io.emit("chat", {
    //   msg: msg,
    //   username: userDetails[socket.id],
    // });
  });

  socket.on("disconnect", () => {
    let user = userDetails[socket.id];
    if (user) {
      let active = [];
      delete userDetails[socket.id];
      socket.broadcast.emit("disconnectUser", user);
      for (let i in userDetails) {
        active.push(userDetails[i]);
      }
      io.emit("activeUser", active);
    }
  });
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

httpServer.listen(port, () => {
  console.log(`listening to port ${port}`);
});
