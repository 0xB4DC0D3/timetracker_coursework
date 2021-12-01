const { Records, Projects, Roles, Users } = require("../db/models");

class FunctionalController {
  async addRecord(req, res) {
    const { id } = req.user;

    const { projectId, recordDescription, dateFrom, dateTo, workHours } = req.body;
    if (!projectId || !recordDescription || !dateFrom || !dateTo || !workHours || !id) {
      return res.status(200).json({ error: "Невірні дані!" });
    }

    await Records.create({
      userId: id,
      projectId, 
      recordDescription,
      dateFrom, 
      dateTo, 
      workHours,
      isApproved: false
    });
    
    return res.status(200).json({ message: "Запис додано." });
  }

  async deleteRecord(req, res) {
    const { id } = req.user;

    const { recordId } = req.body;
    await Records.destroy({
      where: {
        userId: id,
        id: recordId
      }
    });

    return res.status(200).json({ message: "Запис видалено." });
  }

  async changeRecord(req, res) {
    const { id } = req.user;

    const { recordId, projectId, recordDescription, dateFrom, dateTo, workHours } = req.body;
    const record = await Records.findOne({
      where: {
        userId: id,
        id: recordId
      }
    });

    record.projectId = projectId;
    record.recordDescription = recordDescription;
    record.dateFrom = dateFrom;
    record.dateTo = dateTo;
    record.workHours = workHours;
    await record.save();

    return res.status(200).json({ message: "Запис змінено." });
  }

  async getRecordData(req, res) {
    const { projectId, recordDescription, dateFrom, dateTo, workHours } = await Records.findOne({
      where: {
        userId: req.user.id,
        id: req.body.recordId
      }
    });

    const { projectName } = await Projects.findOne({
      where: {
        id: projectId
      }
    });

    return res.status(200).json({ projectId, recordDescription, dateFrom, dateTo, workHours, projectName });
  }

  async getProjects(req, res) {
    return res.status(200).json((await Projects.findAll()).map(project => ({ id: project.id, projectName: project.projectName })));
  }

  async registerProject(req, res) {
    const { id } = req.user;
    const { projectName, payment } = req.body;

    const user = await Users.findOne({
      where: {
        id
      }
    });

    const roleName = (await Roles.findOne({ 
      where: {
        id: user.roleId
      }
    })).roleName;

    if (roleName !== "admin") {
      return res.status(200).json({ error: "Недостатньо прав." });
    }

    if (await Projects.create({
      projectName,
      payment,
      maxHours: 1337
    })) {
      return res.status(200).json({ message: "Проект зареєстровано!" });
    }
  }
};

module.exports = new FunctionalController();