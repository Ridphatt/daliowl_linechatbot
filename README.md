# Google Apps Script พัฒนาไลน์แชทบอทสรุปรายจ่ายจากรูปภาพสลิปโอนเงิน
โครงงานพัฒนาไลน์แชทบอทเดลีอาวสำหรับสรุปรายจ่ายจากรูปภาพสลิปโอนเงินอิเล็กทรอนิกส์ของธนาคารกรุงไทย นำเทคโนโลยีของกูเกิลคลาวด์ วิชั่น (Google Cloud Vision) เข้ามาช่วยขั้นตอนการถอดข้อความจากรูปภาพสลิปโอนเงิน

## วิธีใช้งานไลน์แชทบอท
1. แอดไลน์ @421cjwlr
2. สามารถเข้าไปใช้ได้เลย โดยจะใช้รูปภาพที่ [KruthaiNEXT - Google ไดรฟ์](https://drive.google.com/drive/folders/1Rliaea8hMdOhR0ZMTWknhPq8a1q5ObJM?hl=th) สามารถกดส่งเข้าไปได้เลย

> หมายเหตุ ห้ามส่งรูปภาพซ้ำกัน
3. เช็คข้อมูล [dataSlips - Google ไดรฟ์](https://drive.google.com/drive/folders/1nebh7yMVQ8TPSJoRvIR-gAs6S3G4FcSt?hl=th) และ [LinechatBot_daliowl - Google ชีต](https://docs.google.com/spreadsheets/d/1g0HxBIAcf2PtE6K_1dBQemWWMENSyXbzBLToJ2qkMWU/edit#gid=2066767183) 
4. ข้อมูลรูปภาพสลิปโอนเงินที่มีให้เป็นข้อมูล อดีต ตัวโค้ดจะถูกตั้งค่าเป็นวันที่ 14 สิงหาคม สามารถกดปุ่มเมนูในไลน์แชทบอทได้เลย 
### ถ้าต้องการดูยอดรวมรายวันและรายสัปดาห์ต้องไปแก้วันที่ใหม่ ทั้ง 2 ฟังก์ชัน
1. function  getTotalExpenseByDay() บรรทัดที่ 404 และ 407
2. function  getTotalExpenseByWeek() บรรทัดที่ 352 และ 353
3. โค้ด [linebot_daliowl - เครื่องมือแก้ไขโครงการ - Apps Script (google.com)](https://script.google.com/u/0/home/projects/1zkGs7O3qAD1bmENqT88-bMiaGb5QlHdVVoP8DetcSsE6IASDOru1TsU3/edit)
4. กดการทำให้ใช้งานได้ คลิก "จัดการการทำให้ใช้งานได้"
![enter image description here](https://kaebmoo.files.wordpress.com/2023/02/image-3.png)
5. คลิกไอคอน รูปดินสอ  เพื่อแก้ไขเวอร์ชัน 
6. ดรอปดาวน์ ตรงช่องเวอร์ชันลงมา คลิก เวอร์ชันใหม่ และ commit รายละเอียดเกี่ยวกับที่แก้ไข้ไป
7. มุมขวาล่าง คลิก " การทำให้ใช้งานได้ " จากนั้นกดเสร็จสิ้น
