import { registerUserData, loginUser } from "./registerUser.js";
import { updateUserData, logoutUser } from "./updateSettings.js";
import { generateMarkup, fetchUsers, userFollow } from "./fetchUsers.js";

const registrationForm = document.getElementById("registration-form");
const loginForm = document.getElementById("login-form");
const userFormData = document.getElementById("userdata-form");
const btnLogout = document.getElementById("logout");
const followUser = document.getElementById("user-follow");

const searchUserBox = document.getElementById("special");

const userContainer = document.getElementById("user-container");

const searchToggler = document.querySelector(".search-toggler");

if (registrationForm) {
  registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const resData = await registerUserData(formData);
    if (resData) {
      window.setTimeout(() => window.location.assign("/"), 2000);
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const resData = await loginUser(formData);
    if (resData) {
      window.setTimeout(() => window.location.assign("/"), 2000);
    }
  });
}
if (userFormData) {
  userFormData.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const resData = await updateUserData(formData);
    if (resData) {
      window.setTimeout(() => window.location.assign("/profile"), 2000);
    }
  });
}

if (btnLogout) {
  btnLogout.addEventListener("click", logoutUser);
}

if (searchUserBox) {
  searchUserBox.addEventListener("input", function (event) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(async () => {
      const data = await fetchUsers(event.target.value);
      if (data) {
        generateMarkup(searchToggler, data.users);
      }
    }, 500);
  });

  searchUserBox.addEventListener("focus", (event) => {
    searchToggler.classList.add("show");
  });

  searchUserBox.addEventListener("blur", () => {
    window.setTimeout(() => {
      searchToggler.classList.remove("show");
      searchToggler.innerHTML = "";
      searchUserBox.value = "";
    }, 100);
  });
}

// if (userContainer) {
//   userContainer.addEventListener("click", (event) => {
//     const target = event.target;
//     console.log("hello click event");
//     console.log(target);
//     if (target.matches("a")) {
//       window.location.assign(`${target.href}`);
//     }
//   });
// }

if (followUser) {
  followUser.addEventListener("click", async (event) => {
    event.preventDefault();

    const userId = window.location.href.split("/").at(-1);
    const data = await userFollow(userId);
    if (data) {
      window.location.reload(true);
    }
  });
}
