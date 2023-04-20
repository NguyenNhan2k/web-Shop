const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/Web_Shop');
        console.log('connect sussefully');
    } catch (error) {
        console.log(error);
    }
}
module.exports = { connect };
