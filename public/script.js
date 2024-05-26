document.addEventListener('DOMContentLoaded', () => {
    button = document.getElementById("btn");
    button.addEventListener("click", () => getUserData());
});

const getUserData = async () => {
    const api_url = `/get_user_data/nglaundry`;
    const fetch_response = await fetch(api_url);
    const data = await fetch_response.json();
    console.log(data);
};

//const getTextInput = (elementId) => {
    //document.getElementById(elementId).getTextcontent //

//}


