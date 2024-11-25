const Tought = require("../models/Tought");
const User = require("../models/User");

const { Op } = require("sequelize");

module.exports = class ToughtController {
  static async showToughts(req, res) {
    let search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    let order = "DESC";

    if (req.query.order == "old") {
      order = "ASC";
    } else {
      order = "DESC";
    }

    const toughtsData = await Tought.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [["createdAt", order]],
    });

    const toughts = toughtsData.map((result) => result.get({ plain: true }));

    let toughtQty = toughts.length;

    if (toughtQty === 0) {
      toughtQty = false;
    }

    res.render("toughts/home.handlebars", { toughts, search, toughtQty });
  }

  static async dashboard(req, res) {
    const UserId = req.session.userid;

    const user = await User.findOne({
      where: { id: UserId },
      include: Tought,
      plain: true,
    });

    if (!user) {
      res.redirect("/login");
    }

    const toughts = user.Toughts.map((result) => result.dataValues);

    let emptyToughts = false;

    if (toughts.length === 0) {
      emptyToughts = true;
    }

    res.render("toughts/dashboard.handlebars", { toughts, emptyToughts });
  }

  static async createTought(req, res) {
    res.render("toughts/create.handlebars");
  }

  static async createToughtSave(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Tought.create(tought);

      req.flash("message", "Tought created successfully");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async removeTought(req, res) {
    const toughtId = req.body.id;
    const UserId = req.session.userid;

    try {
      await Tought.destroy({ where: { id: toughtId, UserId: UserId } });
      req.flash("message", "Tought removed successfully");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async updateTought(req, res) {
    const toughtId = req.params.id;

    const tought = await Tought.findOne({
      where: { id: toughtId },
      raw: true,
    });

    console.log(tought);

    res.render("toughts/edit.handlebars", { tought });
  }

  static async updateToughtSave(req, res) {
    const toughtId = req.body.id;
    const title = req.body.title;

    try {
      await Tought.update({ title }, { where: { id: toughtId } });

      req.flash("message", "Tought updated successfully");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }
};
