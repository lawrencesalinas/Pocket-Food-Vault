'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  userReview.init({
    userId: DataTypes.INTEGER,
    reviewId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'userReview',
  });
  return userReview;
};