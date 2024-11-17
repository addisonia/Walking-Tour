// Main tour functionality
(function() {
    // Tour state
    let map, currentStop = 0;
    let stops = [
        {
            id: 1,
            name: "Starting Point",
            lat: 43.0891, // Example coordinates for Milwaukee area
            lng: -87.8875,
            description: "Begin your tour here at this historic location."
        },
        {
            id: 2,
            name: "Second Stop",
            lat: 43.0893,
            lng: -87.8870,
            description: "The second stop on our journey."
        },
        {
            id: 3,
            name: "Final Destination",
            lat: 43.0896,
            lng: -87.8865,
            description: "The final stop on our tour."
        }
    ];

    // Initialize map
    function initMap() {
        map = L.map('map').setView([43.0891, -87.8875], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add stops to map
        stops.forEach(addStopToMap);
        
        // Draw route between stops
        drawRoute();
        
        // Populate stops menu
        populateStopsMenu();
    }

    // Add a stop to the map
    function addStopToMap(stop) {
        const marker = L.circleMarker([stop.lat, stop.lng], {
            radius: 10,
            className: 'tour-stop'
        }).addTo(map);

        marker.on('click', () => showStopModal(stop));
    }

    // Draw route between stops
    function drawRoute() {
        const routePoints = stops.map(stop => [stop.lat, stop.lng]);
        L.polyline(routePoints, {
            color: 'blue',
            weight: 3,
            opacity: 0.7
        }).addTo(map);
    }

    // Populate stops dropdown menu
    function populateStopsMenu() {
        const menu = document.querySelector('.dropdown-menu');
        stops.forEach(stop => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.className = 'dropdown-item';
            link.textContent = `${stop.id}. ${stop.name}`;
            link.href = '#';
            link.addEventListener('click', () => showStopModal(stop));
            item.appendChild(link);
            menu.appendChild(item);
        });
    }

    // Show stop modal
    function showStopModal(stop) {
        currentStop = stop.id - 1;
        const modal = new bootstrap.Modal(document.getElementById('stopModal'));
        
        document.querySelector('#stopModal .modal-title').textContent = stop.name;
        document.querySelector('#stopModal .modal-body').textContent = stop.description;
        
        // Update navigation buttons
        document.querySelector('.prev-stop').disabled = currentStop === 0;
        document.querySelector('.next-stop').disabled = currentStop === stops.length - 1;
        
        modal.show();
    }

    // Navigation button handlers
    document.querySelector('.prev-stop').addEventListener('click', () => {
        if (currentStop > 0) {
            showStopModal(stops[currentStop - 1]);
        }
    });

    document.querySelector('.next-stop').addEventListener('click', () => {
        if (currentStop < stops.length - 1) {
            showStopModal(stops[currentStop + 1]);
        }
    });

    // Location button functionality
    document.querySelector('.location-button').addEventListener('click', () => {
        map.locate({setView: true, maxZoom: 16});
    });

    // About button functionality
    document.querySelector('.about').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('aboutModal'));
        modal.show();
    });

    // Show about modal on start
    window.addEventListener('load', () => {
        const modal = new bootstrap.Modal(document.getElementById('aboutModal'));
        modal.show();
    });

    // Initialize map
    initMap();
})();