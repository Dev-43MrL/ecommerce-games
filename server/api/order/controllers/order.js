'use strict';
const stripe= require("stripe")("sk_test_51Ja2zYI8lb3K90427bEmBf22IPXO9c69eT6bsAvzUWg6cjQOoEjs1aRmF8EWDYGyhVcGipppbRFtUCPunbOpHyt100VaaNw6ER");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
module.exports = {
  async create(ctx) {
    const { token, products, idUser, addressShipping } = ctx.request.body;

    let totalPayment = 0;
    products.forEach((product) => {
      totalPayment = totalPayment + product.price;
    });

    const charge = await stripe.charges.create({
      amount: totalPayment * 100,
      currency: "eur",
      source: token.id,
      description: `ID Usuario: ${idUser}`,
    });

    const createOrder = [];
    for await (const product of products) {
      const data = {
        game: product.id,
        user: idUser,
        totalPayment,
        idPayment: charge.id,
        addressShipping,
      };
      //console.log(data)
      const validData = await strapi.entityValidator.validateEntityCreation(strapi.models.order, data);
      //console.log(validData)
      const entry = await strapi.query("order").create(validData);
      createOrder.push(entry);
    }
    return createOrder;
  },
};
