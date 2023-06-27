class TimeUtil {
  public secondsFromNow = (sec: number): Date => {
    var dateObject = new Date()
    dateObject.setTime(dateObject.getTime() + 1000 * sec)
    return dateObject
  }

  public minutesFromNow = (min: number): Date => {
    var dateObject = new Date()
    dateObject.setTime(dateObject.getTime() + 1000 * 60 * min)
    return dateObject
  }

  public daysFromNow = (days: number): Date => {
    var dateObject = new Date()
    dateObject.setDate(dateObject.getDate() + days)
    return dateObject
  }
}

export default TimeUtil
