const { DataTypes, Deferrable } = require("sequelize");
const db = require("./connection");

const Roles = db.define("Roles", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  roleName: {
    type: DataTypes.STRING(32),
    allowNull: false,
    unique: true
  },
}, {
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

const Projects = db.define("Projects", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  }, 
  projectName: {
    type: DataTypes.STRING(32),
    allowNull: false,
    unique: true
  },
  payment: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  maxHours: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

const Users = db.define("Users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING(96),
    allowNull: false
  },
  roleId: {
    type: DataTypes.UUID,
    references: {
      model: Roles,
      key: "id",
      deferrable: Deferrable.INITIALLY_IMMEDIATE
    },
    allowNull: false
  },
  projectId: {
    type: DataTypes.UUID,
    references: {
      model: Projects,
      key: "id",
      deferrable: Deferrable.INITIALLY_IMMEDIATE
    },
    allowNull: true
  }
}, {
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

const Records = db.define("Records", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  projectId: {
    type: DataTypes.UUID,
    references: {
      model: Projects,
      key: "id",
      deferrable: Deferrable.INITIALLY_IMMEDIATE
    },
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: Users, 
      key: "id",
      deferrable: Deferrable.INITIALLY_IMMEDIATE
    },
    allowNull: false
  },
  recordDescription: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  dateFrom: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dateTo: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  workHours: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
}, {
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

const Tokens = db.define("Tokens", {
  refreshToken: {
    type: DataTypes.STRING(1024),
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: Users,
      key: "id",
      deferrable: Deferrable.INITIALLY_IMMEDIATE
    },
    allowNull: false,
    unique: true
  }
}, {
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

module.exports = { Roles, Users, Projects, Records, Tokens };