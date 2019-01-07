import * as vo from "./vo";
import * as option from "./option";

function zerofill(v: any) {
  return ('0' + v).slice(-2);
}
class Hoge extends vo.StringVo {}

var a = new Hoge("ge");
console.log(a);

enum ExecTiming {
  AM = 'AM',
  PM1 = 'PM1',
  PM2 = 'PM2',
  OVER = 'OVER'
}

class ScheduledStartDateTime extends vo.DateVo {
  hasTime() {
    return this.value.getHours() > 0 || this.value.getMinutes() > 0;
  }
}

class Schedule {
  startDateTime: ScheduledStartDateTime;
  execTiming: ExecTiming;
  constructor(startDateTime: ScheduledStartDateTime, execTiming: ExecTiming) {
    this.startDateTime = startDateTime;
    this.execTiming = execTiming;
  }
  static createOnlyDateTime(startDateTime: ScheduledStartDateTime): Schedule {
    const h = startDateTime.value.getHours();
    var execTiming: ExecTiming
    if(h < 12) {
      execTiming = ExecTiming.AM
    } else if(h < 15) {
      execTiming = ExecTiming.PM1
    } else if(h < 18) {
      execTiming = ExecTiming.PM2
    } else {
      execTiming = ExecTiming.OVER
    }
    return new Schedule(startDateTime, execTiming);
  }
  public getSortValue():number {
    var p = 0;
    if(this.execTiming == ExecTiming.PM1) {
      p = 1;
    } else if(this.execTiming == ExecTiming.PM2) {
      p = 2;
    } if(this.execTiming == ExecTiming.OVER) {
      p = 3;
    }
    return parseInt(`${this.startDateTime.getDateText().split('/').join('')}${p}`)
  }
}

class EstimateHour extends vo.NumberVo {}
class ActualHour extends vo.NumberVo {}
class ActualStartDateTime extends vo.DateVo {}
class ActualEndDateTime extends vo.DateVo {
  calcActualHour(startDateTime: ActualStartDateTime): ActualHour {
    return new ActualHour((this.value.getTime() - startDateTime.value.getTime()) / (60 * 60 * 1000));
  }
}
class ActualTerm {
  startDateTime: ActualStartDateTime;
  endDateTimeOption: option.Option<ActualEndDateTime>;
  actualHourOption: option.Option<ActualHour>;
  constructor(startDateTime: ActualStartDateTime, endDateTimeOption: option.Option<ActualEndDateTime>) {
    this.startDateTime = startDateTime;
    this.endDateTimeOption = endDateTimeOption;
    this.actualHourOption = endDateTimeOption.map(end => end.calcActualHour(startDateTime))
  }

  updateEndDateTime(actualEndDateTime: ActualEndDateTime): ActualTerm {
    return new ActualTerm(this.startDateTime, option.some(actualEndDateTime));
  }
}

class Actual {
  actualTermOption: option.Option<ActualTerm>
  actualHourOption: option.Option<ActualHour>
  constructor(actualTermOption: option.Option<ActualTerm>) {
    this.actualTermOption = actualTermOption;
    if(actualTermOption.isEmpty()) {
      this.actualHourOption = option.empty();
    } else {
      this.actualHourOption = actualTermOption.get().actualHourOption;
    }  
  }

  getActualStartDateTimeOption(): option.Option<ActualStartDateTime> {
    return this.actualTermOption.map(v => v.startDateTime);
  }

  getActualEndDateTimeOption(): option.Option<ActualEndDateTime> {
    if(this.actualTermOption.isEmpty()) {
      return option.empty();
    }
    return this.actualTermOption.get().endDateTimeOption;
  }

}

class TaskId extends vo.StringVo {
  private _TaskId(){}
}
class TaskTitle extends vo.StringVo {
  private _TaskTitle(){}
}

class Task {
  taskId: TaskId;
  taskTitle: TaskTitle;
  schedule: Schedule;
  estimateHour: EstimateHour;
  actual: Actual;
  isarchived: boolean;
  constructor(
    taskId: TaskId, 
    taskTitle: TaskTitle, 
    schedule: Schedule, 
    estimateHour: EstimateHour, 
    actual: Actual, 
    isarchived: boolean
  ) {
    this.taskId = taskId;
    this.taskTitle = taskTitle;
    this.schedule = schedule;
    this.estimateHour = estimateHour;
    this.actual = actual;
    this.isarchived = isarchived;
  }
}

declare class SheetData {
  taskId: string;
  taskTitle: string;
  scheduledStartDateTime: string;
  execTiming: string;
  estimateHour: number;
  startDateTime: string;
  endDateTime: string;
  isarchived: string;
}

class TextTask {
  id: string;
  ti: string;
  sch: string;
  exe: string;
  est: string;
  st: string;
  end: string;
  archive: string;
  static create(text:string): TextTask {
    var obj: any = JSON.stringify(text)
    var textTask = new TextTask()
    textTask.id = obj.id;
    textTask.ti = obj.ti;
    textTask.sch = obj.sch;
    textTask.exe = obj.exe || ''
    textTask.est = obj.est
    textTask.st = obj.st || ''
    textTask.end = obj.end || ''
    textTask.archive = obj.archive || ''
    return textTask;
  }
  /*
  var textTask = TextTask.create(text);
    var data = new SheetData();
    data.taskId = textTask.id
    data.taskTitle = textTask.ti
    data.scheduledStartDateTime = textTask.sch
    data.execTiming = textTask.exe
    data.estimateHour = parseInt(textTask.est)
    data.startDateTime = textTask.st
    data.endDateTime = textTask.end
    data.isarchived = textTask.archive
    */

  // static mapping = [
  //   ['id', 'taskId'],
  //   ['ti', 'taskTitle'],
  //   ['sch', 'scheduledStartDateTime'],
  // ]
}

class TaskConvertor {
  dataToTask(v: SheetData): Task {
    var schedule: Schedule
    const start = new ScheduledStartDateTime(new Date(v.scheduledStartDateTime))
    if(start.value.getHours() == 0) {
      schedule = new Schedule(start, ExecTiming[v.execTiming])
    } else {
      schedule = Schedule.createOnlyDateTime(start)
    }

    var actualTermOption: option.Option<ActualTerm>;
    if(v.startDateTime.length == 0) {
      actualTermOption = option.empty()
    } else {
      var endOption: option.Option<ActualEndDateTime>
      if(v.endDateTime.length == 0) {
        endOption = option.empty();
      } else {
        endOption = option.some(new ActualEndDateTime(new Date(v.endDateTime)))
      }
      const term = new ActualTerm(
        new ActualStartDateTime(new Date(v.startDateTime)),
        endOption
      )
      actualTermOption = option.some(term)
    }

    return new Task(
      new TaskId(v.taskId),
      new TaskTitle(v.taskTitle),
      schedule,
      new EstimateHour(v.estimateHour),
      new Actual(actualTermOption),
      v.isarchived.length > 0
    );
  }

  taskToData(v: Task): SheetData {
    var data = {} as SheetData;
    data.taskId = v.taskId.value;
    data.taskTitle = v.taskTitle.value;
    data.scheduledStartDateTime = v.schedule.startDateTime.value.toISOString();
    data.execTiming = v.schedule.execTiming;
    data.estimateHour = v.estimateHour.value;
    data.startDateTime = v.actual.getActualStartDateTimeOption().map(v => v.value.toISOString()).getOr(() => '');
    data.endDateTime = v.actual.getActualEndDateTimeOption().map(v => v.value.toISOString()).getOr(() => '');
    data.isarchived = v.isarchived ? 'o' : '';
    return data;
  }

  textToData(text:string): SheetData {
    var textTask = TextTask.create(text);
    var data = new SheetData();
    data.taskId = textTask.id
    data.taskTitle = textTask.ti
    data.scheduledStartDateTime = textTask.sch
    data.execTiming = textTask.exe
    data.estimateHour = parseInt(textTask.est)
    data.startDateTime = textTask.st
    data.endDateTime = textTask.end
    data.isarchived = textTask.archive
    return data;
  }

  dataToText(data:SheetData): string {

  }
}

declare class Sheet {
  list(callback:(list:SheetData[])=>void);
}

function taskToRow(task:Task, excludeDate = false): string {
  const d = excludeDate ? '' : `<td>${task.schedule.startDateTime.getDateExcludeYearText()}(${vo.DateVo.toJpnDay(task.schedule.startDateTime.value.getDay())})</td>`
  return `<tr>
  ${d}
  <td>${task.schedule.execTiming}</td>
  <td>${task.schedule.startDateTime.hasTime() ? task.schedule.startDateTime.getTimeText() : ''}</td>
  <td>${task.taskTitle.value}</td>
  <td>${task.estimateHour.value}</td>
  <td>${task.actual.actualHourOption.map(v => '' + v.value).getOr(()=>'')}</td>
  <td>${task.actual.actualTermOption.map(v => v.startDateTime.getTimeText()).getOr(()=>'')}</td>
  <td>${task.actual.actualTermOption.map(v => v.endDateTimeOption.map(w => w.getTimeText()).getOr(()=>'')).getOr(()=>'')}</td>
  <td>${task.isarchived ? 'archived' : ''}</td>
  </tr>`
}

new Sheet().list((l) => {
  const list = l.map(v => {
    var schedule: Schedule
    const start = new ScheduledStartDateTime(new Date(v.scheduledStartDateTime))
    if(start.value.getHours() == 0) {
      schedule = new Schedule(start, ExecTiming[v.execTiming])
    } else {
      schedule = Schedule.createOnlyDateTime(start)
    }

    var actualTermOption: option.Option<ActualTerm>;
    if(v.startDateTime.length == 0) {
      actualTermOption = option.empty()
    } else {
      var endOption: option.Option<ActualEndDateTime>
      if(v.endDateTime.length == 0) {
        endOption = option.empty();
      } else {
        endOption = option.some(new ActualEndDateTime(new Date(v.endDateTime)))
      }
      const term = new ActualTerm(
        new ActualStartDateTime(new Date(v.startDateTime)),
        endOption
      )
      actualTermOption = option.some(term)
    }

    return new Task(
      new TaskId(v.taskId),
      new TaskTitle(v.taskTitle),
      schedule,
      new EstimateHour(v.estimateHour),
      new Actual(actualTermOption),
      v.isarchived.length > 0
    );
  }).sort((a, b) => {
    return a.schedule.getSortValue() - b.schedule.getSortValue();
  })

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0);
  tomorrow.setMinutes(0);
  tomorrow.setSeconds(0);
  tomorrow.setMilliseconds(0);
  const todayList = list.filter(v => v.schedule.startDateTime.value.getTime() < tomorrow.getTime())
  const todayColumns = ['節','予定','タスク','見積','実績','開始','終了', 'archived']
  document.querySelector('#todayTaskHeader').innerHTML = todayColumns.map(v => `<th>${v}</th>`).join('');
  document.querySelector('#todayTaskBody').innerHTML = todayList.map(task => {
    return taskToRow(task, true);
  }).join('')

  const columns = ['日付', '節','予定','タスク','見積','実績','開始','終了', 'archived']
  document.querySelector('#taskHeader').innerHTML = columns.map(v => `<th>${v}</th>`).join('');
  document.querySelector('#taskBody').innerHTML = list.map(task => {
    return taskToRow(task);
  }).join('')
  console.log(list);
})