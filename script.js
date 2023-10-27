const form = document.querySelector('.form')
const activityInput = document.getElementById('activity');
const durationInput = document.getElementById('duration');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

class Activity{
    date = new Date();
    id = new (Date.now()+'').slice(-10);
    activityName;
    activityDuration;
    
    constructor(name, duration){
        this.activityName = name;
        this.activityDuration = duration;
    }
}

class App{
    #map;
    #mapEvent;
    
    activities = [];
    constructor(){
        this._getPosition();
        overlay.addEventListener('click', this.closeModal);
        form.addEventListener('submit',this._addNewActivity.bind(this));
    }

    _getPosition(){
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function(){
            this.showMessage("Can not get current location")
        });
    }

    _loadMap(position){
        const coordinates = [position.coords.latitude, position.coords.longitude];

        this.#map = L.map('map').setView(coordinates, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        
        this._displayMarker(coordinates,'Your current location');
        
        this.#map.on("click", this._showForm.bind(this))

    }

    _displayMarker(coordinates, text){
        L.marker(coordinates).addTo(this.#map)
        .bindPopup(
            L.popup({
                maxWidth:250,
                minWidth:100,
                autoClose:false,
                closeOnClick:false,
                closeButton:false,
                content:text
            })
        )
        .openPopup();
    }

    _showForm(mapEvent){
        console.log('HERE!')
        this.#mapEvent = mapEvent;
        form.classList.remove('hidden');
        activityInput.focus();
    }

    _addNewActivity(e){
        e.preventDefault();
        if(!this.inputsValid()){
            this.showMessage("Please check all your inputs");
            return;
        }
        let activity = new Activity(activityInput.value,durationInput.value);
        this.activities.push(activity);
        form.classList.add('hidden');
    }
    inputsValid(){
        if(activityInput.value.length == 0 || durationInput.value < 0 || durationInput.value.length == 0){
            return false;
        }else{
            return true;
        }
    }

    closeModal(){
        overlay.classList.add('hidden');
        modal.classList.add('hidden');
    }
    showMessage(message){
        overlay.classList.remove('hidden');
        modal.classList.remove('hidden');
        modal.textContent = message;
    }

}

const app = new App();

