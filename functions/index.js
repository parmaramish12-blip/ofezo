const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");

admin.initializeApp();

const razorpay = new Razorpay({
  key_id: "RAZORPAY_KEY_ID",
  key_secret: "RAZORPAY_SECRET",
});

exports.createOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Login required"
    );
  }

  const options = {
    amount: data.amount * 100,
    currency: "INR",
    receipt: "receipt_" + Date.now(),
  };

  const order = await razorpay.orders.create(options);

  return order;
});

exports.verifyPayment = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid;

  await admin.firestore().doc(`users/${uid}`).update({
    subscription: {
      plan: data.plan,
      isActive: true,
      startDate: new Date().toISOString(),
      endDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  });

  return { success: true };
});
