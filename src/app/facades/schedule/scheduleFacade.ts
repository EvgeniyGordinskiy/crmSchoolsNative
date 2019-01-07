import * as moment from 'moment';
import {Program} from "~/app/models/program";
import {Schedule} from "~/app/models/schedule";
import {Curriculum} from "~/app/models/curriculum";

export class ScheduleFacade {
  static schedulesWithLesson = {};
  static lessonNumber = {};
  static format = 'MMM Do YY';
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

    static getClassByDate(current_program: Program, programs: Program[], day, classesByDates: any, withTime = true, time = moment(), defaultFormat = 'MMM Do YY HH:mm A') {
        if (current_program.curriculum && current_program.curriculum.length > 0) {
            current_program.curriculum.map(item => {
                item.order = ScheduleFacade.getTrafficLight(item.start_curriculum, item.end_curriculum, 'YYYY-MM-DD HH:mm:ss');
            });
        }
        let dayFromCalendar = moment(day).hour(time.hour()).minute(time.minute());
        // console.log(day, dayFromCalendar);
        let curriculumSet = false;
        programs.map((progr, i) => {
            progr.classes.map( (item, y) => {
                item.schedule.map( (scheduleOrigin, k) => {
                    const schedules = ScheduleFacade.findReplacedSchedule(item, scheduleOrigin, dayFromCalendar);
                    if (!curriculumSet) {
                        curriculumSet = true;
                        ScheduleFacade.schedulesWithLesson = {};
                        if (current_program.curriculum && current_program.curriculum.length > 0) {
                            const timeStartC = moment(schedules[0].start, 'HH:mm A');
                            const curriculumstart = moment(current_program.curriculum[0].start_curriculum, 'YYYY-MM-DD HH:mm:ss');
                            if (withTime === false) {
                                dayFromCalendar.hour(curriculumstart.hour()).minute(curriculumstart.minute());
                            }
                            const dayTime = dayFromCalendar.clone().hour(timeStartC.hour()).minute(timeStartC.minute());
                            current_program.curriculum = current_program.curriculum.sort((a, b) => {
                                return moment(a.start_curriculum, 'YYYY-MM-DD HH:mm:ss').isBefore(moment(b.start_curriculum, 'YYYY-MM-DD HH:mm:ss')) ? -1 : 1;
                            });
                            // console.log(dayTime.isAfter(curriculumstart), dayTime.isSame(curriculumstart));
                            if (dayTime.isAfter(curriculumstart) || dayTime.isSame(curriculumstart)) {
                                ScheduleFacade.findInitLessonNumber(current_program, dayTime, withTime);
                            }
                            // console.log('**** init ****', ProgramScheduleComponent.lessonNumber);
                            // console.log('**** init ****', dayTime.diff(curriculumstart));
                        }
                    }
                    schedules.map( schedule => {
                        if (!schedule.canceled || schedule.canceled === false) {
                            let scheduleChecked;
                            switch (schedule.repeat_time) {
                                case 'day':
                                    scheduleChecked = Object.assign({}, schedule);
                                    break;
                                case 'week':
                                    if (schedule.dayName === dayFromCalendar.format('dddd').substring(0, 3).toLowerCase()) {
                                        scheduleChecked = Object.assign({}, schedule);
                                    }
                                    break;
                                case 'month':
                                    if (+schedule.day === +dayFromCalendar.date()) {
                                        scheduleChecked = Object.assign({}, schedule);
                                    }
                                    break;
                                case 'none':
                                    if (+schedule.day === +dayFromCalendar.date() && +schedule.month === (dayFromCalendar.month() + 1) && +schedule.year === dayFromCalendar.year()) {
                                        scheduleChecked = Object.assign({}, schedule);
                                    }
                                    break;
                            }
                            if (scheduleChecked && scheduleChecked.id) {
                                // console.log(scheduleChecked);
                                scheduleChecked.selectedDayNumber = +dayFromCalendar.date();
                                const classScheduleTimeStart = moment(scheduleChecked.start, 'HH:mm A');
                                const classScheduleTimeEnd = moment(scheduleChecked.end, 'HH:mm A');
                                const dayFromCalendarTimeStart = dayFromCalendar.clone().hour(classScheduleTimeStart.hour()).minute(classScheduleTimeStart.minute());
                                const dayFromCalendarTimeEnd = dayFromCalendar.clone().hour(classScheduleTimeEnd.hour()).minute(classScheduleTimeEnd.minute());
                                if (dayFromCalendarTimeStart.isBetween(dayFromCalendar, dayFromCalendarTimeEnd) && dayFromCalendarTimeStart.diff(dayFromCalendar, 'hour') < 1 ||
                                    dayFromCalendar.isSame(dayFromCalendarTimeStart) || withTime === false
                                ) {
                                    let date = dayFromCalendar.format(ScheduleFacade.format);
                                    if (!classesByDates[date]) {
                                        classesByDates[date] = {};
                                    }
                                    // if (schedule.id === 102) {
                                    //   console.log(item);
                                    // }
                                    // console.log(schedule);
                                    if (ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')] &&
                                        (ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')][scheduleChecked.id])) {
                                        scheduleChecked.lesson = ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')][schedule.id];
                                        // scheduleChecked = ProgramScheduleComponent.bindClassWithLesson(scheduleChecked, current_program, dayFromCalendarTimeStart);
                                        // console.log(ProgramScheduleComponent.schedulesWithLesson);
                                    }
                                    // console.log('====', scheduleChecked);
                                    let classSchedule = Object.assign({}, item);
                                    classSchedule.program_id = scheduleChecked.program_id;
                                    classSchedule.program_name = scheduleChecked.program_name;
                                    classSchedule.lesson = scheduleChecked.lesson;
                                    classSchedule.selectedSchedule = scheduleChecked;
                                    classSchedule.momentStart = dayFromCalendarTimeStart;
                                    classSchedule.momentEnd = dayFromCalendarTimeEnd;
                                    classSchedule.cssClass = classSchedule.id * 12 + 'fsdfss';
                                    classSchedule.styles = ScheduleFacade.getCssHeightTopAndDisabled(classSchedule, dayFromCalendar);
                                    // console.log('+++++', classSchedule);
                                    // if (schedule.id === 102) {
                                    //   console.log(classSchedule);
                                    // }
                                    if (!classesByDates[date][+dayFromCalendar.date()]) {
                                        classesByDates[date][+dayFromCalendar.date()] = {};
                                    }
                                    if (!classesByDates[date][+dayFromCalendar.date()][classSchedule.id]) {
                                        if (withTime === false) {
                                            classesByDates[date][+dayFromCalendar.date()][classSchedule.id] = [];
                                        } else {
                                            classesByDates[date][+dayFromCalendar.date()][classSchedule.id] = {};
                                        }
                                    }
                                    if (withTime === true &&
                                        !classesByDates[date][+dayFromCalendar.date()][classSchedule.id][dayFromCalendar.format(defaultFormat)]) {
                                        classesByDates[date][+dayFromCalendar.date()][classSchedule.id][dayFromCalendar.format(defaultFormat)] = [];
                                    }
                                    if (withTime === true) {
                                        classesByDates[date][+dayFromCalendar.date()][classSchedule.id][dayFromCalendar.format(defaultFormat)].push(classSchedule);
                                    } else {
                                        classesByDates[date][+dayFromCalendar.date()][classSchedule.id].push(classSchedule);
                                    }
                                }
                            }
                        }
                    });
                });
            });
        });
        // console.log(classesByDates);
        return classesByDates;
    }

    static findReplacedSchedule(item, schedule, dayFromCalendar) {
        // if (schedule.id === 102) {
        //   console.log(dayFromCalendar);
        //   console.log(schedule);
        // }

        if (!item.replaced_schedule) {
            return schedule;
        }
        let foundSch = [];
        // console.log(item);
        // console.log(schedule);
        item.replaced_schedule.map( sch => {
            if (sch.replaced_schedule === schedule.id) {
                const day = moment().year(sch.year).month(sch.month - 1).date(sch.day);
                // console.log(dayFromCalendar.date());
                // console.log(dayFromCalendar);
                // console.log(day);
                // console.log(day);
                // console.log(sch);
                if (dayFromCalendar.month() === day.month() && dayFromCalendar.year() === day.year() && dayFromCalendar.date() === day.date()) {
                    foundSch.push(sch);
                }
            }
        });
        // if (schedule.id === 102) {
        //   console.log(foundSch.length === 0 ? [schedule] : foundSch);
        //   console.log(foundSch);
        // }
        return foundSch.length === 0 ? [schedule] : foundSch;
    }

    static findInitLessonNumber(program, dayTime, withTime = true) {
        // console.log(program);
        ScheduleFacade.schedulesWithLesson = {};
        ScheduleFacade.lessonNumber = {};
        program.curriculum.map( curr => {
            if (curr.start_curriculum) {
                const curriculumstart = moment(curr.start_curriculum, 'YYYY-MM-DD HH:mm:ss');
                if (dayTime.isAfter(curriculumstart) || dayTime.isSame(curriculumstart)) {
                    // console.log(curr.start_curriculum);
                    const countDays = dayTime.endOf('month').diff(curriculumstart, 'days');  // console.log(newDay.format('ll'));
                    ScheduleFacade.lessonNumber[curr.program_id ? curr.program_id + '|' + curr.id : curr.id] = 0;
                    new Array(countDays + 1).fill(0).map((day, i) => {
                        // console.log(countDays);
                        const newDay = curriculumstart.clone().add(i, 'days');
                        program.schedule = program.schedule.sort((a: Schedule, b: Schedule) => {
                            return moment(a.start, 'HH:mm A').month(a.month).date(+a.day).year(+a.year)
                                .isBefore(moment(b.start, 'HH:mm A').month(b.month).date(+b.day).year(+b.year)) ? -1 : 1;
                        });
                        program.schedule.map((scheduleOrigin) => {
                            if (scheduleOrigin.class_id && (curr.program_id ? scheduleOrigin.program_id === curr.program_id : true)) {
                                const schedules = ScheduleFacade.findReplacedSchedule(program, scheduleOrigin, newDay);
                                schedules.map(schedule => {
                                    if (!schedule.canceled || schedule.canceled === false) {
                                        let scheduleChecked;
                                        switch (schedule.repeat_time) {
                                            case 'day':
                                                scheduleChecked = Object.assign({}, schedule);
                                                break;
                                            case 'week':
                                                if (schedule.dayName === newDay.format('dddd').substring(0, 3).toLowerCase()) {
                                                    scheduleChecked = Object.assign({}, schedule);
                                                }
                                                break;
                                            case 'month':
                                                if (+schedule.day === +newDay.date()) {
                                                    scheduleChecked = Object.assign({}, schedule);
                                                }
                                                break;
                                            case 'none':
                                                if (+schedule.day === +newDay.date() && +schedule.month === (newDay.month() + 1) && +schedule.year === newDay.year()) {
                                                    scheduleChecked = Object.assign({}, schedule);
                                                }
                                                break;
                                        }
                                        if (scheduleChecked && scheduleChecked.id) {
                                            const classScheduleTimeStart = moment(scheduleChecked.start, 'HH:mm A');
                                            const dayFromCalendarTimeStart = newDay.clone().hour(classScheduleTimeStart.hour()).minute(classScheduleTimeStart.minute());
                                            // console.log(countDays, curr, dayTime.format('ll'),dayFromCalendarTimeStart.format('ll') );
                                            scheduleChecked = ScheduleFacade.bindClassWithLesson(scheduleChecked, program, curr, dayFromCalendarTimeStart);
                                            // console.log(scheduleChecked);
                                            // console.log(ProgramScheduleComponent.lessonNumber);
                                            // console.log(ProgramScheduleComponent.schedulesWithLesson);
                                        }
                                    }
                                });
                            }
                        });
                    });
                }
            }
        });
    }

    static getCssHeightTopAndDisabled(item, dayFromCalendar) {
        const minuteStart = item.momentStart.diff(dayFromCalendar, 'minute'),
            timeCellHeight = 25.3,
            minutPerPixel = timeCellHeight / 60,
            durations = moment.duration(item.momentEnd.diff(item.momentStart)),
            height = ((durations.hours() * 60 + durations.minutes() - 2) * minutPerPixel) + 'px',
            top = (minuteStart > 0 ? minuteStart : 1) * minutPerPixel - 2 + 'px';
        return { 'margin-top': top, height: height};
    }

    static bindClassWithLesson(schedule: Schedule, program, curriculum: Curriculum, dayFromCalendar) {
        if ((schedule.program_id === program.id || curriculum.program_id) && curriculum.start_curriculum) {
            const curriculumstart = moment(curriculum.start_curriculum, 'YYYY-MM-DD HH:mm:ss');
            const curriculumEnd = moment(curriculum.end_curriculum, 'YYYY-MM-DD HH:mm:ss');
            // console.log(dayFromCalendar.format('ll'), curriculum);
            if (dayFromCalendar.isAfter(curriculumstart) || dayFromCalendar.isSame(curriculumstart) || dayFromCalendar.isSame(curriculumEnd)) {
                if (curriculum.lessons[ScheduleFacade.lessonNumber[curriculum.program_id ? curriculum.program_id + '|' + curriculum.id : curriculum.id]]) {
                    if (curriculum.end_curriculum) {
                        if ((dayFromCalendar.isSame(curriculumstart) || dayFromCalendar.isAfter(curriculumstart))
                            && (dayFromCalendar.isBefore(curriculumEnd) || dayFromCalendar.isSame(curriculumEnd))) {
                            if (ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')] &&
                                (ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')][schedule.id])) {
                                schedule.lesson = ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')][schedule.id];
                            } else {
                                ScheduleFacade.setAndUpdate(program, dayFromCalendar, curriculum, schedule);
                                if (ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')]  &&
                                    (ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')][schedule.id])) {
                                    schedule.lesson = ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')][schedule.id];
                                }
                            }
                            // schedule.lesson = program.curriculum.lessons[ProgramScheduleComponent.lessonNumber];
                            // ProgramScheduleComponent.setAndUpdate(program, dayFromCalendar, schedule)
                        }
                    } else {
                        ScheduleFacade.setAndUpdate(program, dayFromCalendar, curriculum, schedule);
                        // console.log(ProgramScheduleComponent.schedulesWithLesson, dayFromCalendar.format('ll'), schedule);
                        if (ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')] &&
                            (ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')][schedule.id])) {
                            // console.log('saved');
                            schedule.lesson = ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')][schedule.id];
                        }
                    }
                    // console.log('*****', schedule);
                }
            }
        }
        return schedule;
    }

    static setAndUpdate(program, dayFromCalendar, curriculum, schedule) {
        if (!ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')]) {
            ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')] = {};
        }
        if (!ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')][schedule.id] ||
            ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')][schedule.id] !== 0) {
            ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')][schedule.id] = {};
            const idC = curriculum.program_id ? curriculum.program_id + '|' + curriculum.id : curriculum.id;
            let lesson = curriculum.lessons[ScheduleFacade.lessonNumber[idC]];
            lesson.order = curriculum.order;
            lesson.curriculum_id = curriculum.id;
            ScheduleFacade.schedulesWithLesson[dayFromCalendar.format('ll')][schedule.id] = lesson;
            ScheduleFacade.lessonNumber[idC] === curriculum.lessons.length - 1 ?
                ScheduleFacade.lessonNumber[idC] = 0 : ScheduleFacade.lessonNumber[idC]++;
            // console.log(ProgramScheduleComponent.lessonNumber);
            // console.log(curriculum);
            // console.log(schedule);
        }
        // console.log(ProgramScheduleComponent.schedulesWithLesson);
    }
}
