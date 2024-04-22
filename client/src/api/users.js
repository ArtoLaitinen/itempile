export const signUpUser = async ({ name, email, password }) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/users/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    },
  );

  const responseJson = await response.json();

  return responseJson;
};

export const loginUser = async ({ email, password }) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/users/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );

  const responseJson = await response.json();

  return responseJson;
};
