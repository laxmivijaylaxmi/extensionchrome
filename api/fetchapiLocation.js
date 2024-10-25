 const LOCATION_ENDPOINT = "https://ttp.cbp.dhs.gov/schedulerapi/locations/?temporary=false&inviteOnly=false&operational=true&serviceName=Global+Entry";

export const fetchlocations =()=> {
    fetch(LOCATION_ENDPOINT)
        .then(response => {
           
            if (!response.ok) {
                throw new Error("Network response was not ok: " + response.statusText);
            }

            return response.json(); 
        })
        .then(data => {
            const filterdata = data.map(loc=>({
                "id":loc.id,
                "name":loc.name,
                "shortName":loc.shortName,
                "tzData":loc.tzData
            }))
            const filteredLocations = filterdata.sort((a, b) => a.name.localeCompare(b.name));

            chrome.storage.local.set({locations:filteredLocations})
            console.log(filteredLocations);
            
        })
        .catch(err => {
            console.log("Fetch error:", err); 
        });
}
