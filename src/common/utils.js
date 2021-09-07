/**
 * 日期格式化函数
 * @param {时间戳} stamp
 * @param {日期格式} format
 * @returns
 */
function dateFormart(stamp, format = 'YYYY-MM-DD hh:mm:ss') {
  const date = new Date(stamp)
  const config = {
    YYYY: date.getFullYear(),
    MM: (date.getMonth() + 1 + '').padStart(2, '0'),
    DD: date
      .getDate()
      .toString()
      .padStart(2, '0'),
    hh: date
      .getHours()
      .toString()
      .padStart(2, '0'),
    mm: date
      .getMinutes()
      .toString()
      .padStart(2, '0'),
    ss: date
      .getSeconds()
      .toString()
      .padStart(2, '0')
  }
  for (const key in config) {
    format = format.replace(key, config[key])
  }
  return format
}

export { dateFormart }
