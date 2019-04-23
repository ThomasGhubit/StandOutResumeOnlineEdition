// sign out interface
const signOut = (ctx) => {
  ctx.session = null;
  ctx.redirect('/');
};

module.exports = {
  'GET /signout': signOut
};