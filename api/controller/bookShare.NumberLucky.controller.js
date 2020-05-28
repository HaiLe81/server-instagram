const shortid = require("shortid");
var Number = require("../../model/shareBook.NumberLucky.model");

module.exports = {
  index: async (req, res) => {
    try {
      await Number.find().then((doc) => {
        return res.status(200).json({
          numbers: doc,
          message: "get users success!",
        });
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).send({ message });
    }
  },
  createNumber: async (req, res) => {
    const id = shortid.generate();
    const { userId, email } = req.body;
    if (!userId || !email) throw new error("userId or email required!");
    try {
      const number = Math.floor(Math.random() * 100);
      const newNumber = new Number({
        id: id,
        byUser: userId,
        email: email,
        numberLucky: number,
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
    const { bookId } = req.body;
    console.log('xx', bookId)
    try {
      if (!bookId) throw new error("bookId is required!");
      const number = Math.floor(Math.random() * 100);
      await Number.find().then((doc) => {
        if (!doc) return res.status(200).json({ message: "Not Found User" });
        // find user have lucky number equal random number
        const result = doc.find((item) => item.numberLucky === number);
        console.log('z', result)
        if (!result) {
          return res.status(200).json({ message: "Không Có Người May Mắn!" });
        }

        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: result.email,
          from: "nguyenvy3681@gmail.com",
          subject: "Lucky Number To Recieve Books",
          text: `Lucky Number For Your is: ${bookId}`,
          html: `Lucky Number For Your is: ${bookId}`,
        };
        sgMail.send(msg).then(
          () => {},
          (error) => {
            console.error(error);

            if (error.response) {
              console.error(error.response.body);
            }
          }
        );
        console.log("z1", result);
        return res
          .status(200)
          .json({ message: "Đã Có Người May Mắn Nhận Thưởng", user: result });
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).send({ message });
    }
  },
};
