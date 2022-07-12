const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let message_data;

  if (event) {
    // Halt execution and return the trivial key if object is less than MAX_PARTITION_KEY_LENGTH
    if (JSON.stringify(event).length <= MAX_PARTITION_KEY_LENGTH) {
      return TRIVIAL_PARTITION_KEY;
    }
    
    if (event.partitionKey) {
      // We operate on only strings with length > MAX_PARTITION_KEY_LENGTH
      // We return as soon as we detect otherwise
      message_data = JSON.stringify(event.partitionKey);
      if (message_data.length > MAX_PARTITION_KEY_LENGTH) {
        return crypto.createHash("sha3-512").update(message_data).digest("hex");
      }
    } else {
      const data = JSON.stringify(event);
      message_data = crypto.createHash("sha3-512").update(data).digest("hex");
      // We have the final result
      return message_data;
    }
  }
  return TRIVIAL_PARTITION_KEY;
};