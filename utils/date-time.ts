export const getTomorrow = () => {
  const tomorrow = new Date();
  return tomorrow.setDate(tomorrow.getDate() + 1);
};

export const jwtExpirationTime = () => Date.now() + 28800000; // 8 hours

export const timeFmt = new Intl.DateTimeFormat("en-US", {
  timeStyle: "long",
  hour12: false,
});

export const formatBlogDate = (utcDate) => {
  const date = new Date(utcDate);

  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() returns month from 0 to 11
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};
