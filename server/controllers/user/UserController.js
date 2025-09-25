class UserController {
    welcome = (req, res) => {
        res.status(200).json({
            "DEUX" : "WELCOME"
        });
    }
}

export default new UserController();