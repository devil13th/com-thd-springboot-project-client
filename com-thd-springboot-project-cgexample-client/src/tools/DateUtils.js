export default {
  formatToDate: function (shijianchuo) {
    if (shijianchuo) {
      let add0 = function (m) {
        return m < 10 ? "0" + m : m;
      };

      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y + "-" + add0(m) + "-" + add0(d);
    } else {
      return "";
    }
  },
  formatToTime: function (shijianchuo) {
    if (shijianchuo) {
      let add0 = function (m) {
        return m < 10 ? "0" + m : m;
      };

      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return (
        y +
        "-" +
        add0(m) +
        "-" +
        add0(d) +
        " " +
        add0(h) +
        ":" +
        add0(mm) +
        ":" +
        add0(s)
      );
    } else {
      return "";
    }
  },
};
