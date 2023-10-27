const form = document.querySelector('.form')
const activityInput = document.getElementById('activity');
const durationInput = document.getElementById('duration');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const activitiesContainer = document.querySelector('.activities'); 
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Activity{
    date = new Date();
    id = (Date.now() + '').slice(-10);
    activityName;
    activityDuration;
    
    constructor(name, duration){
        this.activityName = name;
        this.activityDuration = duration;
    }

    getDateDescription(){
        return daysOfWeek[this.date.getDay()] + ' ' +this.date.getDate() + ' ' + months[this.date.getMonth()] +',' 
                    + this.date.getFullYear()
    }
}
class ActivityRestored extends Activity{
    constructor(name,duration,date,id){
        super();
        this.activityName = name;
        this.activityDuration = duration;
        this.date = new Date(date);
        this.id = id;
    }
}

class App{
    #map;
    #mapEvent;
    
    activities = [];
    constructor(){
        this._getPosition();

        this._getLocalStorage();

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
        this.#mapEvent = mapEvent;
        form.classList.remove('hidden');
        activityInput.focus();
    }
    _hideForm(){
        form.classList.add('hidden');
    }

    _addNewActivity(e){
        e.preventDefault();
        if(!this.inputsValid()){
            this.showMessage("Please check all your inputs");
            return;
        }
        let activity = new Activity(activityInput.value,durationInput.value);
        this.activities.push(activity);

        this._renderActivity(activity);

        this._setLocalStorage();

        this._hideForm();
    }
    _setLocalStorage(){
        localStorage.setItem('activities', JSON.stringify(this.activities));
    }
    _getLocalStorage(){
        if(!localStorage.getItem('activities')){
            this.showMessage('Your activities not found!');
            return;
        }

        this.activities = JSON.parse(localStorage.getItem('activities'));
        this.activities = this.activities.map(activity=>{
            return new ActivityRestored(activity.activityName,activity.activityDuration,activity.date,activity.id)
        })
        this.activities.map(activity=>{
            this._renderActivity(activity);
        })
    }
    _reset(){
        localStorage.removeItem('activities');
    }
    _renderActivity(activity){
       let activityDate = activity.getDateDescription()
       let activitiyHtml = `<div class="activity">
                        
                <div class="activity_item">
                    <i class="fa fa-thumb-tack activity_icon" aria-hidden="true"></i>
                    <p class="activity_text">${activity.activityName}</p>
                </div>
                      
                <div class="activity_item">
                    <i class="fa fa-clock-o activity_icon" aria-hidden="true"></i>
                    <p class="activity_text">${activity.activityDuration} hours</p>
                </div>

                <div class="activity_item">
                    <i class="fa fa-calendar-check-o activity_icon" aria-hidden="true"></i>
                    <p class="activity_text">${activityDate}</p>
                </div>
                      
            </div>`

        activitiesContainer.insertAdjacentHTML('afterend',activitiyHtml);
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

