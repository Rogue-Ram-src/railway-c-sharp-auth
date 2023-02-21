
const validateRequestBody = (body) => {
    if (body.timestamp) {
      // get the current time
      const now = new Date();
      const decryptedTimestamp = new Date(body.timestamp);
      if (now - decryptedTimestamp <= 15 * 1000) {
        return true;
      }
    }
    return false;
  };

  module.exports = { validateRequestBody };