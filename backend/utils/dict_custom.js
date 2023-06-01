_custom_dict = [
    [
        "學年度",
        "台大",
        "台灣大學",
        "國立台灣大學",
        "台大山服",
        "慈幼山地服務團",
        "山服",
        "加拿",
        "加拿家",
        "新武",
        "新武家",
        "霧鹿",
        "霧鹿家",
        "利稻",
        "利稻家",
        "電光",
        "電光家",
        "教案",
        "志工",
        "公關",
        "教案",
        "財務",
        "文書",
        "平課",
        "課輔",
        "文健站",
        "家別",
        "期數",
        "素養",
        "隊輔"
      ],
  ];
   
  
  // 引用設定檔案，以下不用變更 
  if (typeof(define) === "function") {
      define(function (require) {
          return _custom_dict;
      });
  }
  else {
      module.exports = _custom_dict;
  }