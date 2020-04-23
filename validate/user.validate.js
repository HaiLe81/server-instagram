module.exports = {
  postCreate: (req, res, next) => {
    const userInput = req.body.name;
    var errors = [];
      if(!userInput){
        errors.push('User is required')
      }
      
      if(userInput.length > 30 || userInput.length < 2){
        errors.push('Greater than 2 characters and less than 30 chracters, Try again')
      }
      
      if(errors.length) {
        res.render("./users/createUser.pug", {
          errors: errors
        });
      }
    next()
  }
}