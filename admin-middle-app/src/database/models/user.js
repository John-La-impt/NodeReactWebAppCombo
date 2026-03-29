module.exports = (db, DataTypes) => 
    db.define("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
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
        blocked: {
            type: DataTypes.BOOLEAN
        }
    },{
        updatedAt: true,
        createdAt: false
    });