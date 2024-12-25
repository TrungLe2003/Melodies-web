import { Router } from "express";
import userController from "../../../controllers/user/userController.js";
import UserMidleware from "../../../middleware/userMidleWare.js";
const UserRouter = Router();

UserRouter.post("/register", UserMidleware.register, userController.register);
UserRouter.post("/logIn", userController.logIn);

//chỉnh sửa thông tin cá nhân
UserRouter.put("/update", userController.addUserDetail);
//sửa password
UserRouter.put("/changePassword", userController.changePassword);
//
UserRouter.get("", userController.getUserList);
UserRouter.get("/details", userController.getUserDetails);
//nâng cấp lên artist
UserRouter.put("/become-artist", userController.becomeArtist);
//Tìm kiếm bài hát, artist, album (search)
UserRouter.get("/search", userController.searchingInformation);
//thêm tên không dấu, dấu cách, bỏ hoa thường cho data cũ
UserRouter.put(
  "/addNormalizedName",
  userController.updatedNormalizedNameForDatabase
);

export default UserRouter;
