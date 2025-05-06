import React, { useEffect, useState } from "react";
import AttendanceTable from "./AttendanceTable";
import AttendanceForm from "./AttendanceForm";


const Attendance: React.FC = () => {
  // هنا يتم نقل المنطق الرئيسي من الملف القديم
  // يمكن إضافة state hooks و useEffect وطرق تحميل البيانات
  // ثم تمرير البيانات للمكونات AttendanceTable و AttendanceForm
  return (
    <div>
      <AttendanceTable />
      {/* يمكن التحكم في فتح الفورم عبر state هنا */}
      {/* <AttendanceForm ...props /> */}
    </div>
  );
};

export default Attendance;
