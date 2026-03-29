module.exports = (sequelize, DataTypes) =>
  sequelize.define("_session", {
    // id is declared below instead of created automatically
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sessionDate: {
        type: DataTypes.DATEONLY,
        primaryKey: false
    },
    sessionTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    movieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.movie,
          key: "id"
        }
    },
    seats: {
        type: DataTypes.STRING(255),
        allowNull: true
        // s0=0-s1=0-s2=0-s3=0-s4=0-s5=0-s6=0-s7=0-s8=0-s9=0
    }
    // foreign key movieId
  }, {
    updatedAt: false,
    createdAt: false
  });
