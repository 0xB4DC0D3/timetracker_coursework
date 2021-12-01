const { Roles, Users, Projects, Records } = require("../db/models");
const { Op } = require("sequelize");
const Promise = require('bluebird');

class UserController {
  async getUserRole(req, res) {
    const { id } = req.user;
    if (id) {
      const user = await Users.findOne({ where: { id } });
      const roleName = (await Roles.findOne({ where: { id: user.roleId } })).roleName;
      return res.status(200).json({ roleName });
    } 

    return res.status(200).json({ error: "Такого користувача нема!" });
  }

  async getUserProjects(req, res) {
    const project = await Projects.findOne({
      where: {
        id: (await Users.findOne({
          where: {
            id: req.user.id
          }
        })).projectId
      }
    });

    if (!project) {
      return res.status(200).json({ error: "У даного користувача нема проекта!" });
    }

    return res.status(200).json({
      value: project.id,
      label: project.projectName
    });
  }

  async getUserRecords(req, res) {
    const records = await Records.findAll({
      where: {
        userId: req.user.id
      }
    });

    if (!records) {
      return res.status(200).json([{
        projectName: "", 
        workHours: "",
        isApproved: false,
        workDescription: "", 
        dateFrom: "",
        dateTo: ""
      }]);
    }

    return res.status(200).json(await Promise.map(records, (async record => ({
      recordId: record.id,
      projectId: (await Projects.findOne({ where: { id: record.projectId } })).id,
      projectName: (await Projects.findOne({ where: { id: record.projectId } })).projectName, 
      workHours: record.workHours,
      isApproved: record.isApproved,
      workDescription: record.recordDescription, 
      dateFrom: record.dateFrom,
      dateTo: record.dateTo
    }))));
  }

  async getUsers(req, res) {
    const users = await Users.findAll({
      where: {
        roleId: (await Roles.findOne({ where: { roleName: "user" } })).id
      }
    });

    return res.status(200).json(await Promise.map(users, async user => {
      const { projectName } = await Projects.findOne({ where: { id: user.projectId } });
      
      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        projectName
      };
    }));
  }

  async getUserSalary(req, res) {
    const { userId, projectId } = req.body;

    const project = await Projects.findOne({
      where: {
        id: projectId
      }
    });

    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    firstDay.setHours(firstDay.getHours() + 2);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    lastDay.setHours(lastDay.getHours() + 2 + 24);

    const records = await Records.findAll({
      where: {
        userId,
        projectId,
        dateFrom: {
          [Op.between]: [firstDay.toLocaleString('en-US', {
            timeZone: 'Europe/Kiev'
          }), lastDay.toLocaleString('en-US', {
            timeZone: 'Europe/Kiev'
          })]
        },
        dateTo: {
          [Op.between]: [firstDay.toLocaleString('en-US', {
            timeZone: 'Europe/Kiev'
          }), lastDay.toLocaleString('en-US', {
            timeZone: 'Europe/Kiev'
          })]
        }
      }
    });

    if (!records.length) {
      return res.status(200).json({ salary: 0.0 });
    }
    
    const workHours = records.map(e => e.workHours).reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    return res.status(200).json({ salary: workHours * project.payment });
  }
};

module.exports = new UserController;