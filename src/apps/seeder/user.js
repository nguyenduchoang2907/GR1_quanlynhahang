const seeder = require("mongoose-seed");
const { faker } = require('@faker-js/faker/locale/vi');
const bcrypt = require('bcrypt');
const UserModel = require("../models/user");

var items = [];
const generateData = async () => {
    for (i = 0; i < 500; i++) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash("123456", salt);
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName: firstName, lastName: lastName, provider: "gmail.com" });
        const user = await UserModel.find({ email: email });
        if (user.length == 0) {
            items.push(
                {
                    full_name: lastName + " " + firstName,
                    email,
                    password: hashed
                }
            )
        }
    }
}

const user = async () => {
    await generateData();
    let data = [{
        'model': 'Users',
        'documents': items
    }]

    seeder.connect("mongodb://127.0.0.1:27017/db_shop_project", () => {
        seeder.loadModels([
            "./src/apps/models/user"
        ]);
        seeder.populateModels(data, () => {
        });
    });
}

module.exports = user;