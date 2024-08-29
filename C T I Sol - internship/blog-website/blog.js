document.addEventListener("DOMContentLoaded", function() {
  const homeLink = document.getElementById("homeLink");
  const newPostLink = document.getElementById("newPostLink");
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");

  const blogListSection = document.getElementById("blog-list");
  const newPostSection = document.getElementById("new-post");
  const loginSection = document.getElementById("login-section");
  const signupSection = document.getElementById("signup-section");

  const postForm = document.getElementById("postForm");
  const postTitle = document.getElementById("postTitle");
  const postContent = document.getElementById("postContent");
  const postsContainer = document.getElementById("posts");

  const loginForm = document.getElementById("loginForm");
  const loginUsername = document.getElementById("loginUsername");
  const loginPassword = document.getElementById("loginPassword");

  const signupForm = document.getElementById("signupForm");
  const signupUsername = document.getElementById("signupUsername");
  const signupPassword = document.getElementById("signupPassword");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

  function showSection(section) {
      blogListSection.classList.add("hidden");
      newPostSection.classList.add("hidden");
      loginSection.classList.add("hidden");
      signupSection.classList.add("hidden");

      section.classList.remove("hidden");
  }

  homeLink.addEventListener("click", function() {
      showSection(blogListSection);
      displayPosts();
  });

  newPostLink.addEventListener("click", function() {
      if (currentUser) {
          showSection(newPostSection);
      } else {
          alert("Please log in to create a post.");
          showSection(loginSection);
      }
  });

  loginLink.addEventListener("click", function() {
      showSection(loginSection);
  });

  signupLink.addEventListener("click", function() {
      showSection(signupSection);
  });

  postForm.addEventListener("submit", function(event) {
      event.preventDefault();

      if (currentUser) {
          const post = {
              title: postTitle.value,
              content: postContent.value,
              author: currentUser.username,
              id: Date.now()
          };

          let posts = JSON.parse(localStorage.getItem("posts")) || [];
          posts.push(post);
          localStorage.setItem("posts", JSON.stringify(posts));

          postTitle.value = "";
          postContent.value = "";

          showSection(blogListSection);
          displayPosts();
      } else {
          alert("Please log in to create a post.");
      }
  });

  loginForm.addEventListener("submit", function(event) {
      event.preventDefault();

      const username = loginUsername.value;
      const password = loginPassword.value;

      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
          currentUser = user;
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          alert("Login successful!");
          showSection(blogListSection);
          displayPosts();
      } else {
          alert("Invalid username or password.");
      }
  });

  signupForm.addEventListener("submit", function(event) {
      event.preventDefault();

      const username = signupUsername.value;
      const password = signupPassword.value;

      const userExists = users.some(u => u.username === username);

      if (!userExists) {
          const newUser = { username, password };
          users.push(newUser);
          localStorage.setItem("users", JSON.stringify(users));
          alert("Sign up successful! You can now log in.");
          showSection(loginSection);
      } else {
          alert("Username already exists. Please choose a different username.");
      }
  });

  function displayPosts() {
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      postsContainer.innerHTML = "";

      posts.forEach(post => {
          const postElement = document.createElement("div");
          postElement.className = "post";

          const title = document.createElement("h3");
          title.textContent = post.title;

          const author = document.createElement("p");
          author.textContent = `By ${post.author}`;

          const content = document.createElement("p");
          content.textContent = post.content;

          if (currentUser && post.author === currentUser.username) {
              const editButton = document.createElement("button");
              editButton.textContent = "Edit";
              editButton.onclick = () => editPost(post.id);

              const deleteButton = document.createElement("button");
              deleteButton.textContent = "Delete";
              deleteButton.onclick = () => deletePost(post.id);

              postElement.appendChild(editButton);
              postElement.appendChild(deleteButton);
          }

          postElement.appendChild(title);
          postElement.appendChild(author);
          postElement.appendChild(content);

          postsContainer.appendChild(postElement);
      });
  }

  function editPost(id) {
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      const post = posts.find(p => p.id === id);

      if (post) {
          postTitle.value = post.title;
          postContent.value = post.content;

          deletePost(id);
          showSection(newPostSection);
      }
  }

  function deletePost(id) {
      let posts = JSON.parse(localStorage.getItem("posts")) || [];
      posts = posts.filter(p => p.id !== id);
      localStorage.setItem("posts", JSON.stringify(posts));

      displayPosts();
  }

  if (currentUser) {
      showSection(blogListSection);
      displayPosts();
  } else {
      showSection(loginSection);
  }
});
