/* eslint-disable camelcase */
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

export const getItemsByUserId = async (userId, token) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/items/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
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

export const addItem = async ({
  title,
  description,
  image,
  category,
  price,
  owner_id,
  token,
}) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      description,
      image,
      category,
      price,
      owner_id,
    }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error("Failed to add");
  }

  return responseJson;
};
