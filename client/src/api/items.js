/* eslint-disable import/prefer-default-export */
export const getItems = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`);
  const responseJson = await response.json();

  return responseJson;
};
