document.addEventListener("DOMContentLoaded", function () {
    // Check if a user is logged in and update the navbar accordingly
    const currentUser = localStorage.getItem("currentUser")
        ? JSON.parse(localStorage.getItem("currentUser"))
        : null;
    if (currentUser) {
        updateNavbarForLoggedInUser(currentUser);
    }

    // Login Modal functionality
    const loginModal = document.getElementById("login-modal");
    const loginBtn = document.getElementById("login-btn");
    const loginCloseBtn = loginModal ? loginModal.querySelector(".close") : null;
    if (loginBtn && loginModal && loginCloseBtn) {
        loginBtn.addEventListener("click", () => {
            loginModal.style.display = "block";
        });
        loginCloseBtn.addEventListener("click", () => {
            loginModal.style.display = "none";
        });
        window.addEventListener("click", (event) => {
            if (event.target === loginModal) {
                loginModal.style.display = "none";
            }
        });
    }

    // Signup Modal functionality
    const signupModal = document.getElementById("signup-modal");
    const signupBtn = document.getElementById("signup-btn");
    const signupCloseBtn = signupModal ? signupModal.querySelector(".close") : null;
    if (signupBtn && signupModal && signupCloseBtn) {
        signupBtn.addEventListener("click", () => {
            signupModal.style.display = "block";
        });
        signupCloseBtn.addEventListener("click", () => {
            signupModal.style.display = "none";
        });
        window.addEventListener("click", (event) => {
            if (event.target === signupModal) {
                signupModal.style.display = "none";
            }
        });
    }

    // Switch between Login and Signup modals
    const switchToSignup = document.getElementById("switch-to-signup");
    if (switchToSignup) {
        switchToSignup.addEventListener("click", function (e) {
            e.preventDefault();
            if (loginModal) loginModal.style.display = "none";
            if (signupModal) signupModal.style.display = "block";
        });
    }
    const switchToLogin = document.getElementById("switch-to-login");
    if (switchToLogin) {
        switchToLogin.addEventListener("click", function (e) {
            e.preventDefault();
            if (signupModal) signupModal.style.display = "none";
            if (loginModal) loginModal.style.display = "block";
        });
    }

    // Common functions to get and set registered users from localStorage
    function getRegisteredUsers() {
        const users = localStorage.getItem("registeredUsers");
        return users ? JSON.parse(users) : [];
    }
    function setRegisteredUsers(users) {
        localStorage.setItem("registeredUsers", JSON.stringify(users));
    }

    // Update the navbar for a logged in user
    function updateNavbarForLoggedInUser(user) {
        // Hide login and signup button container (if exists)
        const navbarBtnContainer = document.querySelector(".navbar-btn");
        if (navbarBtnContainer) {
            navbarBtnContainer.style.display = "none";
        }
        // Create or update user info container on the navbar
        let userInfoContainer = document.getElementById("user-info");
        if (!userInfoContainer) {
            userInfoContainer = document.createElement("div");
            userInfoContainer.id = "user-info";
            userInfoContainer.style.display = "flex";
            userInfoContainer.style.alignItems = "center";
            userInfoContainer.style.gap = "0.5rem";
            // Append it to the header; adjust the selector as needed for your header structure
            const header = document.querySelector("nav");
            header.appendChild(userInfoContainer);
        }
        userInfoContainer.innerHTML = `<span>Welcome, ${user.username}!</span>`;
        const logoutBtn = document.createElement("button");
        logoutBtn.textContent = "Log Out";
        logoutBtn.style.padding = "0.5rem 1rem";
        logoutBtn.style.borderRadius = "10px";
        logoutBtn.style.border = "none";
        logoutBtn.style.backgroundColor = "#b8ace9";
        logoutBtn.style.color = "#5305b3";
        logoutBtn.style.cursor = "pointer";
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            location.reload();
        });
        userInfoContainer.appendChild(logoutBtn);
    }

    // Login form functionality
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const usernameOrEmail = loginForm.username.value.trim();
            const password = loginForm.password.value;
            const users = getRegisteredUsers();
            if (users.length === 0) {
                alert("No registered users found. Please sign up first.");
                return;
            }
            const foundUser = users.find(
                (user) =>
                    (user.username === usernameOrEmail || user.email === usernameOrEmail) &&
                    user.password === password
            );
            if (foundUser) {
                alert("Login successful!");
                loginForm.reset();
                if (loginModal) loginModal.style.display = "none";
                localStorage.setItem("currentUser", JSON.stringify(foundUser));
                updateNavbarForLoggedInUser(foundUser);
            } else {
                alert("Invalid credentials. Please try again.");
            }
        });
    }

    // Signup form functionality
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const fullname = signupForm.fullname.value.trim();
            const username = signupForm.username.value.trim();
            const email = signupForm.email.value.trim();
            const password = signupForm.password.value;
            const passwordConfirm = signupForm.password_confirm.value;
            if (password !== passwordConfirm) {
                alert("Passwords do not match!");
                return;
            }
            let users = getRegisteredUsers();
            if (users.some((user) => user.username === username || user.email === email)) {
                alert("An account with this username or email already exists.");
                return;
            }
            const newUser = { fullname, username, email, password };
            users.push(newUser);
            setRegisteredUsers(users);
            localStorage.setItem("currentUser", JSON.stringify(newUser));
            alert("Signup successful! You are now logged in.");
            signupForm.reset();
            if (signupModal) signupModal.style.display = "none";
            updateNavbarForLoggedInUser(newUser);
        });
    }
});
