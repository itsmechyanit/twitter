import { showAlert } from "./alerts.js";
export async function updateUserData(formData) {
  let data;
  try {
    const res = await fetch("/updateMe", {
      method: "PATCH",

      body: formData,
    });

    data = await res.json();

    if (!res.ok) {
      throw new Error();
    }

    showAlert("success", "Profile Successfully updated");
    return data;
  } catch (err) {
    showAlert("error", data.message);
  }
}

export async function logoutUser() {
  try {
    const res = await fetch("/logout");

    showAlert("success", "logged out successfully");
    window.setTimeout(() => window.location.assign("/"), 2000);
  } catch (err) {
    showAlert("error", "Please try again later");
  }
}
