# Screens

ทุกหน้าเชื่อม SQLite แล้วและเปิดผ่าน Expo Router ใน `src/app/` ไม่ใช้ข้อมูลตัวอย่างเป็นแหล่งข้อมูลของแอป

| หน้าจอ | Route |
| --- | --- |
| CTableScreen | /customer/tables |
| CMenuScreen | /customer/menu?billId=... |
| CartScreen | /customer/cart?billId=... |
| COrderScreen | /customer/orders?billId=... |
| CBillScreen | /customer/bill?billId=... |
| KQueueScreen | /kitchen/queue |
| KDetailScreen | /kitchen/detail?roundId=... |
| ADashboardScreen | /admin/dashboard |
| ATableScreen | /admin/tables |
| AMenuScreen | /admin/menus |
| ABillScreen | /admin/bill?billId=... |
| BillHistoryScreen | /admin/history |
| DailyReportScreen | /admin/report |
| ResetTransactionsScreen | /admin/reset |

เปิดหน้าแรกเพื่อเลือกบทบาทและเข้าสู่ flow ที่มี billId/roundId ถูกต้อง หน้าอ่านข้อมูลมี loading, error และปุ่มลองใหม่ การเปลี่ยนสถานะและส่งออเดอร์ป้องกันการกดซ้ำ ราคาที่ส่งเข้าฐานข้อมูลเป็นจำนวนเต็มหน่วยสตางค์; components ที่รับราคาเป็นบาทได้รับข้อมูลที่แปลงแล้วจาก db adapter
