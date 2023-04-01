module.exports = {
  isAuthenticated: function(req, res, next) {
    const { user, device } = req.session;
    if (user && device === req.headers['user-agent']) {
      // User is authenticated and using the same device, proceed to next middleware
      next();
    } else {
      // User is not authenticated or using a different device, redirect to login page
      res.redirect('/login');
    }
  },

  // Define a middleware function to check if user is already logged in
  isAlreadyLoggedIn: function(req, res, next) {
    const { user, device } = req.session;
    if (user && device === req.headers['user-agent']) {
      // User is already logged in, redirect to home page
      res.redirect('/');
    } else {
      // User is not logged in, proceed to next middleware
      next();
    }
  }

}
