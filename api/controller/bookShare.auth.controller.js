const shortid = require("shortid");
var User = require("../../model/shareBook.user.model");

module.exports = {
  postLogin: async (req, res) => {
    const { email, password } = req.body;
    try {
      if(!email || !password ) {
        throw new Error("username or passwrod is required!");
      }
      const user = await User.findOne({ email })
      if (!user) {
        throw new Error("email incorrect!");
      } 
      if(user.password !== password){
        throw new Error("password incorrect!")
      } else {
        user.save();
        res.status(200).json({
          message: "You have successfully logged in",
          user: user
        });
      }
      
    } catch ({ message = "Invalid request" }) {
      return res.status(400).send({ message });
    }
  },
  register: async (req, res) => {
    const id = shortid.generate();
      const { name, email, password } = req.body;
    try {
      if(!name || !email || !password){
        throw new Error("please check again")
      }
      const user = await User.findOne({ email })
      if(user){
        throw new Error("The email already exist. Please use a different email")
      }
      const newAcc = new User({
        id: id,
        name: name,
        email: email,
        password: password
      })
      newAcc.save();
      res.status(200).json({ message: "Signup successfully" })
    } catch({ message = "Invalid request" }){
      res.status(400).json({ message })
    }
  }
};
