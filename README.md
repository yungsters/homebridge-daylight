# homebridge-daylight

Daylight plugin for [Homebridge](https://github.com/nfarina/homebridge) that publishes a HomeKit accessory that emits an approximation of the expected amount of daylight according to the sunrise and sunset schedule for the configured location.

| Time Period              | Current Light Level                                                      |
| ------------------------ | ------------------------------------------------------------------------ |
| Before Sunrise           | 0.0001lux                                                                |
| During Sunrise           | 0.0001lux to 100000.000lux (gradual)                                     |
| Between Sunrise & Sunset | 100000.000lux                                                            |
| During Sunset            | 100000.000lux to 0.0001lux (gradual)                                     |
| After Sunset             | 0.0001lux                                                                |

This is intended for use in triggering scenes using sunrise and sunset.

# Installation

1. Install Homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-daylight`
3. Use the [Google Geocoder Tool](https://google-developers.appspot.com/maps/documentation/utils/geocoder/) to get your location coordinates.
4. Update your Homebridge `config.json` using the sample below.

# Configuration

```json
{
  "accessory": "Daylight",
  "location": {
    "lat": 37.3316936,
    "lng": -122.0302191
  },
  "name": "Daylight"
}
```

Fields:

* `accessory` must be "Daylight" (required).
* `location` contains your location coordinates (required).
* `name` is the name of the published accessory (optional).
