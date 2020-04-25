const db = require('../db')

module.exports = {
  requireAuth: (req, res, next) => {
    if(!req.signedCookies.userId){
      res.redirect('/auth/login')
      return;
    }
    const user = db.get('listUser').find({ id: req.signedCookies.userId }).value()
    if(!user) {
      res.redirect('/auth/login')
      return;
    }
    let pageCurrent = parseInt(req.query.page)
    res.locals.page_Current = pageCurrent
    
    next()
  }
};
