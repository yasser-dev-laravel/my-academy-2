import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// Update Employee interface to match UserDto
import type { Employee, EmployeesTableProps } from "@/utils/api/types";

const EmployeesTable = ({ employees, onDelete, onEdit }: EmployeesTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="text-right px-4">الاسم</TableHead> 
        <TableHead className="text-right px-4">البريد الإلكتروني</TableHead>
        <TableHead className="text-right px-4">الرقم القومي</TableHead>
        <TableHead className="text-right px-4">المدينة</TableHead>
        <TableHead className="text-right px-4">المرتب</TableHead>
        <TableHead className="text-right px-4">نوع الراتب</TableHead>
        <TableHead className="text-right px-4">المسمى الوظيفي</TableHead>
        <TableHead className="text-right px-4">الصلاحيات</TableHead>
        <TableHead className="text-right px-4">الإجراءات</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
        
        {employees.map((emp) => (
      
            <TableRow>
              <TableCell className="text-right">{emp.name}</TableCell>
              <TableCell className="text-right">{emp.email}</TableCell>
              <TableCell className="text-right">{emp.nationalId}</TableCell>
              <TableCell className="text-right">{emp.salary}</TableCell>
              <TableCell className="text-right">{emp.salary}</TableCell>
              <TableCell className="text-right">{emp.salaryTypeName}</TableCell>
              <TableCell className="text-right">{emp.jobTitle}</TableCell>
              <TableCell className="text-right">{emp.roles?.join(", ") || "لا توجد أدوار"}</TableCell> {/* Display roles */}
              <TableCell className="text-right flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(emp)}
                  title="تعديل المستخدم"
                >
                  <Edit className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(emp.id)}
                  title="حذف المستخدم"
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
        
        
        ))}
      
      
    </TableBody>
  </Table>
);

export default EmployeesTable;
