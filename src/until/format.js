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

export const formatBreadcrumb = (data) => {
  if (!data) return [];

  const keys = [
    { id: "idTongMuc", name: "tenTongMuc", type: "TONG_MUC" },
    { id: "idThuMuc", name: "tenThuMuc", type: "THU_MUC" },
    { id: "idDanhMuc", name: "tenDanhMuc", type: "DANH_MUC" },
  ];

  return keys.reduce((acc, { id, name, type }) => {
    if (data[id]) {
      acc.push({ id: data[id], name: data[name], type });
    }
    return acc;
  }, []);
};
