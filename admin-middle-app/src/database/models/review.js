module.exports = (db, DataTypes) => 
    db.define("review", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        rating: {
            type: DataTypes.INTEGER,
            primaryKey: false
        },
        content: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: db.user,
              key: "id"
            }
        },
        movieId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: db.movie,
                key: "id"
            }
        },
        blocked: {
            type: DataTypes.BOOLEAN
        }
    },{
        updatedAt: true,
        createdAt: false
    });