const form = document.getElementById("loginForm");
const validation = document.getElementById("validation");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        console.log(data);

        if (res.ok && data.status === "success") {
            localStorage.setItem("token", data.token);
            window.location.href = "./index.html";
        }

        if(data.status === "fail")
        {
            const getpassword = document.getElementById('validPassword');
            getpassword.style.display = "block";
            getpassword.style.color = "red";
            getpassword.textContent = data.message;
        }

    } catch (err) {
        console.error(err);
        validation.style.display = "block";
        validation.innerText = "Server error. Try again.";
    }
});