import React, { useEffect, useState } from "react";
import { getByPagination } from "@/utils/api/coreApi";
import type { Payment, Group } from "@/utils/api/types";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FinancialReport() {
  const [receipts, setReceipts] = useState<Payment[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [filters, setFilters] = useState({ studentId: "", groupId: "", fromDate: "", toDate: "" });
  const [totals, setTotals] = useState({ total: 0, count: 0 });

  useEffect(() => {
    getStudentsPaginated({ Page: 1, Limit: 1000 }).then(res => setStudents(res.data || []));
    getGroups().then(setGroups);
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    const data = await filterReceipts(filters);
    setReceipts(data);
    setTotals({
      total: data.reduce((sum, r) => sum + (r.amount || 0), 0),
      count: data.length
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>تقرير مالي شامل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <select name="studentId" value={filters.studentId} onChange={handleFilterChange} className="border rounded px-2 py-1">
              <option value="">كل الطلاب</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select name="groupId" value={filters.groupId} onChange={handleFilterChange} className="border rounded px-2 py-1">
              <option value="">كل المجموعات</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <Input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} placeholder="من تاريخ" />
            <Input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} placeholder="إلى تاريخ" />
            <Button onClick={fetchReceipts}>بحث</Button>
          </div>
          <div className="mb-4 flex gap-8">
            <div>إجمالي المدفوعات: <span className="font-bold text-green-700">{totals.total} ج.م</span></div>
            <div>عدد الإيصالات: <span className="font-bold">{totals.count}</span></div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الإيصال</TableHead>
                <TableHead>اسم الطالب</TableHead>
                <TableHead>المجموعة</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>ملاحظات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.length > 0 ? receipts.map(r => {
                const student = students.find(s => s.id === r.studentId);
                const group = groups.find(g => g.id === r.groupId);
                return (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{student ? student.name : r.studentId}</TableCell>
                    <TableCell>{group ? group.name : r.groupId}</TableCell>
                    <TableCell>{r.amount}</TableCell>
                    <TableCell>{r.date?.split("T")[0] || r.date}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell>{r.note || ""}</TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">لا توجد بيانات</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
