document.addEventListener('DOMContentLoaded', () => {
    button = document.getElementById("btn");
    button.addEventListener("click", () => getUserData());  
});

const getTextInput = (elementId) => {
    return document.getElementById(elementId).value;
}

const getUserData = async () => {
    const user_name = getTextInput("user-form");
    //console.log(user_name)
    const api_url = `/get_user_data/${user_name}`;
    const fetch_response = await fetch(api_url);
    const data = await fetch_response.json();
    //console.log(data);
};




