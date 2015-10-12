Meteor.startup(function () {
  if (! Accounts.loginServiceConfiguration.find().count()) {
    Accounts.loginServiceConfiguration.insert({
      service: 'stripe',
      appId: Meteor.settings.private.stripe.clientId,
      secret: Meteor.settings.private.stripe.secretKey,
      scope: 'read_write'
    });
  }
});
