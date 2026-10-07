import api from "../api/apiAxios";

export const uploadPicture = async (file: File, type?: string): Promise<any> => {
  const formData = new FormData();
  if (type) {
    formData.append("type", type);
  }
  formData.append("file", file);

  const response = await api.post(
    `/Upload/UploadFile`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
