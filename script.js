// Load the Google API client and initialize
function start() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/calendar.readonly',
        discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest',
            'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
        ]
    }).then(() => {
        gapi.auth2.getAuthInstance().signIn().then(() => {
            loadRandomPhoto();
            loadCalendarEvents();
        });
    });
}

// Load a random photo from Google Photos
async function loadRandomPhoto() {
    try {
        const response = await gapi.client.photoslibrary.mediaItems.list({
            pageSize: 100 // Limit number of items for quicker loading
        });

        const photos = response.result.mediaItems;
        const randomPhoto = photos[Math.floor(Math.random() * photos.length)].baseUrl;
        document.getElementById('slideshow').style.backgroundImage = `url(${randomPhoto})`;
        document.getElementById('slideshow').style.backgroundSize = 'cover';
        document.getElementById('slideshow').style.backgroundPosition = 'center';
        document.getElementById('slideshow').style.transition = 'opacity 1s ease-in-out';
    } catch (error) {
        console.error('Error loading photo:', error);
    }
}

// Load Google Calendar events with customizations
async function loadCalendarEvents() {
    try {
        const response = await gapi.client.calendar.events.list({
            calendarId: 'primary', // Use primary calendar or customize
            timeMin: (new Date()).toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: 'startTime'
        });

        const events = response.result.items;
        const calendarDiv = document.getElementById('calendar');
        calendarDiv.innerHTML = events.map(event => `
            <div>
                <h3>${event.summary}</h3>
                <p>${new Date(event.start.dateTime || event.start.date).toLocaleString()}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading calendar:', error);
    }
}

// Initialize the API on page load
start();
