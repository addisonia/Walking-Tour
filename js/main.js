// Main tour functionality
(function() {
    // Tour state
    let map, currentStop = 0;
    let userLocationMarker = null;
    let userLocationCircle = null;
    let hamelPulseLayer = null;
    let hamelClicked = false;
    let stops = [
        {
            id: 1,
            name: "Hamel Music Center",
            lat: 43.073377,
            lng: -89.398010,
            description: "Start your musical journey at the state-of-the-art Hamel Music Center, featuring performance venues and practice spaces for musicians.",
            images: ["pictures/hamel.jpg"]
        },
        {
            id: 2,
            name: "Mills Music Library",
            lat: 43.075050,
            lng: -89.397973,
            description: "Visit the Mills Music Library, home to an extensive collection of recordings, scores, and music-related materials.",
            images: ["pictures/mills1.jpg", "pictures/mills2.png"]
        },
        {
            id: 3,
            name: "B-Side Records",
            lat: 43.074932,
            lng: -89.393822,
            description: "Explore B-Side Records, a beloved local record store offering a wide selection of vinyl and music memorabilia.",
            images: ["pictures/bside.jpeg"]
        },
        {
            id: 4,
            name: "Orpheum Theatre",
            lat: 43.074862,
            lng: -89.388779,
            description: "Experience the historic Orpheum Theatre, a landmark venue that has hosted countless memorable performances.",
            images: ["pictures/orpheum.jpg"]
        },
        {
            id: 5,
            name: "Audio For The Arts",
            lat: 43.078422,
            lng: -89.377892,
            description: "Visit Audio For The Arts, a professional recording studio and audio production facility.",
            images: ["pictures/afta.jpg"]
        },
        {
            id: 6,
            name: "Spruce Tree Music And Repair",
            lat: 43.084207,
            lng: -89.376328,
            description: "End your tour at Spruce Tree Music And Repair, specializing in instrument sales, repairs, and maintenance.",
            images: ["pictures/spruce.jpg"]
        }
    ];

    // Store markers globally for access
    let markers = [];

    // Initialize map
    function initMap() {
        const centerLat = stops.reduce((sum, stop) => sum + stop.lat, 0) / stops.length;
        const centerLng = stops.reduce((sum, stop) => sum + stop.lng, 0) / stops.length;
        
        map = L.map('map', {
            center: [centerLat, centerLng],
            zoom: 15,
            zoomControl: true
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    
        // Add stops to map
        stops.forEach(addStopToMap);
        
        // Draw walking route
        drawRoute();
        
        // Populate stops menu
        populateStopsMenu();
    
        // Fit map bounds to include all stops and route
        const bounds = L.latLngBounds(walkingPath);
        map.fitBounds(bounds, { padding: [50, 50] });
    
        // Add start tour button listener
        document.querySelector('#aboutModal .btn-primary').addEventListener('click', () => {
            setTimeout(() => {
                showStopModal(stops[0]);
                centerMapOnStop(stops[0]);
            }, 500);
        });
    
    }



    // Add a stop to the map
    function addStopToMap(stop) {
        const marker = L.circleMarker([stop.lat, stop.lng], {
            radius: 10,
            className: `tour-stop stop-${stop.id}`,
            color: '#000',
            fillColor: stop.id === 1 ? '#4CAF50' : '#fff',
            fillOpacity: 1,
            weight: 2
        }).addTo(map);

        // Add pulsing effect for Hamel Music Center
        if (stop.name === "Hamel Music Center" && !hamelClicked) {
            hamelPulseLayer = L.svg().addTo(map);
            const pulseCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            pulseCircle.setAttribute("class", "pulse-ring");
            pulseCircle.setAttribute("cx", map.latLngToLayerPoint([stop.lat, stop.lng]).x);
            pulseCircle.setAttribute("cy", map.latLngToLayerPoint([stop.lat, stop.lng]).y);
            hamelPulseLayer._container.appendChild(pulseCircle);

            // Update pulse position on map move
            map.on('moveend', () => {
                if (hamelPulseLayer && !hamelClicked) {
                    const point = map.latLngToLayerPoint([stop.lat, stop.lng]);
                    pulseCircle.setAttribute("cx", point.x);
                    pulseCircle.setAttribute("cy", point.y);
                }
            });
        }

        // Create popup content
        const popupContent = `<b>${stop.name}</b><br>Stop ${stop.id} of ${stops.length}`;
        
        // Bind popup to marker
        const popup = L.popup().setContent(popupContent);
        marker.bindPopup(popup);
        
        marker.on('click', () => {
            const clickedStop = stops.find(s => s.id === stop.id);
            if (stop.name === "Hamel Music Center") {
                hamelClicked = true;
                if (hamelPulseLayer) {
                    hamelPulseLayer.remove();
                    hamelPulseLayer = null;
                }
            }
            showStopModal(clickedStop);
            centerMapOnStop(clickedStop);
        });

        // Store marker reference
        markers.push({ marker, popup, stop });
    }






    // Center map on stop with animation and update popup
    function centerMapOnStop(stop) {
        // Find the marker for this stop
        const markerObj = markers.find(m => m.stop.id === stop.id);
        if (markerObj) {
            // Close all existing popups first
            markers.forEach(m => m.marker.closePopup());
            
            // Move to the location
            map.flyTo([stop.lat, stop.lng], 16, {
                duration: 1
            });
            
            // Open the popup for the current stop
            setTimeout(() => {
                markerObj.marker.openPopup();
            }, 1100);
        }
    }

    // Detailed walking path coordinates
    const walkingPath = [
        [43.073377, -89.398010], // Mills Music Library
        [43.073392, -89.398386],
        [43.074078, -89.398284],
        [43.074321, -89.398198],
        [43.074321, -89.398198],
        [43.074999, -89.398161],
        [43.075050, -89.397973], // Hamel Music Center
        [43.074911, -89.397491],
        [43.074881, -89.393892],
        [43.074932, -89.393822], // B-Side Records
        [43.074862, -89.393575],
        [43.074823, -89.391757],
        [43.074807, -89.390122],
        [43.074811, -89.388843],
        [43.074862, -89.388779], // Orpheum Theatre
        [43.074785, -89.388126],
        [43.077575, -89.384147],
        [43.076259, -89.382235],
        [43.078524, -89.378921],
        [43.078351, -89.378632],
        [43.078422, -89.377892], // Audio For The Arts
        [43.078531, -89.378514],
        [43.078641, -89.378825],
        [43.080012, -89.380594],
        [43.082528, -89.376980],
        [43.083703, -89.375284],
        [43.083703, -89.375284],
        [43.084360, -89.376161],
        [43.084207, -89.376328]  // Spruce Tree Music And Repair
    ];

    // Draw route between stops
    function drawRoute() {
        L.polyline(walkingPath, {
            color: '#3388ff',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10',
            className: 'tour-route'
        }).addTo(map);

        // Add direction arrows
        const decorator = L.polylineDecorator(walkingPath, {
            patterns: [
                {
                    offset: 25,
                    repeat: 150,
                    symbol: L.Symbol.arrowHead({
                        pixelSize: 15,
                        polygon: false,
                        pathOptions: {
                            color: '#3388ff',
                            fillOpacity: 1,
                            weight: 2
                        }
                    })
                }
            ]
        }).addTo(map);
    }

    // Populate stops dropdown menu
    function populateStopsMenu() {
        const menu = document.querySelector('.dropdown-menu');
        menu.innerHTML = '';
        stops.forEach(stop => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.className = 'dropdown-item';
            link.textContent = `${stop.id}. ${stop.name}`;
            link.href = '#';
            link.addEventListener('click', () => {
                showStopModal(stop);
                centerMapOnStop(stop);
            });
            item.appendChild(link);
            menu.appendChild(item);
        });
    }

    // Show stop modal
    function showStopModal(stop) {
        currentStop = stop.id - 1;
        
        const modalElement = document.getElementById('stopModal');
        const existingModal = bootstrap.Modal.getInstance(modalElement);
        if (existingModal) {
            existingModal.dispose();
        }
        
        const modal = new bootstrap.Modal(modalElement);
        
        document.querySelector('#stopModal .modal-title').textContent = stop.name;
        
        // Create image carousel if stop has images
        let imageContent = '';
        if (stop.images && stop.images.length > 0) {
            if (stop.images.length === 1) {
                // Single image
                imageContent = `
                    <div class="text-center mb-3">
                        <img src="${stop.images[0]}" class="img-fluid" alt="${stop.name}" style="max-height: 300px;">
                    </div>`;
            } else {
                // Multiple images - create carousel
                imageContent = `
                    <div id="stopCarousel${stop.id}" class="carousel slide mb-3" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            ${stop.images.map((img, index) => `
                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                    <img src="${img}" class="d-block w-100" alt="${stop.name}" style="max-height: 300px; object-fit: contain;">
                                </div>
                            `).join('')}
                        </div>
                        ${stop.images.length > 1 ? `
                            <button class="carousel-control-prev" type="button" data-bs-target="#stopCarousel${stop.id}" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon"></span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#stopCarousel${stop.id}" data-bs-slide="next">
                                <span class="carousel-control-next-icon"></span>
                            </button>
                        ` : ''}
                    </div>`;
            }
        }
        
        document.querySelector('#stopModal .modal-body').innerHTML = `
            ${imageContent}
            <p><strong>Stop ${stop.id} of ${stops.length}</strong></p>
            <p>${stop.description}</p>
        `;
        
        // Update footer buttons
        const footer = document.querySelector('#stopModal .modal-footer');
        footer.innerHTML = '';

        if (currentStop > 0) {
            const prevButton = document.createElement('button');
            prevButton.type = 'button';
            prevButton.className = 'btn btn-secondary prev-stop';
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', () => {
                const prevStop = stops[currentStop - 1];
                showStopModal(prevStop);
                centerMapOnStop(prevStop);
            });
            footer.appendChild(prevButton);
        }

        const nextButton = document.createElement('button');
        nextButton.type = 'button';
        nextButton.className = currentStop === stops.length - 1 ? 'btn btn-primary' : 'btn btn-primary next-stop';
        nextButton.textContent = currentStop === stops.length - 1 ? 'Close' : 'Next';
        nextButton.addEventListener('click', () => {
            if (currentStop === stops.length - 1) {
                modal.hide();
            } else {
                const nextStop = stops[currentStop + 1];
                showStopModal(nextStop);
                centerMapOnStop(nextStop);
            }
        });
        footer.appendChild(nextButton);
        
        updateMarkers(stop.id);
        
        modal.show();
    }

    // Update marker colors to show progress
    function updateMarkers(currentId) {
        stops.forEach(stop => {
            const marker = document.querySelector(`.stop-${stop.id}`);
            if (marker) {
                if (stop.id <= currentId) {
                    marker.style.fill = '#4CAF50';
                } else {
                    marker.style.fill = '#fff';
                }
            }
        });
    }

    // // Location button functionality
    // document.querySelector('.location-button').addEventListener('click', () => {
    //     map.locate({setView: true, maxZoom: 16});
    // });

    // Set up location button
    document.querySelector('.location-button').addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }
        
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            
            // Remove existing markers if they exist
            if (userLocationMarker) map.removeLayer(userLocationMarker);
            if (userLocationCircle) map.removeLayer(userLocationCircle);
            
            // Add blue dot for user location
            userLocationMarker = L.circleMarker([latitude, longitude], {
                radius: 8,
                fillColor: "#2196F3",
                color: "#ffffff",
                fillOpacity: 1,
                weight: 2
            }).addTo(map);
            
            // Add accuracy circle
            userLocationCircle = L.circle([latitude, longitude], {
                radius: position.coords.accuracy / 8,
                fillColor: "#2196F3",
                fillOpacity: 0.15,
                color: "#2196F3",
                weight: 1,
                opacity: 0.3
            }).addTo(map);
            
            // Fly to location
            map.flyTo([latitude, longitude], 16, {
                duration: 1
            });
        }, error => {
            alert("Unable to find your location. Please make sure location services are enabled.");
        });
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