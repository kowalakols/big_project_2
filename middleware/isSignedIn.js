// This middelware function will deny access to any unauthenticed user
// How it does this, is it checks the req.session.user
// 1. If it's defined, the user is signed in and access is allowed
// 2. If it's undefined, the user is not signed in and we will redirect away

export default function isSignedIn(req, res, next) {
    if (req.session.user) {
      return next() // By returning next() we allow the request to move onto the dedicated control for the route specified
    }
    return res.redirect('/auth/sign-in')
  }