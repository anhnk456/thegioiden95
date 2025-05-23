import axiosInstance from '@/config/axios.config';
import { convertURLParams } from "@/until/format";

const URL = "http://localhost:8080/";

const API = {
  // API Sản phẩm
  get_all_sp: "get-all-sp",
  get_sp_by_dm: "get-all-sp-by-danh-muc",
  detail_product: "detail",
  them_sp: "them-moi-sp",
  sua_sp: "sua-san-pham",
  xoa_sp: "xoa-san-pham",
  // API Danh mục
  get_all_dm: "get-all-danh-muc",
  search: "search",
  add_dm: "them-moi-danh-muc",
  sua_dm: "sua-danh-muc",
  xoa_dm: "xoa-danh-muc",
  // API Thư mục lớn
  get_all_tm: "get-all-thu-muc",
  get_all_tm_by_dm: "get-all-danh-muc-by-thu-muc",
  add_tm: "them-thu-muc",
  sua_tm: "sua-thu-muc",
  xoa_tm: "xoa-thu-muc",
  // API Ảnh khuyến mãi
  get_bn: "get-all-banner",
  them_bn: "them-moi-banner",
  xoa_bn: "xoa-banner",
  // API sắp xếp theo thứ tự ưu tiên
  uu_tien_sp: "uu-tien/san-pham",
  uu_tien_dm: "uu-tien/danh-muc",
  uu_tien_tm: "uu-tien/thu-muc",
  uu_tien_tong_muc: "uu-tien/tong-muc",
  // API Tổng mục
  get_all_tong_muc: "get-all-tong-muc",
  get_all_tong_muc_child: "get-all-tong-muc-child",
  them_tong_muc: "them-tong-muc",
  sua_tong_muc: "sua-tong-muc",
  xoa_tong_muc: "xoa-tong-muc",
  // API Trang chủ
  trang_chu: "trang-chu",
};

export const getTrangChu = async () => {
  const res = await axiosInstance.get(`${URL}${API.trang_chu}`);
  return res;
};

export const getAllSp = async (params) => {
  const res = await axiosInstance.get(
    `${URL}${API.get_all_sp}?${convertURLParams(params)}`
  );
  return res;
};

export const getAllDanhMuc = async () => {
  const res = await axiosInstance.get(`${URL}${API.get_all_dm}`);
  return res;
};

export const getAllBanner = async () => {
  const res = await axiosInstance.get(`${URL}${API.get_bn}`);
  return res;
};

export const getAllThuMuc = async () => {
  const res = await axiosInstance.get(`${URL}${API.get_all_tm}`);
  return res;
};

export const getAllThuMucByDanhMuc = async () => {
  const res = await axiosInstance.get(`${URL}${API.get_all_tm_by_dm}`);
  return res;
};

export const getSpByDm = async (params) => {
  const res = await axiosInstance.get(
    `${URL}${API.get_sp_by_dm}?${convertURLParams(params)}`
  );
  return res;
};

export const search = async (params) => {
  const res = await axiosInstance.get(
    `${URL}${API.search}?${convertURLParams(params)}`
  );
  return res;
};

export const detailProduct = async (params) => {
  const res = await axiosInstance.get(
    `${URL}${API.detail_product}?${convertURLParams(params)}`
  );
  return res;
};

export const getAllTongMuc = async () => {
  const res = await axiosInstance.get(`${URL}${API.get_all_tong_muc}`);
  return res;
};

export const getAllTongMucChild = async () => {
  const res = await axiosInstance.get(`${URL}${API.get_all_tong_muc_child}`);
  return res;
};

export const addCategoryParent = async (data) => {
  const res = await axiosInstance.post(`${URL}${API.add_tm}`, data);
  return res;
};

export const addBanner = async (data) => {
  const res = await axiosInstance.post(`${URL}${API.them_bn}`, data);
  return res;
};

export const editCategoryParent = async (data) => {
  const res = await axiosInstance.put(`${URL}${API.sua_tm}`, data);
  return res;
};

export const deleteCategoryParent = async (id) => {
  const res = await axiosInstance.delete(`${URL}${API.xoa_tm}?id=${id}`);
  return res;
};

export const deleteBanner = async (id) => {
  const res = await axiosInstance.delete(`${URL}${API.xoa_bn}?id=${id}`);
  return res;
};

export const deleteProduct = async (id) => {
  const res = await axiosInstance.delete(`${URL}${API.xoa_sp}?id=${id}`);
  return res;
};

export const addProduct = async (data) => {
  const res = await axiosInstance.post(`${URL}${API.them_sp}`, data);
  return res;
};

export const editProduct = async (data) => {
  const res = await axiosInstance.put(`${URL}${API.sua_sp}`, data);
  return res;
};

export const addCategory = async (data) => {
  const res = await axiosInstance.post(`${URL}${API.add_dm}`, data);
  return res;
};

export const editCategory = async (data) => {
  const res = await axiosInstance.put(`${URL}${API.sua_dm}`, data);
  return res;
};

export const deleteCategory = async (id) => {
  const res = await axiosInstance.delete(`${URL}${API.xoa_dm}?id=${id}`);
  return res;
};

export const addPriority = async (data) => {
  const res = await axiosInstance.post(`${URL}${API.them_tong_muc}`, data);
  return res;
};

export const editPriority = async (data) => {
  const res = await axiosInstance.put(`${URL}${API.sua_tong_muc}`, data);
  return res;
};

export const deletePriority = async (id) => {
  const res = await axiosInstance.delete(`${URL}${API.xoa_tong_muc}?id=${id}`);
  return res;
};

export const uuTienSanPham = async (data) => {
  const res = await axiosInstance.put(`${URL}${API.uu_tien_sp}`, data);
  return res;
};

export const uuTienDanhMuc = async (data) => {
  const res = await axiosInstance.put(`${URL}${API.uu_tien_dm}`, data);
  return res;
};

export const uuTienThuMuc = async (data) => {
  const res = await axiosInstance.put(`${URL}${API.uu_tien_tm}`, data);
  return res;
};

export const uuTienTongMuc = async (data) => {
  const res = await axiosInstance.put(`${URL}${API.uu_tien_tong_muc}`, data);
  return res;
};
