'use strict';

const suncalc = require('suncalc');

module.exports = homebridge => {
  const Characteristic = homebridge.hap.Characteristic;
  const Service = homebridge.hap.Service;

  // Frequency of updates during transition periods.
  const UPDATE_FREQUENCY = 1000;

  class DaylightAccessory {
    constructor(log, config) {
      this.displayName = config.name || 'Daylight Sensor';

      if (!config.location ||
          !Number.isFinite(config.location.lat) ||
          !Number.isFinite(config.location.lng)) {
        throw new Error('Invalid or missing `location` configuration.');
      }

      this.location = config.location;
      this.service = new Service.LightSensor(this.displayName);
      this.updateAmbientLightLevel();
    }

    updateAmbientLightLevel() {
      const nowDate = new Date();
      const now = nowDate.getTime();

      const sunDates = suncalc.getTimes(
        nowDate,
        this.location.lat,
        this.location.lng
      );
      const times = {
        sunrise: sunDates.sunrise.getTime(),
        sunriseEnd: sunDates.sunriseEnd.getTime(),
        sunsetStart: sunDates.sunsetStart.getTime(),
        sunset: sunDates.sunset.getTime(),
      };

      let lightRatio;
      let nextUpdate;

      if (
        now > times.sunrise &&
        now < times.sunriseEnd
      ) {
        lightRatio =
          (now - times.sunrise) /
          (times.sunriseEnd - times.sunrise);
        nextUpdate = now + UPDATE_FREQUENCY;
      } else if (
        now > times.sunriseEnd &&
        now < times.sunsetStart
      ) {
        lightRatio = 1;
        nextUpdate = times.sunsetStart;
      } else if (
        now > times.sunsetStart &&
        now < times.sunset
      ) {
        lightRatio =
          (times.sunset - now) /
          (times.sunset - times.sunsetStart);
        nextUpdate = now + UPDATE_FREQUENCY;
      } else {
        lightRatio = 0;
        nextUpdate = times.sunrise;
      }

      // Range (in lux) from 0.0001 to 100000 in increments of 0.0001.
      const lightLevel = Math.round(1 + lightRatio * 999999999) / 10000;
      this.service.setCharacteristic(
        Characteristic.CurrentAmbientLightLevel,
        lightLevel
      );

      setTimeout(this.updateAmbientLightLevel.bind(this), nextUpdate - now);
    }

    getServices() {
      return [this.service];
    }
  }

  homebridge.registerAccessory('homebridge-daylight', 'Daylight', DaylightAccessory);
};
