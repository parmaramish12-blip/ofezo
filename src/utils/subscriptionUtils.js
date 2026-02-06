// src/utils/subscriptionUtils.js

/**
 * Check if logged-in user is admin
 * @param {Object} userDoc - Firestore user document data
 * @returns {boolean}
 */
export const isAdmin = (userDoc) => {
  if (!userDoc) return false;
  return userDoc.role === "admin";
};

/**
 * Check if seller has active subscription
 * Admin is always allowed
 * @param {Object} userDoc - Firestore user document data
 * @returns {boolean}
 */
export const hasActiveSubscription = (userDoc) => {
  if (!userDoc) return false;

  // Admin → lifetime free
  if (isAdmin(userDoc)) return true;

  // Subscription must be active
  if (userDoc.subscriptionActive !== true) return false;

  // Lifetime plan (no expiry)
  if (!userDoc.subscriptionExpiry) return true;

  // Date-based expiry check
  const today = new Date();
  const expiryDate =
    typeof userDoc.subscriptionExpiry.toDate === "function"
      ? userDoc.subscriptionExpiry.toDate()
      : new Date(userDoc.subscriptionExpiry);

  return expiryDate >= today;
};

/**
 * Can user create a new offer
 * @param {Object} userDoc
 * @returns {boolean}
 */
export const canCreateOffer = (userDoc) => {
  // TEMPORARILY DISABLED: Allow all users to create offers
  return true;
  // return hasActiveSubscription(userDoc);
};

/**
 * Can user publish / activate an offer
 * @param {Object} userDoc
 * @returns {boolean}
 */
export const canPublishOffer = (userDoc) => {
  // TEMPORARILY DISABLED: Allow all users to publish offers
  return true;
  // return hasActiveSubscription(userDoc);
};

/**
 * Get subscription label for UI
 * @param {Object} userDoc
 * @returns {string}
 */
export const getSubscriptionLabel = (userDoc) => {
  if (!userDoc) return "Unknown";

  if (isAdmin(userDoc)) return "Admin (Free)";

  if (!userDoc.subscriptionActive) return "Expired";

  if (!userDoc.subscriptionExpiry) return "Lifetime";

  const expiryDate =
    typeof userDoc.subscriptionExpiry.toDate === "function"
      ? userDoc.subscriptionExpiry.toDate()
      : new Date(userDoc.subscriptionExpiry);

  return `Active till ${expiryDate.toLocaleDateString()}`;
};
