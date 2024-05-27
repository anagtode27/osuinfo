let myChart;

document.addEventListener('DOMContentLoaded', () => {
    button = document.getElementById("btn");
    button.addEventListener("click", () => getUserData());  
});

const getTextInput = (elementId) => {
    return document.getElementById(elementId).value;
}

const getUserData = async () => {

    const user_name = getTextInput("userInput");

    // Get general info
    let api_url = `/get_user_data/${user_name}`;
    let fetch_response = await fetch(api_url);
    const data_user = await fetch_response.json();
    //console.log(data_user);

    // Get pfp
    api_url = `/get_user_pfp/${data_user[0].user_id}`;
    fetch_response = await fetch(api_url);
    const img_b64 = await fetch_response.text();
    document.getElementById("pfp_img").src = 'data:image/jpeg;base64,' + img_b64; // move this to populate function

    // Get recent scores
    api_url = `/get_user_recent/${user_name}`;
    fetch_response = await fetch(api_url);
    const data_recent_scores = await fetch_response.json();
    //console.log(data_recent_scores);

    const consolidated_data = [data_user, img_b64, data_recent_scores];
    //console.log(consolidated_data);

    card = document.getElementById("card");

    populateInfo(consolidated_data, card);
};

const populateInfo = (data, card) => {
    // card.innerHTML = "";

    // Doing this directly in the src giving some issues
    const imgSource = 'data:image/jpeg;base64,' + data[1];
    
    card.innerHTML = `
        <div class="cardcontainer">
            <img id="pfp_img" src="${imgSource}" alt="Profile Picture">
            <h2 id="user_name">${data[0][0].username}</h2>
            <p id="country_origin">${data[0][0].country}</p>
            <p id="join_date">${data[0][0].join_date}</p>
            <p id="play_count">Playcount: ${data[0][0].playcount}</p>
            <p id="global_ranking">Global Ranking: ${data[0][0].pp_rank}</p>
            <p id="country_ranking">Country Ranking: ${data[0][0].pp_country_rank}</p>
            <p id="performance_pts">Performance Pts: ${data[0][0].pp_raw}</p>
            <p id="time_played">Time Played: ${data[0][0].total_seconds_played}</p>
            <p id="accuracy">Accuracy: ${data[0][0].accuracy}</p>
            <p id="level">Level: ${data[0][0].level}</p>
        </div>
    `;

    /* 
    const ctx = document.getElementById('myChart');

    if (myChart) {
        // If it does, destroy it before creating a new one
        myChart.destroy();
    }
      
    myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['SS (H)', 'SS', 'S (H)', 'S', 'A'],
        datasets: [{
          label: '',
          data: [data[0][0].count_rank_ssh, data[0][0].count_rank_ss, data[0][0].count_rank_sh, data[0][0].count_rank_s, data[0][0].count_rank_a],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
            y: {
                display: false
            },
            x: {
                display: false
            }
        },
        plugins: {
            title: {
                display: true,
                text: "Rank Distribution"
            }
        }
      }
    })
    */
}






