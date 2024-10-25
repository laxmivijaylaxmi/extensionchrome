const locationIdElement = document.getElementById('locationId');
const startDateElement = document.getElementById("startDate");
const endDateElement = document.getElementById("endDate");

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

const RunningSpan = document.getElementById("runingSpan");
const StopSpan = document.getElementById("stopSpan");

//error:-
const LocationError = document.getElementById("locationIdError")
const StartDateError = document.getElementById("startDateError");
const EndDateError = document.getElementById("endDateError")



const hideElement =(elem)=>{
    elem.style.display="none"
}

const showElement =(elem)=>{
    elem.style.display=""
}

const disableElement =(elem)=>{
    elem.disabled = true
}

const enableElement =(elem)=>{
    elem.disabled= false;
}

const handleOnStartState= ()=>{
  //span
    showElement(RunningSpan);
    hideElement(StopSpan)
    //buttons:-
    disableElement(startButton)
    enableElement(stopButton)

    //inputs:-
    disableElement(locationIdElement)
    disableElement(startDateElement)
    disableElement(endDateElement)
}

const handleOnStopState =()=>{
   
   //span
    showElement(StopSpan);
    hideElement(RunningSpan)

    //button:-
    disableElement(stopButton);
    enableElement(startButton)

    //inputs:-
    enableElement(locationIdElement)
    enableElement(startDateElement)
    enableElement(endDateElement)
}

//error function:_
const performOnStartValidation = ()=>{
    if(!locationIdElement.value){
        showElement(LocationError)
    }
    else{
        hideElement(LocationError)
    }

    if(!startDateElement.value){
        showElement(StartDateError)
    }
    else{
        hideElement(StartDateError)
    }

    if(!endDateElement.value){
        showElement(EndDateError);
    }
    else{
        hideElement(EndDateError)
    }

    return locationIdElement.value &&  startDateElement.value && endDateElement.value
}




startButton.onclick = (event) => {
    const  allFieldsVaild = performOnStartValidation();
     if(allFieldsVaild){
        handleOnStartState()
    event.preventDefault();

    const prefs = {
        locationId: locationIdElement.value,
        startDate: startDateElement.value,
        endDate: endDateElement.value,
        tzData:locationIdElement.options[locationIdElement.selectedIndex].dataset.tz
    };

    chrome.runtime.sendMessage({ event: "onStart", prefs });
};
    }

stopButton.onclick = () => {
    handleOnStopState()
    chrome.runtime.sendMessage({ event: "onStop" });
};

chrome.storage.local.get(["locationId", "startDate", "isRunning" ,"endDate", "locations"], (result) => {
    const { locationId, startDate, endDate, locations ,isRunning} = result;

    if (locationId) {
        locationIdElement.value = locationId;
    }
    if (startDate) {
        startDateElement.value = startDate;
    }
    if (endDate) {
        endDateElement.value = endDate;
    }

    if (locations && Array.isArray(locations)) {
        setLocations(locations);
    }
    if(isRunning){
        handleOnStartState();
      
    }else{
        handleOnStopState()
     
    }
    
});

const setLocations = (locations) => {
    const locationSelectElement = document.getElementById("locationId");
    locationSelectElement.innerHTML = "";


    locations.forEach(location => {
        let optionElement = document.createElement("option");
        optionElement.value = location.id;
        optionElement.innerHTML = location.name;
        optionElement.dataset.tz = location.tz
        locationSelectElement.appendChild(optionElement);
    });
};
