export const getTomorrow = () => {
  const tomorrow = new Date();
  return tomorrow.setDate(tomorrow.getDate() + 1);
};

export const jwtExpirationTime = () => Date.now() + 28800000; // 8 hours

export const timeFmt = new Intl.DateTimeFormat("en-US", {
  timeStyle: "long",
  hour12: false,
});