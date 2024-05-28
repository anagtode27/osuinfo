let myChart;

document.addEventListener('DOMContentLoaded', () => {
    button = document.getElementById("btn");
    button.addEventListener("click", () => getUserData());  
});

//document.addEventListener('DOMContentLoaded', () => {
//    addEventListenerIfElementExists("btn1", "click", () => getUserData());
//    // addEventListenerIfElementExists("btn2", "click", () => stuffHere());
//});

const getTextInput = (elementId) => {
    return document.getElementById(elementId).value;
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
    //document.getElementById("pfp_img").src = 'data:image/jpeg;base64,' + img_b64; // move this to populate function

    // Get recent scores
    api_url = `/get_user_recent/${user_name}`;
    fetch_response = await fetch(api_url);
    const data_recent_scores = await fetch_response.json();
    //console.log(data_recent_scores);

    const consolidated_data = [data_user, img_b64, data_recent_scores];
    // console.log(consolidated_data);

    populateInfo(consolidated_data);
};

const populateInfo = (data) => {
    // card.innerHTML = "";

    const imgSource = 'data:image/jpeg;base64,' + data[1];

    // Splits date into <date>, <time> array and using date section in html
    const joinDateInfo = data[0][0].join_date.split(" ");

    // Create the main container
    const cardContainer = document.createElement('div');
    cardContainer.className = 'cardcontainer';

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

    // Create and append elements to the inner container
    const userName = document.createElement('h2');
    userName.textContent = data[0][0].username;
    userName.id = "user_name";
    innerContainer1.appendChild(userName);

    const countryOrigin = document.createElement('p'); 
    countryOrigin.textContent = getCountryName(data[0][0].country);
    innerContainer1.appendChild(countryOrigin);

    const joinDate = document.createElement('p');
    joinDate.textContent = `Joined on ${joinDateInfo[0]}`;
    innerContainer1.appendChild(joinDate);

    const playCount = document.createElement('p');
    playCount.textContent = `${numberWithCommas(data[0][0].playcount)} plays`;
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
    globalRanking.textContent = `Ranked #${numberWithCommas(data[0][0].pp_rank)} in the world`;
    container2.appendChild(globalRanking);

    const performancePts = document.createElement('p');
    performancePts.textContent = `${numberWithCommas(Math.round(data[0][0].pp_raw))}pp`;
    container2.appendChild(performancePts);

    const accuracy = document.createElement('p');
    accuracy.textContent = `Accuracy: ${Math.round(data[0][0].accuracy * 100) / 100}%`;
    container2.appendChild(accuracy);

    // Append the second container to the main container
    cardContainer.appendChild(container2);

    // Create the third inner container
    const container3 = document.createElement('div');
    container3.className = 'container3';

    // Create and append elements to the third container
    const countryRanking = document.createElement('p');
    countryRanking.textContent = `Ranked #${numberWithCommas(data[0][0].pp_country_rank)} in ${data[0][0].country}`;
    container3.appendChild(countryRanking);

    const timePlayed = document.createElement('p');
    timePlayed.textContent = `${Math.round(Math.round(data[0][0].total_seconds_played / 3600))}hrs played`;
    container3.appendChild(timePlayed);

    const level = document.createElement('p');
    level.textContent = `Level: ${Math.round(data[0][0].level * 100) / 100}`;
    container3.appendChild(level);

    // Append the third container to the main container
    cardContainer.appendChild(container3);


    // 
    const card = document.getElementById("card");
    card.appendChild(cardContainer);


    /*

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

    */


    /*card.innerHTML = `
        <div class="cardcontainer">
            <div class="container1">
                <img id="pfp_img" src="${imgSource}" alt="Profile Picture">
                <div class="innerContainer1">
                    <h2 id="user_name">Souperman</h2>
                    <p id="country_origin">United States</p>
                    <p id="join_date">2018-1-30</p>
                    <p id="play_count">Playcount: 37,000</p>
                </div>
                <div>
                    <canvas id="myChart"></canvas>
                </div>
            </div>

            <div class="container2">
                <p id="global_ranking">Ranked #35,000 globally</p>
                <p id="performance_pts">Performance Pts: 5,423</p>
                <p id="accuracy">Accuracy: 95.23%</p>
            </div>

            <div class="container3">
                <p id="country_ranking">Ranked #Number in the United States</p>
                <p id="time_played">500 hours logged</p>
                <p id="level">Level: 95</p>
            </div>
        </div>

    `;
    */
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
                display: false,
                text: "Rank Distribution"
            },
            legend: {
                display: false
            }
        }
      }
    })

};


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




