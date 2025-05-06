import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";

// مكون جدول المجموعات
import type { Group, GroupsTableProps } from "@/utils/api/types";

const GroupsTable: React.FC<GroupsTableProps> = ({ groups, courses, levels, branches, rooms, instructors, onEdit, onDelete }) => (
  <Table className="table-striped">
    <TableHeader>
      <TableRow>
        <TableHead>اسم المجموعة</TableHead>
        <TableHead>الكورس</TableHead>
        <TableHead>المستوى</TableHead>
        <TableHead>الفرع</TableHead>
        <TableHead>القاعة</TableHead>
        <TableHead>المدرب</TableHead>
        <TableHead>الأيام</TableHead>
        <TableHead>تاريخ البداية</TableHead>
        <TableHead>تاريخ النهاية</TableHead>
        <TableHead>وقت البداية</TableHead>
        <TableHead>وقت النهاية</TableHead>
        <TableHead>عدد المحاضرات</TableHead>
        <TableHead>عدد الطلاب</TableHead>
        <TableHead>الحالة</TableHead>
        <TableHead>الإجراءات</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {groups?.length > 0 ? (
        groups.map((group) => (
          <TableRow key={group.id}>
            <TableCell>{group.name && group.name !== "string" ? group.name : "-"}</TableCell>
            <TableCell>{group.courseName && group.courseName !== "string" ? group.courseName : "-"}</TableCell>
            <TableCell>{group.levelName && group.levelName !== "string" ? group.levelName : "-"}</TableCell>
            <TableCell>{group.branchName && group.branchName !== "string" ? group.branchName : "-"}</TableCell>
            <TableCell>{group.roomName && group.roomName !== "string" ? group.roomName : "-"}</TableCell>
            <TableCell>{group.instructorName && group.instructorName !== "string" ? group.instructorName : "-"}</TableCell>
            <TableCell>{
              group.daysAsText ? group.daysAsText :
              (Array.isArray(group.weeklyDays) && group.weeklyDays.length > 0
                ? group.weeklyDays.join("، ")
                : group.days || "-")
            }</TableCell>
            <TableCell>{group.startDate || "-"}</TableCell>
            <TableCell>{group.endDate || "-"}</TableCell>
            <TableCell>{group.startTime || "-"}</TableCell>
            <TableCell>{group.endTime || "-"}</TableCell>
            <TableCell>{group.lectureCount ?? "-"}</TableCell>
            <TableCell>{Array.isArray(group.studentIds) ? group.studentIds.length : (Array.isArray(group.students) ? group.students.length : "-")}</TableCell>
            <TableCell>{group.statusName && group.statusName !== "string" ? group.statusName : (group.status || "-")}</TableCell>
            <TableCell className="text-right flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(group)}
                title="تعديل المجموعة"
              >
                <Edit className="h-4 w-4 text-primary" />
              </Button>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(group.id)}
                  title="حذف المجموعة"
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={15} className="text-center text-muted-foreground">
            لا توجد بيانات لعرضها
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
);

export default GroupsTable;