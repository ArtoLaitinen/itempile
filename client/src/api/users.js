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

  if (!response.ok) {
    throw new Error("Failed to sign up");
  }

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

  if (response.status === 401) {
    throw new Error(responseJson.message);
  } else if (!response.ok) {
    throw new Error("Unexpected error while logging in");
  }

  return responseJson;
};
