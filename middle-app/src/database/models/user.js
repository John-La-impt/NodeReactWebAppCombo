module.exports = (sequelize, DataTypes) =>
  sequelize.define("user", {
    // id is created automatically, is primary key and auto incremnet and is of type INTEGER
    email: {
        type: DataTypes.STRING(255),
        primaryKey: false
    },
    passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    reserves: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    blocked: {
        type: DataTypes.BOOLEAN
    },
    deleted: {
        type: DataTypes.BOOLEAN
    }
  }, {
    updatedAt: true,
    createdAt: false
  });
