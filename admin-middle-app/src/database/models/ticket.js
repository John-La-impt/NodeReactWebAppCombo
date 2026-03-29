module.exports = (db, DataTypes) =>
  db.define("ticket", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        primaryKey: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: db.user,
          key: "id"
        }
    },
    _sessionId: {
        type: DataTypes.INTEGER,
        // primaryKey: false,
        allowNull: false,
        references: {
            model: db._session,
            key: "id"
        }
    },
    dateReserved: {
        type: DataTypes.DATEONLY,
        primaryKey: false
    }
    // foreign key _sessionId, userId
  }, {
    updatedAt: true,
    createdAt: true
  });
