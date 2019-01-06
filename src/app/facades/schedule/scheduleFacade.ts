import * as moment from 'moment';

export class ScheduleFacade {

  static getTrafficLight(timeStringStart: string, timeStringEnd: string, format: string) : string {
      const momentGivenStart = moment(timeStringStart, format);
      const momentGivenEnd = moment(timeStringEnd, format);
      const currentMoment = moment();
    // console.log(momentGivenStart.unix());
    // console.log(momentGivenEnd.unix());
    // console.log(currentMoment.unix());
    // console.log(momentGivenStart.format(format));
    // console.log(momentGivenEnd.format(format));
    // console.log(currentMoment);
    // console.log(currentMoment.unix() <= momentGivenEnd.unix());
    // console.log(currentMoment.unix() >= momentGivenStart.unix());
    if(currentMoment.isBefore(momentGivenStart)) {
      return 'upcoming'
    }
    if (timeStringEnd) {
      if (currentMoment.isBetween(momentGivenStart, momentGivenEnd)) {
        return 'current';
      }
      if(currentMoment.isAfter(momentGivenEnd)) {
        return 'past'
      }
    } else if (currentMoment.isAfter(momentGivenStart)){
      return 'current';
    }
  }
}
