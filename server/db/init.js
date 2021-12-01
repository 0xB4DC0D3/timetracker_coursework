const { Roles, Users, Projects, Records, Tokens } = require("./models");
const md5 = require("md5");

const init = async () => {
  try {
    await Roles.sync();
    await Projects.sync();
    await Users.sync();
    await Records.sync();
    await Tokens.sync();

    await Roles.findOrCreate({
      where: {
        roleName: "admin"
      },
      defaults: {
        roleName: "admin"
      }
    });

    await Roles.findOrCreate({
      where: {
        roleName: "accountant"
      },
      defaults: {
        roleName: "accountant"
      }
    });

    await Roles.findOrCreate({
      where: {
        roleName: "user"
      },
      defaults: {
        roleName: "user"
      }
    });

    await Users.findOrCreate({
      where: {
        email: "admin@admin.admin"
      },
      defaults: {
        email: "admin@admin.admin",
        password: md5("Admin123" + "960ab9a87"),
        roleId: (await Roles.findOne({ where: { roleName: "admin" } })).id,
        fullName: "Адміністратор"
      }
    });

    await Users.findOrCreate({
      where: {
        email: "accountant@admin.admin"
      },
      defaults: {
        email: "accountant@admin.admin",
        password: md5("Accountant123" + "960ab9a87"),
        roleId: (await Roles.findOne({ where: { roleName: "accountant" } })).id,
        fullName: "Бухгалтер"
      }
    });

    await Users.findOrCreate({
      where: {
        email: "user2@admin.admin"
      },
      defaults: {
        email: "user2@admin.admin",
        password: md5("User1234" + "960ab9a87"),
        roleId: (await Roles.findOne({ where: { roleName: "user" } })).id,
        fullName: "Користувач",
        projectId: (await Projects.findOne({ where: { projectName: "UserProject1" } })).id
      }
    });

    await Users.findOrCreate({
      where: {
        email: "user3@admin.admin"
      },
      defaults: {
        email: "user3@admin.admin",
        password: md5("User1234" + "960ab9a87"),
        roleId: (await Roles.findOne({ where: { roleName: "user" } })).id,
        fullName: "Користувач",
        projectId: (await Projects.findOne({ where: { projectName: "UserProject1" } })).id
      }
    });

    await Users.findOrCreate({
      where: {
        email: "user4@admin.admin"
      },
      defaults: {
        email: "user4@admin.admin",
        password: md5("User1234" + "960ab9a87"),
        roleId: (await Roles.findOne({ where: { roleName: "user" } })).id,
        fullName: "Користувач",
        projectId: (await Projects.findOne({ where: { projectName: "UserProject1" } })).id
      }
    });

    await Users.findOrCreate({
      where: {
        email: "user5@admin.admin"
      },
      defaults: {
        email: "user5@admin.admin",
        password: md5("User1234" + "960ab9a87"),
        roleId: (await Roles.findOne({ where: { roleName: "user" } })).id,
        fullName: "Користувач",
        projectId: (await Projects.findOne({ where: { projectName: "UserProject1" } })).id
      }
    });

    await Projects.findOrCreate({
      where: {
        projectName: "UserProject1"
      },
      defaults: {
        projectName: "UserProject1",
        payment: 3,
        maxHours: 8
      }
    });
    await Users.findOrCreate({
      where: {
        email: "user@admin.admin"
      },
      defaults: {
        email: "user@admin.admin",
        password: md5("User1234" + "960ab9a87"),
        roleId: (await Roles.findOne({ where: { roleName: "user" } })).id,
        fullName: "Користувач",
        projectId: (await Projects.findOne({ where: { projectName: "UserProject1" } })).id
      }
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = init;