export const getTomorrow = () => {
  const tomorrow = new Date();
  return tomorrow.setDate(tomorrow.getDate() + 1);
};
