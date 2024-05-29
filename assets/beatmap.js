document.addEventListener('DOMContentLoaded', () => {
    button = document.getElementById("btn");
    button.addEventListener("click", () => getBeatmapInfo());  
});
// Slightly outdated, fix when merging this .js file into the main one. ? or maybe not, idk how to approach it yet
const getTextInput = (elementId) => {
    return document.getElementById(elementId).value;
}

const getBeatmapInfo = async () => {

    // Get general beatmap info
    const beatmap_id = getTextInput("beatmap-form");
    let api_url = `/get_beatmaps/${beatmap_id}`;
    let fetch_response = await fetch(api_url);
    const data_beatmap = await fetch_response.json();
    console.log(data_beatmap);

    // Get cover img (must use beatmapset id, not beatmap id)
    api_url = `/get_cover_img/${data_beatmap[0].beatmapset_id}`;
    fetch_response = await fetch(api_url);
    const cover_img_b64 = await fetch_response.text();
    document.getElementById("cover_img").src = 'data:image/jpeg;base64,' + cover_img_b64; // move this to populate function

    // Get thumbnail img (must use beatmapset id, not beatmap id)
    api_url = `/get_thumbnail_img/${data_beatmap[0].beatmapset_id}`;
    fetch_response = await fetch(api_url);
    const thumb_img_b64 = await fetch_response.text();
    document.getElementById("thumb_img").src = 'data:image/jpeg;base64,' + thumb_img_b64; // move this to populate function
};