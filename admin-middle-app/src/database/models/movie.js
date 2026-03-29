module.exports = (db, DataTypes) => 
    db.define("movie", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            primaryKey: true
        },
        synopsis: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        imgUrl: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        rating: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        runtime: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        view: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },{
        updatedAt: true,
        createdAt: false
    });