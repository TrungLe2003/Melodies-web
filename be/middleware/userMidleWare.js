const UserMidleware = {
  register: (req, res, next) => {
    try {
      // kiểm tra xem đã gửi name và email lên chưa
      const { email, password, phoneNumber } = req.body;
      if (!email) throw new Error("Email is missing!");
      if (!password) throw new Error("Password is missing!");
      if (!phoneNumber) throw new Error("Phone number is missing!");
      return next();
      // code phía dưới đây không được đọc nữa.
    } catch (error) {
      res.status(403).send({
        message: error.message,
      });
    }
  },
  authorize: (roles) => (req, res, next) => {
    // Lấy token từ headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    try {
      // Giải mã token để lấy payload
      const decoded = jwt.verify(token, SECRET_KEY);

      // Kiểm tra role có nằm trong danh sách vai trò cho phép không
      if (!roles.includes(decoded.role)) {
        return res.status(403).send({ message: "Forbidden" });
      }

      // Lưu thông tin user vào req để sử dụng trong các handler khác (nếu cần)
      req.user = decoded;

      next();
    } catch (error) {
      return res.status(403).send({ message: "Token is invalid" });
    }
  },
};

export default UserMidleware;
