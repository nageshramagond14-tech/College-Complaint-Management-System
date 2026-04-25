const departmentMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'department') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin or Department privileges required.'
    });
  }
  next();
};

module.exports = departmentMiddleware;
