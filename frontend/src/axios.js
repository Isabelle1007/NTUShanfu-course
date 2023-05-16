import axios from "axios";

const instance = axios.create({
  baseURL: `http://localhost:4000/`
  // baseURL: `http://18.182.163.170:4000/`
});

export const getAllCurricula = async () => {
  return await instance.get(`./curriculum/all`).then((res) => {
    return res.data;
  })
}

export const getAllHomes = async () => {
  return await instance.get(`./home/all`).then((res) => {
    return res.data;
  })
}

export const getAllTypes = async () => {
  return await instance.get(`./type/all`).then((res) => {
    return res.data;
  })
}

// export const getAllProducts = async ({page}) => {
//   return await instance.get(`./products/all?paging=${page}`).then((res) => {
//     return res.data;
//   })
// }

// export const getWomen = async ({page}) => {
//   return await instance.get(`./products/women?paging=${page}`).then((res) => {
//     return res.data;
//   })
// }

// export const searchProducts = async ({page, keyword}) => {
//   return await instance.get(`./products/search?paging=${page}&keyword=${keyword}`).then((res) => {
//     return res.data;
//   })
// }

// export const getProductById = async ({id}) => {
//   return await instance.get(`./products/details?id=${id}`).then((res) => {
//     return res.data;
//   })
// }
