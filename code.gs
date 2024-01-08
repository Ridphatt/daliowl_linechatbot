var ACCESS_TOKEN = 'I9arJZz9eEhfWrwgcRyEUhaEFPCfqPph+x2v6SZYeGGjKRnjQ6xVO/TK+4KXOakcEShXnAQQV2H1762nldKjl6wIkdHjahuJFzk12xIPyPTcab0djwsYKPlA6QT6aVxbeFKP0kSQV5W9Ft7hOy8SdwdB04t89/1O/w1cDnyilFU=';

var REPLY_URL = 'https://api.line.me/v2/bot/message/reply';
const FOLDER_ID = '1nebh7yMVQ8TPSJoRvIR-gAs6S3G4FcSt';            //ไอดีกูเกิลไดร์ฟ
const SHEET_ID = '1g0HxBIAcf2PtE6K_1dBQemWWMENSyXbzBLToJ2qkMWU';  //ไอดีกูเกิลชีท

/**---------------------------------------------------------------------------การสร้าง menu line bot----------------------------------------------------------------------------------------------**/
/**ฟังก์ชัน createMenu มีหน้าที่เอาไว้สร้าง menu**/
function createMenu() {
  //รูปแบบ rich menu จาก json ที่ได้จาก Line bot Designer
  var richMenu = {
  "size": {
    "width": 2500,
    "height": 843
  },
  "selected": true,
  "name": "Rich Menu 1",
  "chatBarText": "เมนู",
  "areas": [
    {
      "bounds": {
        "x": 4,
        "y": 4,
        "width": 824,
        "height": 831
      },
      "action": {
        "type": "message",
        "text": "ยอดรวมรายวัน"
      }
    },
    {
      "bounds": {
        "x": 845,
        "y": 8,
        "width": 806,
        "height": 828
      },
      "action": {
        "type": "message",
        "text": "ยอดรวมรายสัปดาห์"
      }
    },
    {
      "bounds": {
        "x": 1672,
        "y": 13,
        "width": 820,
        "height": 823
      },
      "action": {
        "type": "message",
        "text": "ยอดรวมรายเดือน"
      }
    }
  ]
}

  //ตัวแปร OptionMenu เป็นตัวแปรโครงสร้าง rich menu ด้วย api ตามรูปแบบที่ Line ได้กำหนดไว้ ซึ่งตัวแปร OptionMenu ทำการส่ง request ไป
  var optionMenu = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + ACCESS_TOKEN,
    },
    "payload": JSON.stringify(richMenu)  //ใช้คำสั่ง JSON.stringify แปลงค่าตัวแปล richMenu ที่เป็นภาษา google script ให้เป็น json object 
  };

  
  var response = UrlFetchApp.fetch("https://api.line.me/v2/bot/richmenu", optionMenu); //ตัวแปร response ใช้คำสั่ง UrlFetchApp.fetch ส่งค่า optionMenu ไปยัง link api ของ Line ให้สร้าง rich menu
  var resJsonRich = response.getContentText();                                             //และดึงค่า json ที่เขาตอบกลับมา ให้ไปเก็บในตัวแปร resJson
  var data = JSON.parse(resJsonRich);                                                      //ใช้คำสั่ง JSON.parse() แปลงค่า json ให้เป็น google script เก็บไว้ที่ data

  //log เอาค่า data.richMenuId ไปใช้ใน postman
  //Logger.log(resJsonRich);
  //Logger.log(data.richMenuId);  //ที่ใช้ .richMenuId ต่อท้าย data เพราะต้องการเข้าถึง richMenu ข้างใน ค่า data.richMenuId

  //ใช้ Postman ในการ uplode รูปเมนู โดยใช้ endpoint url ที่ลิงค์ https://developers.line.biz/en/reference/messaging-api/#upload-rich-menu-image กำหนด method เป็น POST
  return data.richMenuId;
}

/**ฟังก์ชัน setDefaultRichMenu มีหน้าที่ set default ของ rich menu ในแชทบอท**/
function setDefaultRichMenu(){
  var optionSet = {
    "method" : "post",
    "headers" : {
      "Authorization" : 'Bearer ' + ACCESS_TOKEN,
    },
  };

  //ไปเอาได้ที่ https://developers.line.biz/en/reference/messaging-api/#set-default-rich-menu
  var response = UrlFetchApp.fetch("https://api.line.me/v2/bot/user/all/richmenu/richmenu-0bef986840c9c4cacf23c980210ccdb7",optionSet);  //ไปเอาข้อมูล richmenu id ที่ฟังก์ชัน createMenu
  var resJsonSet = response.getContentText();
  var data = JSON.parse(resJsonSet);


  Logger.log(resJsonSet);
  Logger.log(data.richMenuId); 

  return data.richMenuId
}

/**--------------------------------------------------------สิ้นสุดการสร้าง menu line bot ---------------------------------------------------------------------------**/

/**ฟังก์ชัน replyMessage มีหน้าที่ส่งข้อความตอบกับไปยังแชทบอท แต่เป็นของข้อความ*/
function replyMessage(replyToken, message) {
  var headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + ACCESS_TOKEN,
  };
  var data = {
    "replyToken": replyToken,
    "messages": [
      {
        "type": "text",
        "text": message,
      },
    ],
  };
  var options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(data),
  };
  UrlFetchApp.fetch(REPLY_URL, options);
  return true;
}

/**ฟังก์ชัน saveImage  มีหน้าที่บันทึกรูปภาพ*/
function saveImage(blob) {
  try{
    var folder = DriveApp.getFolderById(FOLDER_ID);
    // var file = folder.createFile(blob); 
    fileID = folder.createFile(blob).getId();
    url = 'https://lh3.googleusercontent.com/d/'+fileID;
    return url;
  }catch(e){
    return false;
  }
}

/**ฟังก์ชัน getImage มีหน้าที่ขอข้อมูลภาพจาก LINE API และทำการแปลงเป็น Blob ใน Google Apps Script พร้อมกับกำหนดชื่อไฟล์ให้กับ Blob นั้นๆ.*/
function getImage(id) {
   var url = 'https://api-data.line.me/v2/bot/message/' + id + '/content';
   try {
      var data = UrlFetchApp.fetch(url,{
        "headers": {
          'Authorization' :  'Bearer ' + ACCESS_TOKEN,
        },
        'method': 'get'
      });
      var img = data.getBlob().getAs('image/png').setName( id + '.png');    
      return img;
   } catch (error) {
      console.error('Error fetching image:', error);
      return null;
   }
}


// ฟังก์ชัน saveImageToSheet ทำหน้าที บันทึกรูปภาพลงใน Google Sheet ใช้ไลบรารี Google Apps Script 
function saveImageToSheet(url, fileName) {
  // ระบุ ID ของ Google Sheet ที่คุณต้องการบันทึกข้อมูล
  var sheetId = SHEET_ID;
  // ระบุชื่อของ Google Sheet ที่ต้องการบันทึกข้อมูล
  var sheetName = 'useDatabase';
  // เปิด Google Sheet ด้วย ID
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);

  // หาแถวที่มีข้อมูลอยู่และหาแถวถัดไปที่ว่าง
  var firstRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var lastRow = sheet.getLastRow() + 1;

  // ถ้าแถวแรกไม่ว่างให้ใช้แถวถัดไป
  if (firstRow.some(cell => cell !== "")) {
    lastRow = sheet.getLastRow() + 1;
  }

  // เพิ่มข้อมูลลงใน Google Sheet 1 เป็นหมายเลขของคอลัมน์ที่จะเขียน (1 คือคอลัมน์ A), 1 เป็นจำนวนแถวที่จะเขียน, 2 เป็นจำนวนคอลัมน์ที่จะเขียน.
  sheet.getRange(lastRow, 1, 1, 2).setValues([[url, fileName]]);  
}


function saveDateAmountToSheet(date, amount) {
  //date = 2566/02/12
  //amount = 200.00
  try{
  // ระบุ ID ของ Google Sheet ที่คุณต้องการบันทึกข้อมูล
  var sheetId = SHEET_ID;
  // ระบุชื่อของ Google Sheet ที่ต้องการบันทึกข้อมูล
  var sheetName = 'useDatabase';
  // เปิด Google Sheet ด้วย ID
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);

  var lastRow = sheet.getLastRow();

  // เพิ่มข้อมูลลงใน Google Sheet 1 เป็นหมายเลขของคอลัมน์ที่จะเขียน (5 คือคอลัมน์ E), 1 เป็นจำนวนแถวที่จะเขียน, 2 เป็นจำนวนคอลัมน์ที่จะเขียน.
  sheet.getRange(lastRow, 5, 1, 2).setValues([[date, amount]]);
  return true;
    }catch(e) {
    return false;
  }  
}



function formatData(transactionText) {
  try{
    /*transactionText = "
          Krungthai กรุงไทย
          เติมเงินสําเร็จ
          รหัสอ้างอิง 20230804738411077
          น.ส.พัทธ์ธีรา รีดจูงพืช
          กรุงไทย
          XXX-X-XX159-8
          เอไอเอส วันทูคอล
          AIS 026
          (12C)
          หมายเลขโทรศัพท์ เคลื่อนที่
          จํานวนเงิน
          ค่าธรรมเนียม
          วันที่ทํารายการ
          0921930520
          250.00 บาท
          0.00 บาท
          04 ส.ค. 2566 - 07:38"*/

    const lines = transactionText.split('\n').filter(line => line.trim() !== '');  //หั่นทั้งหมด เจอ /n
    const transactionDateParts = lines[lines.length - 1].split(' - ')[0];          //เจอ - หั่น และเก็บช่อง 0 //ex. ['y.m.d', 'time']
    //const amount = lines[15].split(' ')[0];
    
    const regex = /(\d+\.\d{2})\s*บาท/i;            //ใช้ Regex เพื่อค้นหาข้อมูลที่ต้องการหาจำนวนเงิน #i = ว่าไม่สนใจตัวอักษรพิมพ์เล็กหรือพิมพ์ใหญ่.
    const match = transactionText.match(regex);     //match[0] จะเก็บข้อมูลทั้งหมดที่ตรงกับ Regex "250.00 บาท" // match[1] เอาเค่ "250.00"
    let amount = 0;                              
  
    if (match) {
      amount = match[1];         //เก็บจำนวนเงิน
      console.log(amount);
    } else {
      //console.log('ไม่พบข้อมูล');
      return false;
    }
    // const transactionObj = {
    //   amount: amount,
    //   transactionDate: transactionDateParts,
    // };

    //const jsonTransaction = JSON.stringify(transactionObj, null, 2);
    formattedDate = formatDate(transactionDateParts);                   //เรียก formatDate เอาวันที่ไปเปลี่ยน -> yyyy/mm/dd
    return { formattedDate, amount };
  }catch(e) {
    return false;
  }  
}


function formatDate(dateParts) {
  try{
    //dateParts = ['27 ก.พ. 2566'];
    // แยกวันที่ ['27 ก.พ. 2566'] --> ['27','ก.พ.','2566']
    const [day, monthAbbreviation, year] = dateParts.split(' ');    //หั่น เมื่อเจอช่องว่าง
    
    // แปลงชื่อเดือนเป็น index 0-11
    const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    
    
    const month = monthNames.indexOf(monthAbbreviation) + 1;  //+1 ให้มันตรง 1-12 เช่น ก.พ. จาก 1 --> 2
    
    //ใช้ Template literals ใน JavaScript เพื่อสร้าง String = '${year}/${month.toString().padStart(2, '0')}/${day.padStart(2, '0')}'; 
    // 2566/02/27 สตริง
    // yyyy/mm/dd
    const formattedDate = `${year}/${month.toString().padStart(2, '0')}/${day.padStart(2, '0')}`;  

    //Logger.log("formattedDate = ",formattedDate);
    return formattedDate
  }catch(e) {
    return false;
  }  
}


//ฟังก์ชัน readTextFromImage ทำหน้าที อ่านข้อความจากรูปภาพจาก Google Sheet และบันทึกลงใน Google Sheet 
function readTextFromImage() {
  const sheetName = 'useDatabase';
  var sh1= SpreadsheetApp.openById(SHEET_ID).getSheetByName(sheetName)
  var lrow = sh1.getLastRow();
  sh1.getRange(lrow, 3).setValue("Pending...");
                        //ล่างสุด,ช่องที่
  var url = sh1.getRange(lrow,1).getValue();
  var imageBlob = UrlFetchApp.fetch(url).getBlob();
  var resource= {
    title : imageBlob.getName(),
    mimeType : imageBlob.getContentType()
  }
  var options ={
    ocr : true
  }
  var docFile = Drive.Files.insert(resource,imageBlob,options);
  var doc = DocumentApp.openById(docFile.id);
  var text = doc.getBody().getText();
  sh1.getRange(lrow, 3).setValue(text);
  Drive.Files.remove(docFile.id);
  return text;
}


//คำนวนรายจ่ายที่ตรงกับเดือนที่ต้องการ
function getTotalExpenseByMonth(monthNum) {
  //var monthNum = 8
  const sheetName = 'useDatabase';

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(sheetName);
  
  const dataRange = sheet.getDataRange(); // ดึงข้อมูลทั้งหมดในแผ่นนั้น
  const values = dataRange.getValues();   // ดึงค่าในช่อง

  let totalExpense = 0;

  // วนลูปผ่านข้อมูล
  for (let i = 1; i < values.length; i++) {
    // ดึงข้อมูลใน column D (วันที่) และ F (จำนวนเงิน)
    const date = values[i][4]; // Column E
    const expense = values[i][5]; // Column F

    // ตรวจสอบว่าวันที่ตรงกับเดือนที่กำหนดหรือไม่
    const rowMonthNum = new Date(date).getMonth() + 1;

    if (rowMonthNum === monthNum) {
      // ถ้าตรงกัน ให้บวกค่าเงินใน column F เข้ากับรายจ่ายรวม
      totalExpense += parseFloat(expense);
    }
  }
  Logger.log(totalExpense);
  return totalExpense;
}


function getTotalExpenseByWeek(weekNum) {        // 0 หรือ 1
  //weekNum = 0; // นี้ weekNum = 1; // แล้ว
  const sheetName = 'useDatabase';

  // เปิด Google Sheet ด้วย ID
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(sheetName);

  // ดึงข้อมูลทั้งหมดใน column E และ F
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  let totalWeekExpense = 0;

  //หาวันเริ่มต้นและวันสิ้นสุดของทุกอาทิตย์
  const weekStart = new Date('August 14, 2023');             //ถ้าต้องการเช็ค week นี้  new Date('August 14, 2023');
  const weekEnd = new Date('August 14, 2023');               // new Date('August 14, 2023');
 
  const daysToSubtract = weekNum * 7        //ถ้าเป็น 7
  // (2-1)*7 +(1) --> 8
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()-daysToSubtract); //เอาไว้หา 7 วันที่แล้ว เริ่มวันไหน

  if(weekNum === 0){
    weekEnd.setDate(weekEnd.getDate())
  }else{
    weekEnd.setDate(weekStart.getDate() + 6)                                   // + ไปอีก 6 วัน
  }

  // คศ --> พศ
  weekStart.setFullYear(weekStart.getFullYear() + 543);
  weekEnd.setFullYear(weekEnd.getFullYear() + 543);

  // วนลูปผ่านข้อมูล
  for (let i = 1; i < values.length; i++) {
    // ดึงข้อมูลใน column D (วันที่) และ F (จำนวนเงิน)
    const date = values[i][4]; // Column E
    const expense = values[i][5]; // Column F

    const expenseDate = new Date(date);
    Logger.log(expenseDate);
    if (expenseDate >= weekStart && expenseDate <= weekEnd) {
      //Logger.log(expenseDate," >= ", weekStart," <=",weekEnd);
      totalWeekExpense += parseFloat(expense);  // ถ้าตรงกัน ให้บวกค่าเงินใน column F เข้ากับรายจ่ายรวม
      Logger.log(totalWeekExpense);
    }
  }
  Logger.log("sweek"+weekStart);
  Logger.log("eweek"+weekEnd);
  Logger.log("totalweek"+totalWeekExpense);
  return totalWeekExpense;
}



function getTotalExpenseByDay() {
  
  const sheetName = 'useDatabase';

  // เปิด Google Sheet ด้วย ID
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(sheetName);

  // ดึงข้อมูลทั้งหมดใน column E และ F
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  let totalDayExpense = 0;

  const startOfDay  = new Date('August 14, 2023');    //กำหนดวันนั้น ๆ ต้องกำหนดตรงใน() เช่น new Date('August 14, 2023');
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay  = new Date('August 14, 2023');       //ต้องกำหนดตรงนี้ด้วย new Date('August 14, 2023');
  endOfDay.setHours(23, 59, 59, 999);

  // คศ --> พศ
  startOfDay .setFullYear(startOfDay .getFullYear() + 543);
  endOfDay .setFullYear(endOfDay .getFullYear() + 543);

  // วนลูปผ่านข้อมูล
  for (let i = 1; i < values.length; i++) {
    // ดึงข้อมูลใน column D (วันที่) และ F (จำนวนเงิน)
    const date = values[i][4]; // Column E
    const expense = values[i][5]; // Column F

    const expenseDate = new Date(date);                                  //วันแต่ละช่องใน ในคลอลัมน์ E
    Logger.log(expenseDate);
    if (expenseDate >= startOfDay  && expenseDate <= endOfDay ) {        //เทียบวันช่องในในคลอลัมน์ E กับวันจริง
    Logger.log(expenseDate," >= ", startOfDay ," <=",endOfDay );
      totalDayExpense += parseFloat(expense);                            // ถ้าตรงกันให้บวกค่าเงินใน column F เข้ากับรายจ่ายรวม
    Logger.log(totalDayExpense);
    }
  }
  Logger.log("sday"+startOfDay);
  Logger.log("eday"+endOfDay);
  Logger.log("totalday"+totalDayExpense);
  return totalDayExpense;
}


/**ฟังก์ชัน doPost ทำงานเกี่ยวกับรับข้อมูล ของผู้ใช้งาน**/
function doPost(e) {
  var event = JSON.parse(e.postData.contents).events[0]; //รับข้อความมาแปลเป็นภาษา google script
  //console.log("Dopost");
  var text = event.message.text;
  var replyToken = event.replyToken;


  if(event.message.type === 'image') {
    try {

      var img = getImage(event.message.id);
      var url = saveImage(img);

      // ได้ชื่อของรูปภาพ
      var fileName = img.getName(); 

      //เรียกฟังชั่น saveImageToSheet
      saveImageToSheet(url, fileName); 
      
      //อ่านภาพจากรูป และเซฟลงชีต
      var text = readTextFromImage(); 

      // อ่านค่าจากชีตและรีเทรินค่าวันที่และยอดเงิน
      var { formattedDate, amount } = formatData(text); 

      // เซฟค่าวันที่และเงินลงชีต
      saveDateAmountToSheet(formattedDate, amount); 
      var msg = "บันทึกรูปภาพสลิปโอนเงินเรียบร้อย" 
      replyMessage(replyToken,msg);

    }catch(e) {
      return false;
    }
  }
  else if(event.type === 'text' || event.type === "message"){
    try{
      const monthNames = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'];
      const fullNameMonth = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];


      const weekNames = ['w1', 'w2'];

      if(text === "ยอดรวมรายวัน"){
        totalDayExpense = getTotalExpenseByDay()
        var msg = `วันนี้\nคุณใช้เงินไปทั้งหมด ${totalDayExpense} บาท`
        replyMessage(replyToken, msg);
      }
      else if(text === "ยอดรวมรายสัปดาห์"){
        var msg = "กรุณา ส่ง หมายเลขที่คุณต้องการ\nw1 = ยอดรวมสัปดาห์นี้\nw2 = ยอดรวมสัปดาห์ที่ผ่านมา"
        replyMessage(replyToken, msg);
      }
      else if(text === "ยอดรวมรายเดือน"){
        var msg = "กรุณาส่งหมายเลขที่คุณต้องการ\nm1 = มกราคม\nm2 = กุมภาพัทธ์\nm3 = มีนาคม\nm4 = เมษายน\nm5 = พฤษภาคม\nm6 = มิถุนายน\nm7 = กรกฎาคม\nm8 = สิงหาคม\nm9 = กันยายน\nm10 = ตุลาคม\nm11 = พฤศจิกายน\nm12 = ธันวาคม"
        replyMessage(replyToken, msg);
      }
      else if (monthNames.includes(text)||fullNameMonth.includes(text)){    // ตรวจสอบเดือนจากผู้ใช้ว่าตรงกับเดือนอะไร
        const monthNum = monthNames.indexOf(text) + 1;                      //แปลงให้มันตรง เลข 1-12
        
        var totalExpense = getTotalExpenseByMonth(monthNum);                //เรียกฟังก์ชันค้นหาเดือนและคำนวนรายจ่าย
        
        const month = fullNameMonth[monthNum - 1];                          // -1 กลับมาเพราะจะใช้ 0-11 ใน fullNameMonth
        var msg = `เดือน ${month}\nคุณใช้เงินไปทั้งหมด คือ ${totalExpense} บาท`   
        replyMessage(replyToken, msg);                                      //replyMessage เดือนนี้จ่ายเท่าไหร่
      }
      else if(weekNames.includes(text)){                                    
        const weekNum = weekNames.indexOf(text);

        totalWeekExpense = getTotalExpenseByWeek(weekNum)                   //เรียกฟังก์ชัน สัปดาหื
        if (weekNum === 0 ){
          var msg = `สัปดาห์นี้\nคุณใช้เงินไปทั้งหมด ${totalWeekExpense} บาท`         // 0 นี้
        }else{
          var msg = `สัปดาห์ที่ผ่านมา\nคุณใช้เงินไปทั้งหมด ${totalWeekExpense} บาท`    // 1 ที่ผ่านมา
        }
        replyMessage(replyToken, msg);                                       
      }
    }catch(e) {
      return false;
    }      
  }

  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}