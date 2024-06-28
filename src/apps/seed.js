const user = require("./seeder/user");
const comment = require("./seeder/comment");

const seed = async () => {
    await user();
    await comment();
}

seed();