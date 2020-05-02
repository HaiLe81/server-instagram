module.exports = {
  error: (error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }
    console.log('ss',res.headerSent)
    return res.status(500).render("error/500", {
      message: error ? error.message : "Internal server error"
    });
  }
};
