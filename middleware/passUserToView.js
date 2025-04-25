function passUserToView(req, res, next){
    // Add the req.session.user to every locals object under the key "user"
    res.locals.user = req.session.user
  
    // At the end of the function, run next to move onto the final route/controller
    return next()
  }
  
  export default passUserToView