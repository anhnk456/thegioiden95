export const numberToVndCurrency = (number) => {
  if (!number) return "";

  return (
    number
      .toString()
      .replace(/^[+-]?\d+/, (int) => int.replace(/(\d)(?=(\d{3})+$)/g, "$1,")) +
    " VNĐ"
  );
};

export const convertURLParams = (params) => {
  return Object.keys(params)
    .map(function (key) {
      return key + "=" + params[key];
    })
    .join("&");
};
