const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login.handlebars");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body

    const VerifyIfUserExist = await User.findOne({where: { email }})

    if(!VerifyIfUserExist) {
      req.flash("message", "User does not exist");
      return res.render("auth/login");
    }

    if(!bcrypt.compareSync(password, VerifyIfUserExist.password)){
      req.flash("message", "Incorrect password");
      return res.render("auth/login");
    }

    req.session.userid = VerifyIfUserExist.id;

    req.flash("message", "Logged in successfully");
    
    req.session.save(() => {
      res.redirect("/");
    });
  }

  static register(req, res) {
    res.render("auth/register.handlebars");
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;
    
    if(password !== confirmpassword) {
      req.flash("message", "Passwords don't match");
      return res.render("auth/register");
    }

    const checkIfUserExists = await User.findOne({ where: { email } });

    if(checkIfUserExists) {
      req.flash("message", "Email already exists");
      return res.render("auth/register");
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    try {
      const user = await User.create({ name, email, password: hash });

      req.session.userid = user.id;

      req.flash("message", "User created successfully");

      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/");
    });
  }
};
