module.exports = (sequelize, DataTypes) =>
  sequelize.define("review", {
    rating: {
        type: DataTypes.INTEGER,
        primaryKey: false
    },
    content: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: sequelize.user,
        key: "id"
      }
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: sequelize.movie,
        key: "id"
      }
    },
    blocked: {
      type: DataTypes.BOOLEAN
    }
    // foreign key movieId, userId
  }, {
    updatedAt: true,
    createdAt: false
  });
