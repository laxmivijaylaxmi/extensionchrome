export const handleNotification = (appointment) => {
    console.log("Filtered Slots to Notify:", appointment);
    if (appointment.length > 0) {
        createNotification(appointment[0]);
    }
}

const createNotification = (appointment) => {
    console.log("Attempting to create notification for:", appointment);
    chrome.notifications.create({
        type: "basic",
        iconUrl: "images/icon-48.png",
        title: "Global Entry",
        message: `Found an open interview at ${appointment.timestamp}`,
    }, (notificationId) => {
        if (chrome.runtime.lastError) {
            console.error("Notification error:", chrome.runtime.lastError.message);
        } else {
            console.log("Notification created with ID:", notificationId);
        }
    });
};