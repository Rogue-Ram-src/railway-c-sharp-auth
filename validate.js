
const validateRequestBody = (body) => {
    if (body.timestamp) {
      const now = Date.now();
      const decryptedTimestamp = body.timestamp
      if (now - decryptedTimestamp <= 15 * 1000) {
        return true;
      }
    }
    console.log(false)
    return false;
  };

  module.exports = { validateRequestBody };