import axios from "axios";

const URL = "https://the-gioi-den.up.railway.app/";

const API = {
  get_all_sp: "get-all-sp",
  get_all_dm: "get-all-danh-muc",
  get_sp_by_dm: "get-all-sp-by-danh-muc",
  search: "search",
  detail_product: "detail",
  add_dm: "them-moi-danh-muc",
  sua_dm: "sua-danh-muc",
  xoa_dm: "xoa-danh-muc",
  xoa_sp: "xoa-san-pham",
  them_sp: "them-moi-sp",
  sua_sp: "sua-san-pham",
};

const convertURLParams = (params) => {
  return Object.keys(params)
    .map(function (key) {
      return key + "=" + params[key];
    })
    .join("&");
};

export const getAllSp = async (params) => {
  const res = await axios.get(
    `${URL}${API.get_all_sp}?${convertURLParams(params)}`
  );

  return res;
};

export const getAllDanhMuc = async () => {
  const res = await axios.get(`${URL}${API.get_all_dm}`);

  return res;
};

export const getSpByDm = async (params) => {
  const res = await axios.get(
    `${URL}${API.get_sp_by_dm}?${convertURLParams(params)}`
  );

  return res;
};

export const search = async (params) => {
  const res = await axios.get(
    `${URL}${API.search}?${convertURLParams(params)}`
  );

  return res;
};

export const detailProduct = async (params) => {
  const res = await axios.get(
    `${URL}${API.detail_product}?${convertURLParams(params)}`
  );

  return res;
};

export const addCategory = async (data) => {
  const res = await axios.post(`${URL}${API.add_dm}`, data);

  return res;
};

export const editCategory = async (data) => {
  const res = await axios.put(`${URL}${API.sua_dm}`, data);

  return res;
};

export const deleteCategory = async (id) => {
  const res = await axios.delete(`${URL}${API.xoa_dm}?id=${id}`);

  return res;
};

export const deleteProduct = async (id) => {
  const res = await axios.delete(`${URL}${API.xoa_sp}?id=${id}`);

  return res;
};

export const addProduct = async (data) => {
  const res = await axios.post(`${URL}${API.them_sp}`, data);

  return res;
};

export const editProduct = async (data) => {
  const res = await axios.put(`${URL}${API.sua_sp}`, data);

  return res;
};
