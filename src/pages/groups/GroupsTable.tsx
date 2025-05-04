import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const GroupsTable = ({ groups }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>اسم المجموعة</TableHead>
          <TableHead>الكورس</TableHead>
          <TableHead>المحاضر</TableHead>
          <TableHead>إجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map((group) => (
          <TableRow key={group.id}>
            <TableCell>{group.name}</TableCell>
            <TableCell>{group.course}</TableCell>
            <TableCell>{group.instructor}</TableCell>
            <TableCell>
              <Button variant="ghost">تعديل</Button>
              <Button variant="destructive">حذف</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GroupsTable;