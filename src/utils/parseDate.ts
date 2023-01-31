export const getDayPeriod = () => {
  let now = new Date();

  if (now.getHours() > 5 && now.getHours() <= 12) {
    return "Morning";
  }
  if (now.getHours() > 12 && now.getHours() <= 18) {
    return "Afternoon";
  }
  if (now.getHours() > 18 && now.getHours() <= 22) {
    return "Evening";
  }
  if (now.getHours() > 22 || now.getHours() <= 5) {
    return "Night";
  }
};
