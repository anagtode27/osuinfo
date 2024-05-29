document.addEventListener('DOMContentLoaded', () => {
    button = document.getElementById("btn");
    button.addEventListener("click", () => getUserData());  
});

const getTextInput = (elementId) => {
    if (document.getElementById(elementId).value === "") {
        return -1;
    } 
    else {
        return document.getElementById(elementId).value.trim();
    }
};

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const getCountryName = (countryCode) => {
    if (isoCountries.hasOwnProperty(countryCode)) {
        return isoCountries[countryCode];
    } 
    else {
        return countryCode;
    }
}

const getUserData = async () => {
    try { 
        
        // Since this is the onclick function, we need to clean up the last request, if there was one
        document.getElementById("plays").innerHTML = "";

        // And also need to check if cardContainer and canvas exist, remove if they di
        const potentiallyRemove = document.getElementById("cardContainer");
        if (potentiallyRemove) {
            potentiallyRemove.remove(); // this also takes care of myChart.destroy(); AND the global declaration of myChart. 
        }                               // not fully sure how though. should look into this.

        // Then, validate the input
        const user_name = getTextInput("userInput");
        if (user_name === -1) {
            document.getElementById("statusText").innerHTML = "Please don't leave the name blank!"; 
            throw new Error ("Blank username");
        } 

        // Get general info
        let api_url = `/get_user_data/${user_name}`;
        let fetch_response = await fetch(api_url);
        const data_user = await fetch_response.json();
        //console.log(data_user);

        // Get pfp
        api_url = `/get_user_pfp/${data_user[0].user_id}`;
        fetch_response = await fetch(api_url);
        const pfp_img_b64 = await fetch_response.text();

        // Get recent scores
        api_url = `/get_user_best/${user_name}`;
        fetch_response = await fetch(api_url);
        const compiled_data_user_best = await fetch_response.json();
        // use map function here to get the thumbnail for each beatmap 

        // Combine data into a single array, pass to populate functions
        const consolidated_data = [data_user, pfp_img_b64, compiled_data_user_best];
        console.log(consolidated_data);
        populateUserCard(consolidated_data);
        populateUserPlays(consolidated_data);
    }
    catch (error) {
        console.error(error);
    }
};

const populateUserCard = (data) => {

    // Decode img base64 into proper source
    const imgSource = 'data:image/jpeg;base64,' + data[1];

    // Splits date into <date>, <time> array and using date section in html
    const joinDateInfo = data[0][0].join_date.split(" ");

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
    timePlayed.textContent = `${Math.round(parseFloat(data[0][0].total_seconds_played) / 3600)} Hours`;
    container3.appendChild(timePlayed);

    const level = document.createElement('p');
    level.textContent = `Level ${Math.round(parseInt(data[0][0].level))}`;
    container3.appendChild(level);

    // Append the third container to the main container
    cardContainer.appendChild(container3);

    // Append cardContainer to the card element that exists in the DOM already
    const card = document.getElementById("card");
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

    // This looks random but read comment
    document.getElementById("statusText").innerHTML = ""; // Remove the status text AFTER populating the card,
                                                          // otherwise it looks jank because of delay
                        
};
// data[2][0][0].rank 


// ${data[2][1][0].title} (${data[2][1][0].version})
const populateUserPlays = (data) => { 

    // PLEASE clean up this function with a loop.

    document.getElementById("plays").innerHTML = `
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
        </tr>
        <tr class="bestPlay">
            <td>&#128081;</td>
            <td>${data[2][0][0].rank}</td>
            <td>${data[2][1][0][0].title} (${data[2][1][0][0].version})</td>
            <td>WIP</td>
            <td>${numberWithCommas(data[2][0][0].maxcombo)}x</td>
            <td>${numberWithCommas(Math.round(parseInt(data[2][0][0].pp) * 100) / 100)}pp</td>
        </tr>
        <tr>
            <td>#2</td>
            <td>${data[2][0][1].rank}</td>
            <td>${data[2][1][1][0].title} (${data[2][1][1][0].version})</td>
            <td>WIP</td>
            <td>${numberWithCommas(data[2][0][1].maxcombo)}x</td>
            <td>${numberWithCommas(Math.round(parseInt(data[2][0][1].pp) * 100) / 100)}pp</td>
        </tr>
        <tr>
            <td>#3</td>
            <td>${data[2][0][2].rank}</td>
            <td>${data[2][1][2][0].title} (${data[2][1][2][0].version})</td>
            <td>WIP</td>
            <td>${numberWithCommas(data[2][0][2].maxcombo)}x</td>
            <td>${numberWithCommas(Math.round(parseInt(data[2][0][2].pp) * 100) / 100)}pp</td>
        </tr>
        <tr>
            <td>#4</td>
            <td>${data[2][0][3].rank}</td>
            <td>${data[2][1][3][0].title} (${data[2][1][3][0].version})</td>
            <td>WIP</td>
            <td>${numberWithCommas(data[2][0][3].maxcombo)}x</td>
            <td>${numberWithCommas(Math.round(parseInt(data[2][0][3].pp) * 100) / 100)}pp</td>
        </tr>  
        <tr>
            <td>#5</td>
            <td>${data[2][0][4].rank}</td>
            <td>${data[2][1][4][0].title} (${data[2][1][4][0].version})</td>
            <td>WIP</td>
            <td>${numberWithCommas(data[2][0][4].maxcombo)}x</td>
            <td>${numberWithCommas(Math.round(parseInt(data[2][0][4].pp) * 100) / 100)}pp</td>
        </tr>    
    </table> 
    `;


    
}





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
    'KN' : 'Saint Kitts And Nevis',
    'LC' : 'Saint Lucia',
    'MF' : 'Saint Martin',
    'PM' : 'Saint Pierre And Miquelon',
    'VC' : 'Saint Vincent And Grenadines',
    'WS' : 'Samoa',
    'SM' : 'San Marino',
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
    'SJ' : 'Svalbard And Jan Mayen',
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
    'TC' : 'Turks And Caicos Islands',
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





