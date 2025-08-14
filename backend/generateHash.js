import bcrypt from "bcryptjs";

const password = "123"; // change to your desired password

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed password:", hash);
});
