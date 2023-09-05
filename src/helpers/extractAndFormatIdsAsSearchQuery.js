export const extractAndFormatIdsAsSearchQuery = (idsArray = []) => {
  return idsArray.reduce((previousValue, currentValue, index) => {
    return `${previousValue}(id:${currentValue})${
      index === idsArray.length - 1 ? "" : " OR "
    }`;
  }, "");
};
