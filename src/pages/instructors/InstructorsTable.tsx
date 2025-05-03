import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash, Edit } from 'lucide-react';

interface Instructor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  nationalId: string;
  cityName: string;
  salary: number;
  salaryTypeName: string;
  coursesNames: string[];
}

interface InstructorsTableProps {
  instructors: Instructor[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const InstructorsTable: React.FC<InstructorsTableProps> = ({ instructors, onEdit, onDelete }) => {
  return (
    <table className="table-auto w-full border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2">الاسم</th>
          <th className="border px-4 py-2">البريد الإلكتروني</th>
          <th className="border px-4 py-2">رقم الهاتف</th>
          <th className="border px-4 py-2">العنوان</th>
          <th className="border px-4 py-2">الرقم القومي</th>
          <th className="border px-4 py-2">المدينة</th>
          <th className="border px-4 py-2">الراتب</th>
          <th className="border px-4 py-2">نوع الراتب</th>
          <th className="border px-4 py-2">الدورات</th>
          <th className="border px-4 py-2">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        {instructors.map((instructor) => (
          <tr key={instructor.id} className="hover:bg-gray-50">
            <td className="border px-4 py-2">{instructor.name}</td>
            <td className="border px-4 py-2">{instructor.email}</td>
            <td className="border px-4 py-2">{instructor.phone}</td>
            <td className="border px-4 py-2">{instructor.address}</td>
            <td className="border px-4 py-2">{instructor.nationalId}</td>
            <td className="border px-4 py-2">{instructor.cityName}</td>
            <td className="border px-4 py-2">{instructor.salary}</td>
            <td className="border px-4 py-2">{instructor.salaryTypeName}</td>
            <td className="border px-4 py-2">{instructor.coursesNames.join(', ')}</td>
            <td className="border px-4 py-2">
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(instructor.id)}>
                  <Edit className="h-4 w-4 text-primary" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(instructor.id)}>
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InstructorsTable;