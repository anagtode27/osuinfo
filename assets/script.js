// When document is fully loaded, attach eventlistener
document.addEventListener('DOMContentLoaded', () => {
    userButton = document.getElementById("userBtn");
    beatmapButton = document.getElementById("beatmapBtn");
    if (userButton != null) {
        userButton.addEventListener("click", () => onUserButtonClick("userBtn"));  
    }
    else if (beatmapButton != null) {
        beatmapButton.addEventListener("click", () => onBeatmapButtonClick("beatmapBtn"));  
    }
    else {
        console.log("hi"); // placeholder
    }
});

// Handles getting and checking if input is empty string or not
const getTextInput = (elementId) => {
    if (document.getElementById(elementId).value === "") {
        return -1;
    } 
    else {
        return document.getElementById(elementId).value.trim();
    }
};

// Thanks stackoverflow lol
const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Translates country code using massive dictionary at the bottom 
const getCountryName = (countryCode) => {
    if (isoCountries.hasOwnProperty(countryCode)) {
        return isoCountries[countryCode];
    } 
    else {
        return countryCode;
    }
};

// Translates country code using massive dictionary at the bottom 
const getMapStatus = (int) => {
    return mapStatus[int];
};

// Controls the state of button 
const lockButton = (button) => {
    canClick = false;
    button.disabled = true;
    button.classList.add("lockedBtn");
    button.classList.remove("unlockedBtn"); 
};
const unlockButton = (button) => {
    canClick = true;
    button.disabled = false;
    button.classList.add("unlockedBtn");
    button.classList.remove("lockedBtn");
}

// Clears relevant texts on the field
const resetDisplay = () => {
    // Shared by all 3
    document.getElementById("statusText").innerHTML = "";

    // Specific to user
    // Make this check to see what page ur on
    const plays = document.getElementById("plays");
    if (plays != null) {
        plays.innerHTML = "";
    }
    const cardContainer = document.getElementById("cardContainer"); // (must do this check because its removing from the DOM)
    if (cardContainer) {
        cardContainer.remove();
    }

    // Specific to beatmap
    const cover = document.getElementById("cover");
    if (cover != null) {
        cover.src = "";
    }
    const infoCard = document.getElementById("infoCard");
    infoCard.style.border = "none";
    infoCard.style.boxShadow = "";

    if (infoCard != null) {
        infoCard.innerHTML = "";
    }
    const difficultiesText = document.getElementById("difficultiesText");
    if (difficultiesText != null) {
        difficultiesText.innerHTML = "";
    }
    const needSpace = document.getElementById("needSpace");
    if (needSpace) {
        needSpace.remove();
    }
    // No check here because it's a class selector 
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => dropdown.remove());
};

// Controls the visibility of the loading spinner
const showLoading = () => {
    loadingText = document.getElementById("loadingDiv").style.display = "block";
};
const hideLoading = () => {
    loadingText = document.getElementById("loadingDiv").style.display = "none";
};

// Attempt to fetch general info
const getUserGeneralInfo = async (userName) => {
    try {
        let url = `/get_user_data/${userName}`;
        let response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
            throw new Error("Issue getting general data.");
        }
        return data;
    }
    catch (error) {
        console.error(error);
    }
};

// Attempt to fetch pfp data
const getUserPfp = async (userId) => {
    try {
        let url = `/get_user_pfp/${userId}`;
        let response = await fetch(url);
        const data_b64 = await response.text();
        if (!response.ok) {
            throw new Error("Issue getting user pfp data.");
        }
        return data_b64;
    }
    catch (error) {
        console.error(error);
    }
};

// Attempt to fetch best score data
const getUserBestScores = async (userName) => {
    try {
        url = `/get_user_best/${userName}`;
        let response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
            throw new Error("Issue getting best score data.");
        }
        return data;
    }
    catch (error) {
        console.error(error);
    }
};

// Driver function for user data
const onUserButtonClick = async (btn) => {
    try {
        const button = document.getElementById(btn);
        lockButton(button);
        resetDisplay();

        // Validate input for empty string
        const userName = getTextInput("userInput");
        if (userName === -1) {
            document.getElementById("statusText").innerHTML = "Please don't leave the name blank!";
            unlockButton(button);
            throw new Error("Blank username provided.");
        }

        showLoading();

        // Get data using API
        const userGeneralInfo = await getUserGeneralInfo(userName);
        const userPfp = await getUserPfp(userGeneralInfo[0].user_id);
        const userBestScores = await getUserBestScores(userName);

        hideLoading();
        unlockButton(button);

        // Mash data into 1 array, pass that array to populate functions
        const consolidatedData = [userGeneralInfo, userPfp, userBestScores];
        console.log(consolidatedData);
        populateUserCard(consolidatedData);
        populateUserPlays(consolidatedData);
    }
    catch (error) {
        console.error(error);
    }
};

// THIS FUNCTION NEEDS REFACTORING, BUT IDK HOW RN.
// Because of the canvas, I think I need to have the items literally on the dom
// So I don't think I can use InnerHTML. But I should look into this more.
// This function builds and populates the usercard with the compiled json data
const populateUserCard = (data) => {

    /* ########################################################
    FOLLOWING LINES BUILD THE FOLLOWING FRAMEWORK IN THE DOM

    <div class="cardcontainer">
        <div class="container1">
            <img src="src" alt="pfp">
            <div class="innerContainer1">
                <a href="profile link"><h2 id="user_name">Souperman</h2></a>
                <p>United States</p>
                <p>2018-1-30</p>
                <p>Playcount: 37,000</p>
            </div>
            <div class="canvasContainer">
                <canvas id="myChart"></canvas>
            </div>
        </div>
        <div class="container2">
            <p>Ranked #35,000 globally</p>
            <p>Performance Pts: 5,423</p>
            <p>Accuracy: 95.23%</p>
        </div>
        <div class="container3">
            <p>Ranked #Number in the United States</p>
            <p>500 hours logged</p>
            <p>Level: 95</p>
        </div>
    </div>
    ######################################################## */ 

    // Decode img base64 into proper source
    const imgSource = 'data:image/jpeg;base64,' + data[1];

    // Splits date into <date>, <time> array and using date section in html
    const joinDateInfo = data[0][0].join_date.split(" ");

    // Create the main container
    const cardContainer = document.createElement('div');
    cardContainer.className = 'cardContainer';
    cardContainer.id = "cardContainer";

    // Create the first inner container
    const container1 = document.createElement('div');
    container1.className = 'container1';

    // Create the image for the profile picture
    const pfpImg = document.createElement('img');
    pfpImg.alt = 'Profile Picture';
    pfpImg.src = imgSource;
    container1.appendChild(pfpImg);

    // Create the inner container for user info
    const innerContainer1 = document.createElement('div');
    innerContainer1.className = 'innerContainer1';

    const userName = document.createElement('h2');
    userName.textContent = data[0][0].username;
    userName.id = "user_name";

    // Make the h2 a link
    const userLink = document.createElement('a');
    userLink.href = `https://osu.ppy.sh/users/${data[0][0].user_id}`; 
    userLink.target = "_blank";
    userLink.appendChild(userName);
    innerContainer1.appendChild(userLink);

    const countryOrigin = document.createElement('p'); 
    countryOrigin.textContent = getCountryName(data[0][0].country);
    innerContainer1.appendChild(countryOrigin);

    const joinDate = document.createElement('p');
    joinDate.textContent = `Joined on ${joinDateInfo[0]}`;
    innerContainer1.appendChild(joinDate);

    const playCount = document.createElement('p');
    playCount.textContent = `${numberWithCommas(parseInt(data[0][0].playcount))} plays logged`;
    innerContainer1.appendChild(playCount);

    // Append the inner container to the first container
    container1.appendChild(innerContainer1);

    const canvasContainer = document.createElement('div');
    canvasContainer.className = "canvasContainer";
    container1.appendChild(canvasContainer)

    // Create the canvas for the chart
    const canvas = document.createElement('canvas');
    canvas.id = 'myChart';
    canvasContainer.appendChild(canvas);

    // Append the first container to the main container
    cardContainer.appendChild(container1);

    // Create the second inner container
    const container2 = document.createElement('div');
    container2.className = 'container2';

    // Create and append elements to the second container
    const globalRanking = document.createElement('p');
    globalRanking.textContent = `#${numberWithCommas(parseInt(data[0][0].pp_rank))} Globally`;
    container2.appendChild(globalRanking);

    const performancePts = document.createElement('p');
    performancePts.textContent = `${numberWithCommas(Math.round(parseInt(data[0][0].pp_raw)))}pp`;
    container2.appendChild(performancePts);

    const accuracy = document.createElement('p');
    accuracy.textContent = `${Math.round(parseFloat(data[0][0].accuracy) * 100) / 100}% Acc`;
    container2.appendChild(accuracy);

    // Append the second container to the main container
    cardContainer.appendChild(container2);

    // Create the third inner container
    const container3 = document.createElement('div');
    container3.className = 'container3';

    // Create and append elements to the third container
    const countryRanking = document.createElement('p');
    countryRanking.textContent = `(#${numberWithCommas(parseInt(data[0][0].pp_country_rank))} in ${data[0][0].country})`;
    container3.appendChild(countryRanking);

    const timePlayed = document.createElement('p');
    timePlayed.textContent = `${numberWithCommas(Math.round(parseFloat(data[0][0].total_seconds_played) / 3600))} Hours`;
    container3.appendChild(timePlayed);

    const level = document.createElement('p');
    level.textContent = `Level ${Math.round(parseInt(data[0][0].level))}`;
    container3.appendChild(level);

    // Append the third container to the main container
    cardContainer.appendChild(container3);

    // Append cardContainer to the card element that exists in the DOM already
    const card = document.getElementById("userCard");
    card.appendChild(cardContainer);

    // Following lines configure the chart, using Chart.js
    const ctx = document.getElementById('myChart');
    
    const amountOfSS = parseInt(data[0][0].count_rank_ssh) + parseInt(data[0][0].count_rank_ss);
    const amountOfS = parseInt(data[0][0].count_rank_sh) + parseInt(data[0][0].count_rank_s);
    const amountOfA = parseInt(data[0][0].count_rank_a);

    new Chart(ctx, {
        type: 'pie',
        data: {
        labels: ['SS', 'S', 'A'],
            datasets: [{
            label: '',
            data: [amountOfSS, amountOfS, amountOfA],
            backgroundColor: ['#c30b90', '#009daa', '#72c904'], 
            borderColor: 'grey', 
            borderWidth: 1 
            }]
        },
        options: {
            scales: {
                y: {
                display: false
                }
            },
        plugins: {
            title: {
                display: true,
                text: "Grade Distribution"
            },
            legend: {
                display: false
            }
          }
        }
    });
};

// Creates and populates a table with the compiled json data
const populateUserPlays = (data) => {
    let playsHTML = `
    <table>
        <div class="headerContainer">
            <div class="playsHeader">${data[0][0].username}'s Best Plays:</div>
        </div>
        <tr class="header">
            <th>Rank</th>
            <th>Grade</th>
            <th>Name</th>
            <th>Mods</th>
            <th>Max Combo</th>
            <th>Performance Points</th>
        </tr>`;

    for (let i = 0; i < 5; i++) {
        const rank = i === 0 ? '👑' : `#${i + 1}`;
        const play = data[2][0][i];
        const song = data[2][1][i][0];
        playsHTML += `
        <tr>
            <td>${rank}</td>
            <td>${play.rank}</td>
            <td> <a href="https://osu.ppy.sh/beatmapsets/${song.beatmapset_id}#osu/${song.beatmap_id}" target="_blank"> ${song.title} <br> (${song.version}) </a></td>
            <td>WIP</td>
            <td>${numberWithCommas(play.maxcombo)}x</td>
            <td>${numberWithCommas(Math.round(parseInt(play.pp) * 100) / 100)}pp</td>
        </tr>`;
    }

    playsHTML += `</table>`;
    document.getElementById("plays").innerHTML = playsHTML;
};

// Driver function for user data
const onBeatmapButtonClick = async (btn) => {
    try {
        console.log("clicked");
        const button = document.getElementById(btn);
        lockButton(button);
        resetDisplay();

        // Validate input for empty string
        const id = getTextInput("userInput");
        if (id === -1) {
            document.getElementById("statusText").innerHTML = "Please don't leave the ID blank!";
            unlockButton(button);
            throw new Error("Blank beatmap ID provided.");
        }

        showLoading();

        // Get data using API
        const beatmapGeneralInfo = await getBeatmapGeneralInfo(id);
        const beatmapCoverImg = await getBeatmapCoverImg(id);
        const beatmapThumbImg = await getBeatmapThumbImg(id);

        hideLoading();
        unlockButton(button);

        // Mash data into 1 array, pass that array to populate functions
        const consolidatedData = [beatmapGeneralInfo, beatmapCoverImg, beatmapThumbImg];
        console.log(beatmapGeneralInfo);
        //console.log(consolidatedData);
        populateInfoCard(consolidatedData);
        populateDiffSection(consolidatedData);
        
    }
    catch (error) {
        console.error(error);
    }
};

// Attempt to general beatmap info
const getBeatmapGeneralInfo = async (beatmapId) => {
    try {
        let url = `/get_beatmaps/${beatmapId}`;
        let response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
            throw new Error("Issue getting general beatmap information.");
        }
        return data;
    }
    catch (error) {
        console.error(error);
    }
};

// Attempt to get beatmap cover image
const getBeatmapCoverImg = async (beatmapSETId) => {
    try {
        let url = `/get_cover_img/${beatmapSETId}`;
        let response = await fetch(url);
        const data_b64 = await response.text();
        if (!response.ok) {
            throw new Error("Issue getting user beatmap cover image.");
        }
        return data_b64;
    }
    catch (error) {
        console.error(error);
    }
};

// Attempt to get beatmap thumbnail image
const getBeatmapThumbImg = async (beatmapSETId) => {
    try {
        let url = `/get_thumbnail_img/${beatmapSETId}`;
        let response = await fetch(url);
        const data_b64 = await response.text();
        if (!response.ok) {
            throw new Error("Issue getting user beatmap cover image.");
        }
        return data_b64;
    }
    catch (error) {
        console.error(error);
    }
};

const populateInfoCard = async (data) => {
    document.getElementById("cover").src = 'data:image/jpeg;base64,' + data[1];
    let infoHTML = `
        <div class="row1">
            <p>${data[0][0].title}</p>
            <p>${data[0][0].artist}</p>
            </div>
        <div class="row2">
            <p>${getMapStatus(data[0][0].approved)}</p>
            <p>Mapped by ${data[0][0].creator}</p>
        </div>`;
    
    document.getElementById("infoCard").innerHTML = infoHTML;
    document.getElementById("infoCard").style.border = "1px solid black";
    document.getElementById("infoCard").style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    document.getElementById("infoCard").style.background = 'data:image/jpeg;base64,' + data[1];
};


const populateDiffSection = async (data) => {
    document.getElementById("difficultiesText").innerHTML = "Available Difficulties:";
    // Sort function taken from copilot (learn how this exactly works later)
    data[0].sort((a, b) => a.difficultyrating - b.difficultyrating);

    const container = document.getElementById("container");
    for (let i = 0; i < data[0].length; i++) {
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';

        const exposedInfo = document.createElement('div');
        exposedInfo.className = 'exposedInfo';
        exposedInfo.innerHTML = 
        `<p> ${data[0][i].version} </p> 
         <p> ${(Math.round(data[0][i].difficultyrating * 100)/100).toFixed(2)}</p>`;
        dropdown.appendChild(exposedInfo);

        const hiddenInfo = document.createElement('div');
        hiddenInfo.className = 'hiddenInfo';
        hiddenInfo.innerHTML = 
        `<p> AR: ${data[0][i].diff_approach} </p>
         <p> OD: ${data[0][i].diff_overall} </p>
         <p> Passrate: ${Math.round(data[0][i].passcount / data[0][i].playcount * 100 * 100) / 100}% </p>
         <p> BPM: ${data[0][i].bpm} </p>
         <p> Max Combo: ${numberWithCommas(data[0][i].max_combo)}x </p>
         <p> Drain Time: ${data[0][i].hit_length} seconds </p>`;
        dropdown.appendChild(hiddenInfo);
        container.appendChild(dropdown);
    }
    const needSpace = document.createElement('div');
    needSpace.classList.add("needSpace");
    needSpace.id = "needSpace";
    container.appendChild(needSpace);
};

/*
const populateDiffSection = async (data) => {

    for(i = 0; i<data[0].length; i++) {
        container = document.getElementById("container");
        
        let templateHTML = `
        <div class="dropdown">
            <div class="exposedInfo">
                <p> Version </p>
                <p> Star Rating </p>
            </div>
                <div class="hiddenInfo">
                    <p> OD </p>
                    <p> Pass Ratio </p>
                    <p> BPM </p>
                    <p> Max Combo </p>
                    <p> AR </p>
                    <p> Drain Time </p>
            </div>
        </div>`;
        
        container.innerHTML += templateHTML;
    }
};
*/

// Dictionary of map status
let mapStatus = {
    '4' : 'Loved',
    '3' : 'Qualified',
    '2' : 'Approved',
    '1' : 'Ranked',
    '0' : 'Pending',
    '-1' : 'WIP',
    '-2' : 'Graveyard',
};

// Dictionary of countries 
let isoCountries = {
    'AF' : 'Afghanistan',
    'AX' : 'Aland Islands',
    'AL' : 'Albania',
    'DZ' : 'Algeria',
    'AS' : 'American Samoa',
    'AD' : 'Andorra',
    'AO' : 'Angola',
    'AI' : 'Anguilla',
    'AQ' : 'Antarctica',
    'AG' : 'Antigua And Barbuda',
    'AR' : 'Argentina',
    'AM' : 'Armenia',
    'AW' : 'Aruba',
    'AU' : 'Australia',
    'AT' : 'Austria',
    'AZ' : 'Azerbaijan',
    'BS' : 'Bahamas',
    'BH' : 'Bahrain',
    'BD' : 'Bangladesh',
    'BB' : 'Barbados',
    'BY' : 'Belarus',
    'BE' : 'Belgium',
    'BZ' : 'Belize',
    'BJ' : 'Benin',
    'BM' : 'Bermuda',
    'BT' : 'Bhutan',
    'BO' : 'Bolivia',
    'BA' : 'Bosnia And Herzegovina',
    'BW' : 'Botswana',
    'BV' : 'Bouvet Island',
    'BR' : 'Brazil',
    'IO' : 'British Indian Ocean Territory',
    'BN' : 'Brunei Darussalam',
    'BG' : 'Bulgaria',
    'BF' : 'Burkina Faso',
    'BI' : 'Burundi',
    'KH' : 'Cambodia',
    'CM' : 'Cameroon',
    'CA' : 'Canada',
    'CV' : 'Cape Verde',
    'KY' : 'Cayman Islands',
    'CF' : 'Central African Republic',
    'TD' : 'Chad',
    'CL' : 'Chile',
    'CN' : 'China',
    'CX' : 'Christmas Island',
    'CC' : 'Cocos (Keeling) Islands',
    'CO' : 'Colombia',
    'KM' : 'Comoros',
    'CG' : 'Congo',
    'CD' : 'Congo, Democratic Republic',
    'CK' : 'Cook Islands',
    'CR' : 'Costa Rica',
    'CI' : 'Cote D\'Ivoire',
    'HR' : 'Croatia',
    'CU' : 'Cuba',
    'CY' : 'Cyprus',
    'CZ' : 'Czech Republic',
    'DK' : 'Denmark',
    'DJ' : 'Djibouti',
    'DM' : 'Dominica',
    'DO' : 'Dominican Republic',
    'EC' : 'Ecuador',
    'EG' : 'Egypt',
    'SV' : 'El Salvador',
    'GQ' : 'Equatorial Guinea',
    'ER' : 'Eritrea',
    'EE' : 'Estonia',
    'ET' : 'Ethiopia',
    'FK' : 'Falkland Islands (Malvinas)',
    'FO' : 'Faroe Islands',
    'FJ' : 'Fiji',
    'FI' : 'Finland',
    'FR' : 'France',
    'GF' : 'French Guiana',
    'PF' : 'French Polynesia',
    'TF' : 'French Southern Territories',
    'GA' : 'Gabon',
    'GM' : 'Gambia',
    'GE' : 'Georgia',
    'DE' : 'Germany',
    'GH' : 'Ghana',
    'GI' : 'Gibraltar',
    'GR' : 'Greece',
    'GL' : 'Greenland',
    'GD' : 'Grenada',
    'GP' : 'Guadeloupe',
    'GU' : 'Guam',
    'GT' : 'Guatemala',
    'GG' : 'Guernsey',
    'GN' : 'Guinea',
    'GW' : 'Guinea-Bissau',
    'GY' : 'Guyana',
    'HT' : 'Haiti',
    'HM' : 'Heard Island & Mcdonald Islands',
    'VA' : 'Holy See (Vatican City State)',
    'HN' : 'Honduras',
    'HK' : 'Hong Kong',
    'HU' : 'Hungary',
    'IS' : 'Iceland',
    'IN' : 'India',
    'ID' : 'Indonesia',
    'IR' : 'Iran, Islamic Republic Of',
    'IQ' : 'Iraq',
    'IE' : 'Ireland',
    'IM' : 'Isle Of Man',
    'IL' : 'Israel',
    'IT' : 'Italy',
    'JM' : 'Jamaica',
    'JP' : 'Japan',
    'JE' : 'Jersey',
    'JO' : 'Jordan',
    'KZ' : 'Kazakhstan',
    'KE' : 'Kenya',
    'KI' : 'Kiribati',
    'KR' : 'Korea',
    'KW' : 'Kuwait',
    'KG' : 'Kyrgyzstan',
    'LA' : 'Lao People\'s Democratic Republic',
    'LV' : 'Latvia',
    'LB' : 'Lebanon',
    'LS' : 'Lesotho',
    'LR' : 'Liberia',
    'LY' : 'Libyan Arab Jamahiriya',
    'LI' : 'Liechtenstein',
    'LT' : 'Lithuania',
    'LU' : 'Luxembourg',
    'MO' : 'Macao',
    'MK' : 'Macedonia',
    'MG' : 'Madagascar',
    'MW' : 'Malawi',
    'MY' : 'Malaysia',
    'MV' : 'Maldives',
    'ML' : 'Mali',
    'MT' : 'Malta',
    'MH' : 'Marshall Islands',
    'MQ' : 'Martinique',
    'MR' : 'Mauritania',
    'MU' : 'Mauritius',
    'YT' : 'Mayotte',
    'MX' : 'Mexico',
    'FM' : 'Micronesia, Federated States Of',
    'MD' : 'Moldova',
    'MC' : 'Monaco',
    'MN' : 'Mongolia',
    'ME' : 'Montenegro',
    'MS' : 'Montserrat',
    'MA' : 'Morocco',
    'MZ' : 'Mozambique',
    'MM' : 'Myanmar',
    'NA' : 'Namibia',
    'NR' : 'Nauru',
    'NP' : 'Nepal',
    'NL' : 'Netherlands',
    'AN' : 'Netherlands Antilles',
    'NC' : 'New Caledonia',
    'NZ' : 'New Zealand',
    'NI' : 'Nicaragua',
    'NE' : 'Niger',
    'NG' : 'Nigeria',
    'NU' : 'Niue',
    'NF' : 'Norfolk Island',
    'MP' : 'Northern Mariana Islands',
    'NO' : 'Norway',
    'OM' : 'Oman',
    'PK' : 'Pakistan',
    'PW' : 'Palau',
    'PS' : 'Palestinian Territory, Occupied',
    'PA' : 'Panama',
    'PG' : 'Papua New Guinea',
    'PY' : 'Paraguay',
    'PE' : 'Peru',
    'PH' : 'Philippines',
    'PN' : 'Pitcairn',
    'PL' : 'Poland',
    'PT' : 'Portugal',
    'PR' : 'Puerto Rico',
    'QA' : 'Qatar',
    'RE' : 'Reunion',
    'RO' : 'Romania',
    'RU' : 'Russian Federation',
    'RW' : 'Rwanda',
    'BL' : 'Saint Barthelemy',
    'SH' : 'Saint Helena',
    'KN' : 'Saint Kites And Nevis',
    'LC' : 'Saint Lucia',
    'MF' : 'Saint Martin',
    'PM' : 'Saint Pierre And Miquelon',
    'VC' : 'Saint Vincent And Grenadines',
    'WS' : 'Samoa',
    'SM' : 'San Marion',
    'ST' : 'Sao Tome And Principe',
    'SA' : 'Saudi Arabia',
    'SN' : 'Senegal',
    'RS' : 'Serbia',
    'SC' : 'Seychelles',
    'SL' : 'Sierra Leone',
    'SG' : 'Singapore',
    'SK' : 'Slovakia',
    'SI' : 'Slovenia',
    'SB' : 'Solomon Islands',
    'SO' : 'Somalia',
    'ZA' : 'South Africa',
    'GS' : 'South Georgia And Sandwich Isl.',
    'ES' : 'Spain',
    'LK' : 'Sri Lanka',
    'SD' : 'Sudan',
    'SR' : 'Suriname',
    'SJ' : 'Svalbard And Jan Mayon',
    'SZ' : 'Swaziland',
    'SE' : 'Sweden',
    'CH' : 'Switzerland',
    'SY' : 'Syrian Arab Republic',
    'TW' : 'Taiwan',
    'TJ' : 'Tajikistan',
    'TZ' : 'Tanzania',
    'TH' : 'Thailand',
    'TL' : 'Timor-Leste',
    'TG' : 'Togo',
    'TK' : 'Tokelau',
    'TO' : 'Tonga',
    'TT' : 'Trinidad And Tobago',
    'TN' : 'Tunisia',
    'TR' : 'Turkey',
    'TM' : 'Turkmenistan',
    'TC' : 'Turks And Cairo Islands',
    'TV' : 'Tuvalu',
    'UG' : 'Uganda',
    'UA' : 'Ukraine',
    'AE' : 'United Arab Emirates',
    'GB' : 'United Kingdom',
    'US' : 'United States',
    'UM' : 'United States Outlying Islands',
    'UY' : 'Uruguay',
    'UZ' : 'Uzbekistan',
    'VU' : 'Vanuatu',
    'VE' : 'Venezuela',
    'VN' : 'Viet Nam',
    'VG' : 'Virgin Islands, British',
    'VI' : 'Virgin Islands, U.S.',
    'WF' : 'Wallis And Futuna',
    'EH' : 'Western Sahara',
    'YE' : 'Yemen',
    'ZM' : 'Zambia',
    'ZW' : 'Zimbabwe'
};
