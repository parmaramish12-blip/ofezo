export const isSubscriptionActive = (subscription) => {
  if (!subscription) return false;

  const today = new Date().toISOString().split("T")[0];

  return (
    subscription.isActive === true &&
    subscription.endDate &&
    subscription.endDate >= today
  );
};
