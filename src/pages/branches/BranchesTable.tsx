import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Trash } from "lucide-react";

// تم التحديث لاستخدام الأنواع الموحدة من coreTypes
import type { BrancheGetByIdType } from "@/utils/api/coreTypes";

interface BranchesTableProps {
  branches: BrancheGetByIdType[];
  onEdit: (branch: BrancheGetByIdType) => void;
  onDelete: (id: number) => void;
}


const BranchesTable = ({ branches, onEdit, onDelete }: BranchesTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>اسم الفرع</TableHead>
        <TableHead>العنوان</TableHead>
        <TableHead>المنطقة</TableHead>
        <TableHead className="text-right">الإجراءات</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {branches.map((branch) => (
        <TableRow key={branch.id}>
          <TableCell>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-primary" />
              <span>{branch.name}</span>
            </div>
          </TableCell>
          <TableCell>
            <span>{branch.address || "-"}</span>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{branch.areaName || '-'}</span>
            </div>
          </TableCell>
          <TableCell className="text-right flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(branch)}
              title="تعديل الفرع"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z"/></svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(branch.id)}
            >
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default BranchesTable;
