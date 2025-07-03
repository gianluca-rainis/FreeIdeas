async function changeDataAccount() {    
    document.getElementById("modifyAccountInfo").addEventListener("click", () => {
        let username = document.getElementById("userNameAccount").innerHTML;
        let name = document.getElementById("userNameSurnameAccount").innerHTML.split(' ')[0];
        let surname = document.getElementById("userNameSurnameAccount").innerHTML.split(' ')[1];
        let email = document.getElementById("emailAccount").innerHTML;
        let description = document.getElementById("descriptionAccount").innerHTML;
        let image = document.getElementById("userImageAccount").src;

        document.getElementById("accountAsideInfo").innerHTML = `
            <img id="saveAccountInfo" src="./images/save.svg">
            <img id="cancelAccountInfo" src="./images/delete.svg">

            <div id="newDataSetAccount">
                <label>Username</label><input type="text" id="newuserNameAccount" maxlength="255" required>
                <label>Image</label><input type="file" id="newuserImageAccount" accept="image/png, image/jpeg, image/gif, image/x-icon, image/webp, image/bmp">
                <label>Name</label><input type="text" id="newuserAccountName" maxlength="255" required>
                <label>Surname</label><input type="text" id="newuserSurnameAccount" maxlength="255" required>
                <label>Email</label><input type="email" id="newemailAccount" maxlength="255" required>
                <label>Description</label><textarea type="text" rows="8" cols="25" id="newdescriptionAccount" maxlength="1000"></textarea>
            </div>
        `;

        document.getElementById("newuserNameAccount").value = username;
        document.getElementById("newuserAccountName").value = name;
        document.getElementById("newuserSurnameAccount").value = surname;
        document.getElementById("newemailAccount").value = email;
        document.getElementById("newdescriptionAccount").value = description;

        document.getElementById("saveAccountInfo").addEventListener("click", async () => {
            username = document.getElementById("newuserNameAccount").value;
            name = document.getElementById("newuserNameAccount").value;
            surname = document.getElementById("newuserSurnameAccount").value;
            email = document.getElementById("newemailAccount").value;
            description = document.getElementById("newdescriptionAccount").value;
            image = document.getElementById("newuserImageAccount").files[0]!=null?document.getElementById("newuserImageAccount").files[0]:image;
            
            const data = new FormData();
            data.append('username', username);
            data.append('name', name);
            data.append('surname', surname);
            data.append('email', email);
            data.append('description', description);
            data.append('image', image);

            async function sendData(data) {
                try {
                    const res = await fetch(`./api/modifyAccountInfo.php`, {
                        credentials: "include",
                        method: 'POST',
                        body: data
                    });

                    const resp = await res.json();

                    return resp;
                } catch (error) {
                    return null;
                }
            }

            const result = await sendData(data);

            if (!result) {
                printError(421);
            }
            else {
                if (result['success']) {
                    window.location.href = "./accountVoid.html";
                }
                else {
                    printError(result['error']);
                }
            }
        });

        document.getElementById("cancelAccountInfo").addEventListener("click", () => {
            window.location.href = "./accountVoid.html";
        });
    });
}

changeDataAccount();


/* DINAMIC PART */
error = false; // Error variable to print only the most specific error
tempBoolControl = false;

ldAccountData2();

async function ldAccountData2() {
    const SQLdata = await getDataFromDatabase2();

    if (SQLdata) {
        loadData2(SQLdata);
    }
    else {
        printError(421);
    }
}

async function getDataFromDatabase2() {
    try {
        const res = await fetch(`./api/getSessionData.php?data=account`, {
            credentials: "include"
        });

        const data = await res.json();

        return data;
    } catch (error) {
        return null;
    }
}

function printError(errorCode) {
    if (!error) {
        document.querySelector("main").innerHTML = `
            <h1 style="margin-top: 50px; margin-bottom: 50px; color: rgb(255, 0, 0);">ERROR ${errorCode}</h1>
            <div style="padding-top: calc(5%);"></div>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">We are sorry to inform you that the searched page aren't avable in this moment.</p>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">If the problem persist contact the author of the page.</p>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">For more info you can contact us via email at <a href="mailto:free_ideas@yahoo.com">free_ideas@yahoo.com</a></p>
            <div style="padding-top: calc(6%);"></div>
        `;

        document.querySelector("main").style.textAlign = "center";
        
        if (document.querySelector("header")) {
            document.querySelector("header").innerHTML = "";
            document.querySelector("header").style.visibility = "hidden";
        }

        error = true;
    }
}

function loadData2(SQLdata) {
    try {
        document.getElementById("userNameAccount").innerHTML = `${SQLdata['username']}`;
        document.getElementById("userImageAccount").src = `${SQLdata['userimage']!=null?SQLdata['userimage']:"./images/user.png"}`;
        document.getElementById("userNameSurnameAccount").innerHTML = `${SQLdata['name']} ${SQLdata['surname']}`;
        document.getElementById("emailAccount").innerHTML = `${SQLdata['email']}`;
        document.getElementById("descriptionAccount").innerHTML = `${SQLdata['description']!=null?SQLdata['description']:""}`;
    } catch (error) {
        printError(404);
    }
}