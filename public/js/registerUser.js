import { showAlert } from "./alerts.js";
export async function registerUserData(formData) {
  let data;
  try {
    const res = await fetch("/register", {
      method: "POST",

      body: formData,
    });

    data = await res.json();

    if (!res.ok) {
      throw new Error();
    }

    showAlert("success", "User Successfully registered");
    return data;
  } catch (err) {
    showAlert("error", data.message);
  }
}

export async function loginUser(formData) {
  let data;
  try {
    const res = await fetch("/login", {
      method: "POST",

      body: formData,
    });

    data = await res.json();

    if (!res.ok) {
      throw new Error();
    }

    showAlert("success", "User Successfully logged in");
    return data;
  } catch (err) {
    showAlert("error", data.message);
  }
}
