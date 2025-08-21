const loginReservedAreaForm = document.getElementById("loginReservedAreaForm");

const usernameReservedArea = document.getElementById("usernameReservedArea");
const password1ReservedArea = document.getElementById("password1ReservedArea");
const password2ReservedArea = document.getElementById("password2ReservedArea");
const password3ReservedArea = document.getElementById("password3ReservedArea");
const password4ReservedArea = document.getElementById("password4ReservedArea");
const password5ReservedArea = document.getElementById("password5ReservedArea");
const loginReservedArea = document.getElementById("loginReservedArea");

loginReservedAreaForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
        await fetch(`./api/logout.php`, {
            method: "POST",
            credentials: "include"
        });
    } catch (error) {
        console.error(error);
        printError(421);
    }

    try {
        const formData = new FormData(this);
        
        const response = await fetch(loginReservedAreaForm.action, {
            method: "POST",
            credentials: "include",
            body: formData
        });

        const data = await response.json();

        if (data['success']) {
            alert("Logging in...");
        }
        else {
            if (data['error'] == "account_not_found") {
                alert("Username or password are wrong");
            }
            else {
                console.error(data['error']);
                printError(421);
            }
        }
    } catch (error) {
        console.error(error);
        printError(421);
    }
});