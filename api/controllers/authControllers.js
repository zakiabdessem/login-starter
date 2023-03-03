require("dotenv").config();

const user = require("../models/user");
const validation = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createJwtToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET, {
    expiresIn: 300,
  });
};

module.exports.post_signUp = async (req, res) => {
  const { email, password } = req.body;

  /* validate email and password */
  const { error: emailError } = validation.emailValidation({ email: email });
  if (emailError) return res.status(400).json({ error: emailError.message });

  const { error: passwordError } = validation.passwordValidation({
    password: password,
  });
  if (passwordError)
    return res.status(400).json({ error: passwordError.message });

  /* Check if user already exists */
  const duplicate = await user.findOne({ email: email });
  if (duplicate)
    return res.status(403).json({ error: "Email already registred" });

  try {
    /* hash password */
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    /* Save user to DB */
    const User = await user.create({
      email: email,
      password: hashedPassword,
    });

    const payload = {
      id: User._id,
      email: User.email,
    };

    const token = createJwtToken(payload);

    //res.json(User) for testing purposes
    res.cookie("jwt", token, { httpOnly: false, maxAge: 300 * 1000 });
    res.status(200).json({ user: User._id });
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: "an error has occurred check API" });
  }
};

module.exports.post_login = async (req, res) => {
  const { email, password } = req.body;

  /* validate email */
  const { error: emailError } = validation.emailValidation({ email: email });
  if (emailError) return res.status(400).json({ error: emailError.message });
  const User = await user.findOne({ email }).select("+password");

  // return if there was no user with this username found in the database
  if (!User)
    return res.status(400).json({ error: "Email or password is wrong" });

  const isMatch = await bcrypt.compare(password, User.password);

  // return 400 if password does not match
  if (!isMatch)
    return res.status(400).json({ error: "Email or password is wrong" });

  const payload = {
    id: User._id,
    email: User.email,
  };
try{
  const token = createJwtToken(payload);

  //res.json(User) for testing purposes
  res.cookie("jwt", token, { httpOnly: false, maxAge: 300 * 1000 });
  res.status(200).json({ user: User._id, auth: true });
}catch(e){
console.log(e)
}
 
};
module.exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    res.status(200).json(decoded);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
