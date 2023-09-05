export const extractIdNumberFromId = (id = "") => {
  let values = id.split("/");
  return values[values.length - 1];
};
