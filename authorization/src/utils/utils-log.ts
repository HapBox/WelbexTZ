const color = {
  reset: '\x1b[0m',
  fgcyan: '\x1b[36m',
  fgmagenta: '\x1b[35m',
  error: '\x1b[31m',
  ok: '\x1b[32m',
  warn: '\x1b[33m',
  info: '\x1b[36m',
  debug: '\x1b[34m',
};

export default class Log {
  private static newTrace(): string {
    const err = new Error();
    // @ts-ignore
    return err.stack;
  }

  private static paramsToString(params: any[]): string {
    let msg = '';

    for (let i = 0; i < params.length; i++) {
      if (params[i] instanceof Object) {
        msg += JSON.stringify(params[i], null, 2);
      } else {
        msg += params[i];
      }

      if (i != params.length - 1) {
        msg += ', ';
      }
    }

    return msg;
  }

  public static makeDate() {
    const formatter = new Intl.DateTimeFormat('ru', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    return formatter.format(new Date());
  }

  private static makeLine(colorHex = color.ok, params: any[]) {
    const date = this.makeDate();
    let fullTrace = this.newTrace();
    let trace = fullTrace.split('at ')[4].trimEnd();

    let line, func;
    if (trace.indexOf(' ') == -1) {
      // Нет пробела - контекст вызова неизвестен
      func = 'file';
      line = trace;
    } else {
      // Есть пробел - контекст вызова известен
      func = trace.split(' ')[0];
      line = trace.split(' ')[1];
    }

    const msg = this.paramsToString(params);

    return console.log('\n' + colorHex + date + ' | ' + msg + ' | ' + func + ': ' + line + color.reset);
  }

  private static makeErrorLine(colorHex = color.ok, errData: { params?: any[]; error?: any }) {
    const date = this.makeDate();
    let trace, fullTrace, line, func;

    if (errData.error && errData.error.stack) {
      fullTrace = errData.error.stack;
      trace = fullTrace.split('at ')[1]?.trimEnd();
    } else if (!errData.error || !errData.error.stack || !trace) {
      fullTrace = this.newTrace();
      trace = fullTrace.split('at ')[4].trimEnd();
    }

    if (trace.indexOf(' ') === -1) {
      // Нет пробела - контекст вызова неизвестен
      func = 'file';
      line = trace;
    } else {
      // Есть пробел - контекст вызова известен
      func = trace.split(' ')[0];
      line = trace.split(' ')[1];
    }

    let fullMsg = date;

    if (errData.params) {
      fullMsg += ' | ' + this.paramsToString(errData.params);
    }

    fullMsg += ' | ' + func + ' : ' + line + '\nFullTrace ' + fullTrace;

    return console.log('\n' + colorHex + fullMsg + color.reset);
  }

  static ok(...optionalParams: any[]): void {
    return this.makeLine(color.ok, optionalParams);
  }

  static info(...optionalParams: any[]): void {
    return this.makeLine(color.info, optionalParams);
  }

  static errorSimple(data: any) {
    if (data instanceof Error) {
      Log.makeErrorLine(color.error, {
        error: data,
      });
    } else {
      Log.makeErrorLine(color.error, {
        params: [data],
      });
    }
  }

  static error(message: any, error?: any): void {
    Log.makeErrorLine(color.error, {
      params: [message],
      error,
    });
  }

  static default(...optionalParams: any[]): void {
    return this.makeLine(color.reset, optionalParams);
  }
}
