import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import type { CityGetAllType } from '@/utils/api/coreTypes';

interface CityTableProps {
  cities: CityGetAllType[];
  onEdit: (city: CityGetAllType) => void;
  onDelete: (id: number) => void;
}

const CityTable: React.FC<CityTableProps> = ({ cities, onEdit, onDelete }) => (
  <table className="table-auto w-full border">
    <thead>
      <tr>
        <th>الرقم</th>
        <th>الاسم</th>
        <th>الإجراءات</th>
      </tr>
    </thead>
    <tbody>
      {cities.map(city => (
        <tr key={city.id}>
          <td>{city.id}</td>
          <td>{city.name}</td>
          <td className="flex gap-2 justify-end">
            <Button variant="ghost" size="icon" onClick={() => onEdit(city)} title="تعديل المدينة">
              <Edit className="h-4 w-4 text-primary" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(city.id)} title="حذف المدينة">
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default CityTable;
