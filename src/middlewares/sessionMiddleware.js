// Middleware theo dõi và quản lý phiên làm việc Stateless trên Cloud
module.exports = (req, res, next) => {
  if (req.session) {
    // Đếm số lượt truy cập trong phiên làm việc
    req.session.views = (req.session.views || 0) + 1;
    req.session.lastAccess = new Date().toISOString();
  }
  next();
};
