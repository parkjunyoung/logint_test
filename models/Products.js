module.exports = function(sequelize, DataTypes){
    var Products = sequelize.define('Products',
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name : { type: DataTypes.STRING(1200) },
            description : { type: DataTypes.TEXT }
        }
    );
    return Products;
}