const setLocals = (req, res, next) => {
  res.locals.currentPath = req.path;
  next();
};
module.exports = setLocals