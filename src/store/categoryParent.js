import { getAllThuMucByDanhMuc } from "@/api/den-led.js";

export async function fetch() {
  try {
    const res = await getAllThuMucByDanhMuc();
    localStorage.setItem("categoriesParent", JSON.stringify(res.data));
  } catch (error) {
    console.log(error);
  }
}

export function getDataCategoryParent() {
  const storedCategories = localStorage.getItem("categoriesParent");

  return JSON.parse(storedCategories) || "";
}

export async function fetchCategoryParent() {
  const storedCategories = localStorage.getItem("categoriesParent");
  if (!storedCategories) {
    await fetch();
  }
}
