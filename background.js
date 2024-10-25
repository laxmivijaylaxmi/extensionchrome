import {fetchlocations} from "./api/fetchapiLocation.js";
import { fetchOpenSlots } from "./api/fetchOpenSlots.js";


let cachedPrefs ={};


chrome.runtime.onInstalled.addListener((details) => {
  fetchlocations();
  
});

// let data = {
//   event: "onStop/onStart",
//   prefs: {
//     locationId: "123",
//     startDate: "2024-09-23",
//     endDate: "2024-10-10",
//   },
// };

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  console.log("Message received in background:", data);
  const { event, prefs } = data;
  switch (event) {
    case "onStop":
      handleOnStop();
      break;
    case "onStart":
      handleOnStart(prefs);
      break;
    default:
      console.log("Unknown event");
      break;
  }
  sendResponse({ status: "received" });
  return true;
});

const handleOnStart = (prefs) => {
  cachedPrefs = prefs
  console.log("On start in background");
  console.log("prefs received:", prefs);
  chrome.storage.local.set({prefs});
  createAlarm();
  setRunningStatus(true)
 
};

const setRunningStatus =(isRunning)=>{
    chrome.storage.local.set({isRunning})
}


const handleOnStop = () => {
  console.log("On stop in background");
  stopAlarm();
  setRunningStatus(false);
  cachedPrefs ={};
};


const stopAlarm =()=>{
    chrome.alarms.clearAll()
    console.log("All alarms cleared");
}

const createAlarm =()=>{
    const ALARM_JOB_NAME = "myAlarm";
    chrome.alarms.get(ALARM_JOB_NAME,existAlarm=>{
        if(!existAlarm){
            chrome.alarms.create(ALARM_JOB_NAME,{periodInMinutes:1.0})
        }
    })

 
    console.log("Alarm created with a period of 1 minute");
} 
chrome.alarms.onAlarm.addListener(() => {
  console.log("onAlarm Scheduled code running...");
  if (cachedPrefs && cachedPrefs.locationId && cachedPrefs.startDate && cachedPrefs.endDate) {
    fetchOpenSlots(cachedPrefs);
  } else {
    console.log("Cached preferences are incomplete:", cachedPrefs);
  }
});