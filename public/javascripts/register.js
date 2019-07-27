
window.deviceToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudElkIjoxLCJpYXQiOjE1NjM4MTEyNjcsImV4cCI6MTU2Mzg5NzY2N30.OjLHPQrYRRJ_ie8qKwvqtUqueGv_0kplLuSWkYY3qqU';
window.merchantId = 1;
window.baseUrl = 'http://localhost:8080/';
window.accessToken = '';
window.playerData;
var registerDiv = document.getElementById('registerDiv');
var quizDiv = document.getElementById('quizDiv');
var mobileNumber = document.getElementById('mobile');
var playerName = document.getElementById('playerName');
var playerEmail = document.getElementById('playerEmail');

function submitValidate() {
    let mobile = mobileNumber.value;
    let name = playerName.value;
    let email = playerEmail.value;
    let gender = $("input[name=radioGender]:checked").val();

    if (mobile == '') {
        showError('Please enter mobile number.')
        return false;
    }
    if (email == '') {
        showError('Please enter email.')
        return false;
    }
    if (name == '') {
        showError('Please enter name.')
        return false;
    }

    if (gender == undefined) {
        showError('Please select gender.')
        return false;
    }

    callRegister();
}

function callRegister() {
    let url = window.baseUrl + 'register';

    let req = {
        "name": playerName.value,
        "contact_number": mobileNumber.value,
        "email": playerEmail.value,
        "gender": "M"
    };

    axios.post(url, req, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "x-device-token": window.deviceToken,
            "merchant_id": window.merchantId
        }
    }
    ).then((res) => {
        let response = res.data;
        if (response.error == false && response.status == 'SUCCESS') {
            let otp = prompt(response.data.message);

            if (otp.length != null && otp != '' && otp.length == 6) {
                validateOTP(otp, response.data.action);
            }


        } else if (response.hasOwnProperty('message')) {
            showError(response.message);
        } else {
            showError('Some error occured');
        }
        return true;
    }).catch((err) => {
        console.log(err);
    });
}

function validateOTP(otp, action) {

    let url = window.baseUrl + 'register-otp';

    let req = {
        "contact_number": mobileNumber.value,
        "action": action,
        "otp": otp
    };

    axios.post(url, req, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "x-device-token": window.deviceToken,
            "merchant_id": window.merchantId
        }
    }
    ).then((res) => {
        let response = res.data.responseArr;
        if (response.error == false && response.status == 'SUCCESS') {
            if (response.data.hasOwnProperty('accessToken')) {
                window.accessToken = response.data.accessToken;
                window.playerData = response.data.player;

                registerDiv.hidden = true;
                quizDiv.hidden = false;
            }
        } else if (response.hasOwnProperty('message')) {
            showError(response.message);
        } else {
            showError('Some error occured');
        }
        return true;
    }).catch((err) => {
        console.log(err);
    });
}


function showError(err) {
    if (err == '') {
        return false;
    }
    var span = document.getElementById('errorMsg');
    span.textContent = err;
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.style.backgroundColor = '#ce2b2b';

    setTimeout(function () { x.className = x.className.replace("show", ""); }, 150000);
}

