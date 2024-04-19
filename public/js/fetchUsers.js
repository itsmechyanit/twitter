import { showAlert } from "./alerts.js";

export async function fetchUsers(searchValue) {
  let data;
  if (searchValue === "") {
    return;
  }
  try {
    const response = await fetch(`/searchUsers?searchFor=${searchValue}`);

    data = await response.json();
    if (!response.ok) {
      throw new Error();
    }
    return data;
  } catch (err) {
    showAlert("error", data.message);
  }
}

export function generateMarkup(parentEl, users) {
  parentEl.innerHTML = "";
  let html = [];

  if (users.length === 0) {
    parentEl.insertAdjacentHTML(
      "beforeend",
      "<li class='text-center'>No user found for this search term</li>"
    );
    return;
  }

  users.map((user) => {
    // const h = `<li><a href=/users/${user.id} style="text-decoration:none; color: rgb(231, 233, 234);">${user.name}</a></li>`;

    const h = `<li>
      <a href="/users/${user._id}" class="d-flex gap-2 align-items-center" style="text-decoration:none; color: rgb(231, 233, 234)">
        <img src="/img/users/${user.photo}" alt="${user.name}" class="profile-image">
        <span>${user.name}</span>
      </a>
    </li>`;
    // const h = `<li><a href="/users/${user._id}" class="d-flex gap-2 align-items-center" style="text-decoration:none; color: rgb(231, 233, 234)"><img src="/img/users/${user.photo}" alt="${user.name}" class="profile-image"><span>${user.name}</span></a></li>`;
    html.push(h.trim());
  });

  parentEl.insertAdjacentHTML("beforeend", html.join(""));
}

export async function userFollow(userId) {
  let data;
  try {
    const response = await fetch(`/follows/${userId}`);

    data = await response.json();

    if (!response.ok) {
      throw new Error();
    }
    return data;
  } catch (err) {
    showAlert("error", data.message);
  }
}
