module.exports = (sequelize, DataTypes) =>
  sequelize.define("ticket", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        primaryKey: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: sequelize.user,
        key: "id"
      }
    },
    _sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: sequelize._session,
        key: "id"
      }
    },
    dateReserved: {
        type: DataTypes.DATEONLY,
        primaryKey: false
    }
    // foreign key sessionId, userId
  }, {
    updatedAt: true,
    createdAt: true
  });
