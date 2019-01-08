// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"0pHl":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

exports.__esModule = true;

var Vo =
/** @class */
function () {
  function Vo(value) {
    this.value = value;
  }

  return Vo;
}();

var StringVo =
/** @class */
function (_super) {
  __extends(StringVo, _super);

  function StringVo() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return StringVo;
}(Vo);

exports.StringVo = StringVo;

var NumberVo =
/** @class */
function (_super) {
  __extends(NumberVo, _super);

  function NumberVo() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return NumberVo;
}(Vo);

exports.NumberVo = NumberVo;

var DateVo =
/** @class */
function (_super) {
  __extends(DateVo, _super);

  function DateVo() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  DateVo.prototype.getDateText = function () {
    return this.value.getFullYear() + "/" + this.getDateExcludeYearText();
  };

  DateVo.prototype.getDateExcludeYearText = function () {
    return DateVo.zerofill(this.value.getMonth() + 1) + "/" + DateVo.zerofill(this.value.getDate());
  };

  DateVo.prototype.getTimeText = function () {
    return DateVo.zerofill(this.value.getHours()) + ":" + DateVo.zerofill(this.value.getMinutes());
  };

  DateVo.zerofill = function (v) {
    return ('0' + v).slice(-2);
  };

  DateVo.toJpnDay = function (num) {
    return '日月火水木金土'[num];
  };

  return DateVo;
}(Vo);

exports.DateVo = DateVo;
},{}],"Vmx1":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

function optionOf(v) {
  if (v === null || v === undefined) {
    return new None();
  }

  return new Some(v);
}

exports.optionOf = optionOf;

function some(v) {
  return new Some(v);
}

exports.some = some;

function empty() {
  return new None();
}

exports.empty = empty;

var Some =
/** @class */
function () {
  function Some(value) {
    this.value = value;
  }

  Some.prototype.map = function (cb) {
    return optionOf(cb(this.value));
  };

  Some.prototype.isEmpty = function () {
    return false;
  };

  Some.prototype.isDefined = function () {
    return true;
  };

  Some.prototype.get = function () {
    return this.value;
  };

  Some.prototype.getOr = function (cb) {
    return this.value;
  };

  return Some;
}();

exports.Some = Some;

var None =
/** @class */
function () {
  function None() {}

  None.prototype.map = function (cb) {
    return empty();
  };

  None.prototype.isEmpty = function () {
    return true;
  };

  None.prototype.isDefined = function () {
    return false;
  };

  None.prototype.get = function () {
    throw new Error("value is none");
  };

  None.prototype.getOr = function (cb) {
    return cb();
  };

  return None;
}();

exports.None = None;
},{}],"jP6t":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

exports.__esModule = true;

var vo = __importStar(require("./vo"));

var option = __importStar(require("./option"));

function zerofill(v) {
  return ('0' + v).slice(-2);
}

var Hoge =
/** @class */
function (_super) {
  __extends(Hoge, _super);

  function Hoge() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return Hoge;
}(vo.StringVo);

var a = new Hoge("ge");
console.log(a);
var ExecTiming;

(function (ExecTiming) {
  ExecTiming["AM"] = "AM";
  ExecTiming["PM1"] = "PM1";
  ExecTiming["PM2"] = "PM2";
  ExecTiming["OVER"] = "OVER";
})(ExecTiming || (ExecTiming = {}));

var ScheduledStartDateTime =
/** @class */
function (_super) {
  __extends(ScheduledStartDateTime, _super);

  function ScheduledStartDateTime() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  ScheduledStartDateTime.prototype.hasTime = function () {
    return this.value.getHours() > 0 || this.value.getMinutes() > 0;
  };

  return ScheduledStartDateTime;
}(vo.DateVo);

var Schedule =
/** @class */
function () {
  function Schedule(startDateTime, execTiming) {
    this.startDateTime = startDateTime;
    this.execTiming = execTiming;
  }

  Schedule.createOnlyDateTime = function (startDateTime) {
    var h = startDateTime.value.getHours();
    var execTiming;

    if (h < 12) {
      execTiming = ExecTiming.AM;
    } else if (h < 15) {
      execTiming = ExecTiming.PM1;
    } else if (h < 18) {
      execTiming = ExecTiming.PM2;
    } else {
      execTiming = ExecTiming.OVER;
    }

    return new Schedule(startDateTime, execTiming);
  };

  Schedule.prototype.getSortValue = function () {
    var p = 0;

    if (this.execTiming == ExecTiming.PM1) {
      p = 1;
    } else if (this.execTiming == ExecTiming.PM2) {
      p = 2;
    }

    if (this.execTiming == ExecTiming.OVER) {
      p = 3;
    }

    return parseInt("" + this.startDateTime.getDateText().split('/').join('') + p);
  };

  return Schedule;
}();

var EstimateHour =
/** @class */
function (_super) {
  __extends(EstimateHour, _super);

  function EstimateHour() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return EstimateHour;
}(vo.NumberVo);

var ActualHour =
/** @class */
function (_super) {
  __extends(ActualHour, _super);

  function ActualHour() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return ActualHour;
}(vo.NumberVo);

var ActualStartDateTime =
/** @class */
function (_super) {
  __extends(ActualStartDateTime, _super);

  function ActualStartDateTime() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return ActualStartDateTime;
}(vo.DateVo);

var ActualEndDateTime =
/** @class */
function (_super) {
  __extends(ActualEndDateTime, _super);

  function ActualEndDateTime() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  ActualEndDateTime.prototype.calcActualHour = function (startDateTime) {
    return new ActualHour((this.value.getTime() - startDateTime.value.getTime()) / (60 * 60 * 1000));
  };

  return ActualEndDateTime;
}(vo.DateVo);

var ActualTerm =
/** @class */
function () {
  function ActualTerm(startDateTime, endDateTimeOption) {
    this.startDateTime = startDateTime;
    this.endDateTimeOption = endDateTimeOption;
    this.actualHourOption = endDateTimeOption.map(function (end) {
      return end.calcActualHour(startDateTime);
    });
  }

  ActualTerm.prototype.updateEndDateTime = function (actualEndDateTime) {
    return new ActualTerm(this.startDateTime, option.some(actualEndDateTime));
  };

  return ActualTerm;
}();

var Actual =
/** @class */
function () {
  function Actual(actualTermOption) {
    this.actualTermOption = actualTermOption;

    if (actualTermOption.isEmpty()) {
      this.actualHourOption = option.empty();
    } else {
      this.actualHourOption = actualTermOption.get().actualHourOption;
    }
  }

  Actual.prototype.getActualStartDateTimeOption = function () {
    return this.actualTermOption.map(function (v) {
      return v.startDateTime;
    });
  };

  Actual.prototype.getActualEndDateTimeOption = function () {
    if (this.actualTermOption.isEmpty()) {
      return option.empty();
    }

    return this.actualTermOption.get().endDateTimeOption;
  };

  return Actual;
}();

var TaskId =
/** @class */
function (_super) {
  __extends(TaskId, _super);

  function TaskId() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  TaskId.prototype._TaskId = function () {};

  return TaskId;
}(vo.StringVo);

var TaskTitle =
/** @class */
function (_super) {
  __extends(TaskTitle, _super);

  function TaskTitle() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  TaskTitle.prototype._TaskTitle = function () {};

  return TaskTitle;
}(vo.StringVo);

var Task =
/** @class */
function () {
  function Task(taskId, taskTitle, schedule, estimateHour, actual, isArchived) {
    this.taskId = taskId;
    this.taskTitle = taskTitle;
    this.schedule = schedule;
    this.estimateHour = estimateHour;
    this.actual = actual;
    this.isArchived = isArchived;
  }

  return Task;
}();

var TextTask =
/** @class */
function () {
  function TextTask() {}

  TextTask.create = function (text) {
    var obj = JSON.stringify(text);
    var textTask = new TextTask();
    textTask.id = obj.id;
    textTask.ti = obj.ti;
    textTask.sch = obj.sch;
    textTask.exe = obj.exe || '';
    textTask.est = obj.est;
    textTask.st = obj.st || '';
    textTask.end = obj.end || '';
    textTask.archive = obj.archive || '';
    return textTask;
  };

  return TextTask;
}();

var TaskConvertor =
/** @class */
function () {
  function TaskConvertor() {}

  TaskConvertor.prototype.dataToTask = function (v) {
    var schedule;
    var start = new ScheduledStartDateTime(new Date(v.scheduledStartDateTime));

    if (start.value.getHours() == 0) {
      schedule = new Schedule(start, ExecTiming[v.execTiming]);
    } else {
      schedule = Schedule.createOnlyDateTime(start);
    }

    var actualTermOption;

    if (v.startDateTime.length == 0) {
      actualTermOption = option.empty();
    } else {
      var endOption;

      if (v.endDateTime.length == 0) {
        endOption = option.empty();
      } else {
        endOption = option.some(new ActualEndDateTime(new Date(v.endDateTime)));
      }

      var term = new ActualTerm(new ActualStartDateTime(new Date(v.startDateTime)), endOption);
      actualTermOption = option.some(term);
    }

    return new Task(new TaskId(v.taskId), new TaskTitle(v.taskTitle), schedule, new EstimateHour(v.estimateHour), new Actual(actualTermOption), v.isArchived.length > 0);
  };

  TaskConvertor.prototype.taskToData = function (v) {
    var data = {};
    data.taskId = v.taskId.value;
    data.taskTitle = v.taskTitle.value;
    data.scheduledStartDateTime = v.schedule.startDateTime.value.toISOString();
    data.execTiming = v.schedule.execTiming;
    data.estimateHour = v.estimateHour.value;
    data.startDateTime = v.actual.getActualStartDateTimeOption().map(function (v) {
      return v.value.toISOString();
    }).getOr(function () {
      return '';
    });
    data.endDateTime = v.actual.getActualEndDateTimeOption().map(function (v) {
      return v.value.toISOString();
    }).getOr(function () {
      return '';
    });
    data.isArchived = v.isArchived ? 'o' : '';
    return data;
  };

  TaskConvertor.prototype.textToData = function (text) {
    var textTask = TextTask.create(text);
    var data = new SheetData();
    data.taskId = textTask.id;
    data.taskTitle = textTask.ti;
    data.scheduledStartDateTime = textTask.sch;
    data.execTiming = textTask.exe;
    data.estimateHour = parseInt(textTask.est);
    data.startDateTime = textTask.st;
    data.endDateTime = textTask.end;
    data.isArchived = textTask.archive;
    return data;
  };

  TaskConvertor.prototype.dataToText = function (data) {};

  return TaskConvertor;
}();

function taskToRow(task, excludeDate) {
  if (excludeDate === void 0) {
    excludeDate = false;
  }

  var d = excludeDate ? '' : "<td>" + task.schedule.startDateTime.getDateExcludeYearText() + "(" + vo.DateVo.toJpnDay(task.schedule.startDateTime.value.getDay()) + ")</td>";
  return "<tr>\n  " + d + "\n  <td>" + task.schedule.execTiming + "</td>\n  <td>" + (task.schedule.startDateTime.hasTime() ? task.schedule.startDateTime.getTimeText() : '') + "</td>\n  <td>" + task.taskTitle.value + "</td>\n  <td>" + task.estimateHour.value + "</td>\n  <td>" + task.actual.actualHourOption.map(function (v) {
    return '' + v.value;
  }).getOr(function () {
    return '';
  }) + "</td>\n  <td>" + task.actual.actualTermOption.map(function (v) {
    return v.startDateTime.getTimeText();
  }).getOr(function () {
    return '';
  }) + "</td>\n  <td>" + task.actual.actualTermOption.map(function (v) {
    return v.endDateTimeOption.map(function (w) {
      return w.getTimeText();
    }).getOr(function () {
      return '';
    });
  }).getOr(function () {
    return '';
  }) + "</td>\n  <td>" + (task.isArchived ? 'archived' : '') + "</td>\n  </tr>";
}

new Sheet().list(function (l) {
  var list = l.map(function (v) {
    var schedule;
    var start = new ScheduledStartDateTime(new Date(v.scheduledStartDateTime));

    if (start.value.getHours() == 0) {
      schedule = new Schedule(start, ExecTiming[v.execTiming]);
    } else {
      schedule = Schedule.createOnlyDateTime(start);
    }

    var actualTermOption;

    if (v.startDateTime.length == 0) {
      actualTermOption = option.empty();
    } else {
      var endOption;

      if (v.endDateTime.length == 0) {
        endOption = option.empty();
      } else {
        endOption = option.some(new ActualEndDateTime(new Date(v.endDateTime)));
      }

      var term = new ActualTerm(new ActualStartDateTime(new Date(v.startDateTime)), endOption);
      actualTermOption = option.some(term);
    }

    return new Task(new TaskId(v.taskId), new TaskTitle(v.taskTitle), schedule, new EstimateHour(v.estimateHour), new Actual(actualTermOption), v.isArchived.length > 0);
  }).sort(function (a, b) {
    return a.schedule.getSortValue() - b.schedule.getSortValue();
  });
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0);
  tomorrow.setMinutes(0);
  tomorrow.setSeconds(0);
  tomorrow.setMilliseconds(0);
  var todayList = list.filter(function (v) {
    return v.schedule.startDateTime.value.getTime() < tomorrow.getTime();
  });
  var todayColumns = ['節', '予定', 'タスク', '見積', '実績', '開始', '終了', 'archived'];
  document.querySelector('#todayTaskHeader').innerHTML = todayColumns.map(function (v) {
    return "<th>" + v + "</th>";
  }).join('');
  document.querySelector('#todayTaskBody').innerHTML = todayList.map(function (task) {
    return taskToRow(task, true);
  }).join('');
  var columns = ['日付', '節', '予定', 'タスク', '見積', '実績', '開始', '終了', 'archived'];
  document.querySelector('#taskHeader').innerHTML = columns.map(function (v) {
    return "<th>" + v + "</th>";
  }).join('');
  document.querySelector('#taskBody').innerHTML = list.map(function (task) {
    return taskToRow(task);
  }).join('');
  console.log(list);
});
},{"./vo":"0pHl","./option":"Vmx1"}]},{},["jP6t"], null)