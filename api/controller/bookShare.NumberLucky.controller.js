const sgMail = require("@sendgrid/mail");
const shortid = require("shortid");
var Number = require("../../model/shareBook.NumberLucky.model");

module.exports = {
  index: async (req, res) => {
    try {
      await Number.find().then(doc => {
        return res.status(200).json({
          numbers: doc,
          message: "get users success!"
        });
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).send({ message });
    }
  },
  createNumber: async (req, res) => {
    const id = shortid.generate();
    const { userId } = req.body;
    try {
      const number = Math.floor(Math.random() * 100);
      const newNumber = new Number({
        id: id,
        byUser: userId,
        numberLucky: number
      });
      newNumber.save();
      return res
        .status(200)
        .json({ message: "Register Lucky Number Success!", number: newNumber });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).send({ message });
    }
  },
  randomLuckyNumber: async (req, res) => {
    const { email } = req.body;
    try {
      const number = Math.floor(Math.random() * 100);
      const sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: email,
        from: "nguyenvy3681@gmail.com",
        subject:
          "Lucky Number To Recieve Books",
        text:
          `Lucky Number For Your is: ${number}`,
        html:
          `Lucky Number For Your is: ${number}`,
      };
      sgMail.send(msg).then(
        () => {},
        error => {
          console.error(error);

          if (error.response) {
            console.error(error.response.body);
          }
        }
      );
    } catch ({ message = "Invalid request" }) {
      return res.status(400).send({ message });
    }
  }
};
