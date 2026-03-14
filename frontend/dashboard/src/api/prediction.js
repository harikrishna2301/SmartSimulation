import axios from "axios";

export const getPrediction = async (data) => {
  const response = await axios.get("http://127.0.0.1:8000/predict", {
    params: data,
  });

  return response.data;
};
