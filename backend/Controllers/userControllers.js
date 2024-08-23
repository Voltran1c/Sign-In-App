import bcrypt from "bcrypt";
import User from "../models/userModels.js";

const saltRounds = 10;

const signin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  User.findOne({ username })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: "Error hashing password" });
        }

        const newUser = new User({ username, password: hashedPassword });

        newUser
          .save()
          .then((user) => {
            console.log("User signed in:", user);
            res.status(201).json({ message: "User created successfully" });
          })
          .catch((err) => {
            console.error("Error creating user:", err);
            res
              .status(400)
              .json({ error: err.message || "Error creating user" });
          });
      });
    })
    .catch((err) => {
      console.error("Error checking for existing user:", err);
      res.status(500).json({ error: "Error checking for existing user" });
    });
};

export default signin;
