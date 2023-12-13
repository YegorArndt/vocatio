import { RequestArgs, User } from "~/modules/extension/types";

type Err = {
  message: string;
};

export const updateUser = async (
  args: RequestArgs<{ user: Partial<User> }>
) => {
  const { token, userId, user } = args;
  const data = { user, userId };

  try {
    const response = await fetch(
      "http://localhost:3000/api/extension/updateUser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const res = await response.json();
    return res;
  } catch (error) {
    return { failed: true, error: (error as Err).message };
  }
};
