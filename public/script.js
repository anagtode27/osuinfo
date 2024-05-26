document.addEventListener('DOMContentLoaded', () => {
    button = document.getElementById("btn");
    button.addEventListener("click", () => getUserData());  
});

const getTextInput = (elementId) => {
    return document.getElementById(elementId).value;
}

const getUserData = async () => {
    const user_name = getTextInput("user-form");
    
    //console.log(user_name + " 1");

    // Send request for first endpoint
    let api_url = `/get_user_data/${user_name}`;
    let fetch_response = await fetch(api_url);
    const data_user = await fetch_response.json();
    //console.log(data_user);

    //console.log(user_name + " 2");

    // Send request for second endpoint
    //console.log(data_user[0].user_id);
    //console.log(`/get_user_pfp/${data_user[0].user_id}`);
    api_url = `/get_user_pfp/${data_user[0].user_id}`;
    fetch_response = await fetch(api_url);
    const img_b64 = await fetch_response.text();
    //console.log(base64);
    document.getElementById("img").src = 'data:image/jpeg;base64,' + img_b64;
};




