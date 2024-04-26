export const getItems = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`);
    const responseJson = await response.json();

    if (!response.ok) {
      if (responseJson.message) {
        throw new Error(responseJson.message);
      }
      throw new Error("An error has occurred, please try again");
    }

    return responseJson;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Server is unreachable. Please try again later.");
    }
    throw error;
  }
};

export const getItemById = async (itemId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/items/${itemId}`,
    );
    const responseJson = await response.json();

    if (!response.ok) {
      if (responseJson.message) {
        throw new Error(responseJson.message);
      }
      throw new Error("An error has occurred, please try again");
    }

    return responseJson;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Server is unreachable. Please try again later.");
    }
    throw error;
  }
};
