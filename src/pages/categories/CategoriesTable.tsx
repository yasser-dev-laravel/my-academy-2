import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";

import type { Category, CategoriesTableProps } from "@/utils/api/types";

const CategoriesTable = ({ categories, onDelete, onEdit }: CategoriesTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>اسم التصنيف</TableHead>
        <TableHead>وصف التصنيف</TableHead>
        <TableHead className="text-right">الإجراءات</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {categories.map((cat) => (
        <TableRow key={cat.id}>
          <TableCell>{cat.name}</TableCell>
          <TableCell>{cat.description}</TableCell>
          <TableCell className="text-right flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(cat)}
              title="تعديل التصنيف"
            >
              <Edit className="h-4 w-4 text-primary" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(cat.id)}
              title="حذف التصنيف"
            >
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default CategoriesTable;
