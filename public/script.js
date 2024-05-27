document.addEventListener('DOMContentLoaded', () => {
    button = document.getElementById("btn");
    button.addEventListener("click", () => getUserData());  
});

const getTextInput = (elementId) => {
    return document.getElementById(elementId).value;
}

const getUserData = async () => {

    const user_name = getTextInput("user-form");

    // Get general info
    let api_url = `/get_user_data/${user_name}`;
    let fetch_response = await fetch(api_url);
    const data_user = await fetch_response.json();
    console.log(data_user);

    // Get pfp
    api_url = `/get_user_pfp/${data_user[0].user_id}`;
    fetch_response = await fetch(api_url);
    const img_b64 = await fetch_response.text();
    document.getElementById("img").src = 'data:image/jpeg;base64,' + img_b64; // move this to populate function

    // Get recent scores
    api_url = `/get_user_recent/${user_name}`;
    fetch_response = await fetch(api_url);
    const data_recent_scores = await fetch_response.json();
    console.log(data_recent_scores);

    const consolidated_data = [data_user, img_b64, data_recent_scores];
    // console.log(consolidated_data);
};

// const populateInformation = (data) => {

//}




