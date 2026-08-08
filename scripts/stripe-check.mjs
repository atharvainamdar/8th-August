const hasSecret = Boolean(process.env.STRIPE_SECRET_KEY);
const hasPub = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

console.log(
  JSON.stringify(
    {
      stripeSecretConfigured: hasSecret,
      stripePublishableConfigured: hasPub,
      checkoutMode: hasSecret ? "stripe_ready" : "instant_trial",
      nextStep: hasSecret
        ? "Add Stripe Price IDs and create Checkout Sessions in /api/checkout"
        : "Add STRIPE_SECRET_KEY + NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable card billing",
    },
    null,
    2
  )
);
