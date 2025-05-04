import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// بيانات تجريبية: القاعات والأوقات والمحاضرات
const rooms = [
  { id: "r1", name: "قاعة 1" },
  { id: "r2", name: "قاعة 2" },
  { id: "r3", name: "قاعة 3" },
];
const times = [
  "08:00", "10:00", "12:00", "14:00", "16:00"
];
const lectures = [
  { id: "l1", group: "مجموعة أ", roomId: "r1", time: "08:00" },
  { id: "l2", group: "مجموعة ب", roomId: "r2", time: "10:00" },
  { id: "l3", group: "مجموعة ج", roomId: "r3", time: "12:00" },
];

// بيانات تجريبية للطلاب
const students = [
  { id: 1, name: "أحمد علي" },
  { id: 2, name: "سارة محمد" },
  { id: 3, name: "محمود حسن" },
];

export default function AttendanceTable() {
  const [selectedLecture, setSelectedLecture] = useState<any>(null);
  const [attendance, setAttendance] = useState<{ [id: number]: boolean }>({});
  const [loading, setLoading] = useState(false);

  // التقاط صورة (placeholder)
  const [image, setImage] = useState<string | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // إرسال الغياب للـ API
  const handleSaveAttendance = async () => {
    if (!selectedLecture) return;
    setLoading(true);
    try {
      await fetch("/api/Sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: selectedLecture.groupId || 1, // رقم المجموعة
          instructorId: 1, // رقم المحاضر (تجريبي)
          roomId: selectedLecture.roomId || 1,
          startTime: new Date().toISOString(),
          sessionStudents: students.map((s) => ({
            studentId: s.id,
            isPresent: !!attendance[s.id],
          })),
          notes: "",
        }),
      });
      setSelectedLecture(null);
      setAttendance({});
      setImage(null);
      // يمكن إضافة Toast للنجاح
    } catch (e) {
      // يمكن إضافة Toast للخطأ
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>جدول الغيابات اليومي</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الوقت</TableHead>
                {rooms.map((room) => (
                  <TableHead key={room.id}>{room.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {times.map((time) => (
                <TableRow key={time}>
                  <TableCell>{time}</TableCell>
                  {rooms.map((room) => {
                    const lecture = lectures.find(
                      (l) => l.roomId === room.id && l.time === time
                    );
                    return (
                      <TableCell key={room.id}>
                        {lecture ? (
                          <Button variant="link" onClick={() => setSelectedLecture(lecture)}>
                            {lecture.group}
                          </Button>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={!!selectedLecture} onOpenChange={() => setSelectedLecture(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تسجيل غياب المجموعة: {selectedLecture?.group}</DialogTitle>
          </DialogHeader>
          <div className="mb-2">التاريخ: {new Date().toLocaleDateString()}</div>
          <div className="mb-2">الوقت: {selectedLecture?.time}</div>
          <div className="mb-2">القاعة: {selectedLecture?.roomId}</div>
          <div className="mb-4">
            <b>الطلاب:</b>
            <div className="flex flex-col gap-2 mt-2">
              {students.map((s) => (
                <label key={s.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!attendance[s.id]}
                    onChange={() => setAttendance((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
                  />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <b>التقاط صورة للقاعة:</b>
            <Input type="file" accept="image/*" capture="environment" onChange={handleImageChange} />
            {image && <img src={image} alt="صورة القاعة" className="mt-2 max-h-40" />}
          </div>
          <DialogFooter>
            <Button onClick={handleSaveAttendance} disabled={loading}>{loading ? "...جاري الحفظ" : "حفظ الغياب"}</Button>
            <Button variant="secondary" onClick={() => setSelectedLecture(null)}>إلغاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
