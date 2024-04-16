const userRepository = require('../data/repositories/userRepository');

const findUserByUsername = async (username) => {
  try {
    return await userRepository.findUserByUsername(username);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findUserByUsername
};
