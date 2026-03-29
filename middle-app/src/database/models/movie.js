module.exports = (sequelize, DataTypes) =>
  sequelize.define("movie", {
    // id: {
    //     type: DataTypes.STRING(255),
    //     primaryKey: true
    // },
    name: {
        type: DataTypes.STRING(255),
        primaryKey: false
    },
    synopsis: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    imgUrl: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rating: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    runtime: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    view: {
        type: DataTypes.INTEGER
    }
  }, {
    updatedAt: true,
    createdAt: false
  });
