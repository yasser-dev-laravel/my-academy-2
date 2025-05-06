import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";

// import type { Room, RoomsTableProps } from "@/utils/api/types";
import type { RoomGetAllType } from "@/utils/api/coreTypes";

interface RoomsTableProps {
  rooms: RoomGetAllType[];
  onDelete: (id: number) => void;
  onEdit: (room: RoomGetAllType) => void;
}

const RoomsTable = ({ rooms, onDelete, onEdit }: RoomsTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>رقم القاعة</TableHead>
        <TableHead>الاسم</TableHead>
        <TableHead>النوع</TableHead>
        <TableHead>السعة</TableHead>
        <TableHead>الفرع</TableHead>
        <TableHead className="text-right">الإجراءات</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      
      {rooms.map((room) => (
        <TableRow key={room.id}>
          <TableCell>{room.id}</TableCell>
          <TableCell className="font-medium">{room.name}</TableCell>
          <TableCell>{room.type}</TableCell>
          <TableCell>{room.capacity}</TableCell>
          <TableCell>{room.branchName}</TableCell>
          <TableCell className="text-right flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(room)}
              title="تعديل القاعة"
            >
              <Edit className="h-4 w-4 text-primary" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(room.id)}
              title="حذف القاعة"
            >
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default RoomsTable;
