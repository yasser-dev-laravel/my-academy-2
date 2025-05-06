import React, { useEffect, useState } from 'react';
import { getByPagination, create, edit, deleteById } from '@/utils/api/coreApi';
import type { AreaGetByIdType, AreaCreateType, CityGetByIdType,CityGetAllType} from '@/utils/api/coreTypes';
import AreaTable from './AreaTable';
import AreaForm from './AreaForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader as DialogHeaderComp, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';

const Areas: React.FC = () => {
  const [areas, setAreas] = useState<AreaGetByIdType[]>([]);
  const [cities, setCities] = useState<CityGetAllType[]>([]);
  const [editingArea, setEditingArea] = useState<AreaGetByIdType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchAreas = async () => {
    const areas = await getByPagination<{ data: AreaGetByIdType[] }>("Areaes/pagination", { Page: 1, Limit: 100 });
    setAreas(areas.data);
  };
  const fetchCities = async () => { 
    const cities = await getByPagination<{ data: CityGetByIdType[] }>("Cityes/pagination", { Page: 1, Limit: 100 });
    setCities(cities.data);
  };

  useEffect(() => {
    fetchAreas();
    fetchCities();
  }, []);

  const handleAdd = () => {
    setEditingArea(null);
    setDialogOpen(true);
  };

  const handleEdit = (area: AreaGetByIdType) => {
    setEditingArea(area);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteById("Areaes", id);
      toast({ title: 'تم الحذف بنجاح' });
      fetchAreas();
    } catch {
      toast({ title: 'خطأ أثناء الحذف', variant: 'destructive' });
    }
  };

  const handleSubmit = async (data: AreaCreateType) => {
    try {
      if (editingArea) {
        await edit("Areaes", editingArea.id, data);
        toast({ title: 'تم تعديل المنطقة بنجاح' });
      } else {
        await create("Areaes", data);
        toast({ title: 'تمت إضافة المنطقة بنجاح' });
      }
      setDialogOpen(false);
      fetchAreas();
    } catch {
      toast({ title: 'خطأ أثناء الحفظ', variant: 'destructive' });
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">إدارة المناطق</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto" onClick={handleAdd}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة منطقة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeaderComp>
              <DialogTitle>{editingArea ? 'تعديل منطقة' : 'إضافة منطقة جديدة'}</DialogTitle>
              <DialogDescription>
                {editingArea ? 'عدل بيانات المنطقة ثم اضغط حفظ' : 'أدخل اسم المنطقة ثم اضغط حفظ'}
              </DialogDescription>
            </DialogHeaderComp>
            <AreaForm area={editingArea || undefined} cities={cities} onSubmit={handleSubmit} onCancel={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>قائمة المناطق</CardTitle>
          <CardDescription>إدارة جميع المناطق المتاحة</CardDescription>
        </CardHeader>
        <CardContent>
          <AreaTable areas={areas} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Areas;
