const button = document.getElementById('registerButton');
console.log("JS Loaded");

button.addEventListener('click', async(event) => {
    event.preventDefault();
    try{
    const userName = document.getElementById('name').value;
    const userEmail = document.getElementById('email').value;
    const userPassword = document.getElementById('password').value;
    const userConfirmPassword = document.getElementById('confirmpassword').value;
    const error = document.getElementById('validPassword');
    const registerUser =  await fetch('http://127.0.0.1:8000/api/v1/users',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: userName,
            email: userEmail,
            password: userPassword,
            confirmPassword: userConfirmPassword
        }),
    }
    )
    const data = await registerUser.json();
    if(data.status === "fail")
        {
            const getpassword = document.getElementById('errorMessage');
            getpassword.style.display = "block";
            getpassword.style.color = "red";
            getpassword.textContent = data.message;
            return;
        }

         if (userPassword !== userConfirmPassword) {
            console.log('Passwords do not match');

            error.style.display = 'block';
            return;
        } else {
            error.style.display = 'none';
        }
        
        if (!registerUser.ok) {
            throw new Error(data.message || "Registration failed");
        }

        if (data.token) {
            localStorage.setItem("token", data.token);
            console.log("Token stored");
        } else {
            console.log("No token received");
        }
        const token = localStorage.getItem("token");
        window.location.href = "index.html";
        console.log(token);
    }catch(err)
    {
        console.log(err);
    }
    
});