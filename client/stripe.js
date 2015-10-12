Meteor.startup(function () {
  Stripe.setPublishableKey(Meteor.settings.public.stripe.publishableKey);

  Stripe.handler = StripeCheckout.configure({
    token: function (token) {
      Meteor.call('stripe.processToken', token, Session.get('amount'), function (err, res) {
        alert('Success!');
        Session.set('amount', null);
        $('input').val('');
      });
    }
  });
});

Template.Stripe.events({
  'click button.auth': function () {
    Meteor.loginWithStripe({
      stripe_landing: 'register'
    }, function (err) {
      if (err) {
        alert('Error: ' + err.reason);
      }
    });
  },
  'click button.collect': function (e, t) {
    e.preventDefault();
    var regex  = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
    var val = t.$('input').val().trim();

    if (val.length && regex.test(val)) {
      if (val.indexOf('.') > -1) {
        var cents = val.split('.')[1];

        if (cents.length === 2) {
          val = val.replace('.', '');
        } else if (cents.length === '1') {
          val = val.replace('.', '') + '0';
        } else {
          val = val.replace('.', '') + '00';
        }
      } else {
        val += '00';
      }

      Session.set('amount', val);

      Stripe.handler.open({
        name: 'Customer\'s Info',
        key: Meteor.user().services.stripe.stripe_publishable_key,
        amount: parseInt(val)
      });
    } else {
      alert('Please enter the amount in the following format: 200.00');
    }
  }
});
