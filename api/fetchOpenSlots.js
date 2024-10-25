import { handleNotification } from "../lib/handleNotification.js";

export const fetchOpenSlots = (result) => {
    console.log(result);
    const { locationId, startDate, endDate } = result;
    const appointment = `https://ttp.cbp.dhs.gov/schedulerapi/locations/${locationId}/slots?startTimestamp=${startDate}T00%3A00%3A00&endTimestamp=${endDate}T00%3A00%3A00`;

    fetch(appointment)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok: " + response.statusText);
        }
        return response.json();
      })
      .then(data => data.filter(slot => slot.active > 0)) 
      .then(filteredSlots => {
        console.log("Filtered Slots:", filteredSlots);
        handleNotification(filteredSlots); 
      })
      .catch(err => {
        console.log("Fetch error:", err);
      });
};
