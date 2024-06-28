const seeder = require("mongoose-seed");
const { faker } = require('@faker-js/faker/locale/vi');
const ProductModel = require("../models/product");
var items = [];
const generateData = async () => {
    const product = await ProductModel.find();
    for (i = 0; i < 50000; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        items.push({
            prd_id : product[Math.floor(Math.random() * product.length)]._id,
            full_name  : lastName + " " + firstName,
            email : faker.internet.email({ firstName: firstName, lastName: lastName, provider: "gmail.com" }),
            body : faker.lorem.paragraphs({min : 3, max : 7})
        })
    }
}

const comment = async () => {
    await generateData();
    let data = [{
        'model': 'Comments',
        'documents': items
    }]

    seeder.connect("mongodb://127.0.0.1:27017/db_shop_project", () => {
        seeder.loadModels([
            "./src/apps/models/comment"
        ]);
        seeder.populateModels(data, () => {
        });
    });
}

module.exports = comment;