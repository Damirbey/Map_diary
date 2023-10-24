
class App{
    #map;
    #mapEvent;

    constructor(){
        this._getPosition();
    }

    _getPosition(){
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function(){
            alert("Can not get current location")
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
    }

}

const app = new App();

