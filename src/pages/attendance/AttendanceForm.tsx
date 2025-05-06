import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Group, GroupStudent, AttendanceFormProps } from "@/utils/api/types";

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  open,
  onOpenChange,
  group,
  students,
  attendance,
  setAttendance,
  date,
  setDate,
  sessionNumber,
  setSessionNumber,
  sessionImage,
  handleImageUpload,
  handleToggleAll,
  handleSaveAttendance,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>تسجيل الحضور</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>تاريخ المحاضرة</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <Label>رقم المحاضرة</Label>
            <Input type="number" value={sessionNumber} onChange={e => setSessionNumber(parseInt(e.target.value))} />
          </div>
        </div>
        <div>
          <Label>صورة المحاضرة</Label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          {sessionImage && <img src={sessionImage} alt="صورة المحاضرة" className="mt-2 max-h-40" />}
        </div>
        <div>
          <Label>حضور الطلاب</Label>
          <div className="flex gap-2 mb-2">
            <Button variant="outline" size="sm" onClick={() => handleToggleAll(true)}>تحديد الكل حاضر</Button>
            <Button variant="outline" size="sm" onClick={() => handleToggleAll(false)}>تحديد الكل غائب</Button>
          </div>
          <div className="space-y-2">
            {group && students
              .filter(s => group.studentIds.includes(s.id))
              .map(student => (
                <div key={student.id} className="flex items-center gap-2">
                  <Checkbox
                    id={student.id}
                    checked={attendance[student.id] || false}
                    onCheckedChange={checked => setAttendance(prev => ({ ...prev, [student.id]: checked as boolean }))}
                  />
                  <Label htmlFor={student.id}>{student.name}</Label>
                </div>
              ))}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleSaveAttendance}>حفظ الحضور</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default AttendanceForm;
