import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import type { AreaGetByIdType } from '@/utils/api/coreTypes';

interface AreaTableProps {
  areas: AreaGetByIdType[];
  onEdit: (area: AreaGetByIdType) => void;
  onDelete: (id: number) => void;
}

const AreaTable: React.FC<AreaTableProps> = ({ areas, onEdit, onDelete }) => (
  <table className="table-auto w-full border">
    <thead>
      <tr>
        <th>الرقم</th>
        <th>الاسم</th>
        <th>المدينة</th>
        <th>الإجراءات</th>
      </tr>
    </thead>
    <tbody>
      {areas.map(area => (
        <tr key={area.id}>
          <td>{area.id}</td>
          <td>{area.name}</td>
          <td>{area.cityName}</td>
          <td className="flex gap-2 justify-end">
            <Button variant="ghost" size="icon" onClick={() => onEdit(area)} title="تعديل المنطقة">
              <Edit className="h-4 w-4 text-primary" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(area.id)} title="حذف المنطقة">
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default AreaTable;
