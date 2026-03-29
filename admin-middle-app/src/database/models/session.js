module.exports = (db, DataTypes) =>
  db.define("_session", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    sessionDate: {
        type: DataTypes.DATEONLY,
        primaryKey: false
    },
    sessionTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    seats: {
        type: DataTypes.STRING(255),
        allowNull: true
        // s0=0-s1=0-s2=0-s3=0-s4=0-s5=0-s6=0-s7=0-s8=0-s9=0
    },
    movieId: {
      type: DataTypes.INTEGER,
      // primaryKey: false,
      allowNull: false,
      references: {
          model: db.movie,
          key: "id"
      }
    },
    // foreign key movieId
  }, {
    updatedAt: false,
    createdAt: false
  });
