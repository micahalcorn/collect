Meteor.methods({
  'stripe.processToken': function (token, amount) {
    var Stripe = StripeAPI(Meteor.user().services.stripe.accessToken);
    var stripeFee = Math.round(amount * 0.029 + 30);
    var developerFee = Math.max(Math.round(amount * 0.05) - stripeFee, 0);
    var charge = Promise.await(Stripe.charges.create({
      amount: amount,
      currency: "usd",
      source: token.id,
      application_fee: developerFee
    }));
    console.log(charge);
    return charge;
  }
});
