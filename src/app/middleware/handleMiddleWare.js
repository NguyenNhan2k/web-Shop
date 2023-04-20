module.exports = {
    isArray: function (payload) {
        if (payload) {
            return Array.isArray(payload) ? payload : [payload];
        }
        return payload;
    },
};
