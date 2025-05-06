import React, { useEffect, useState } from 'react';
import { getByPagination, create, edit, deleteById } from '@/utils/api/coreApi';
import { CityEditType, CityGetAllType} from '@/utils/api/coreTypes';
import CityTable from './CityTable';
import CityForm from './CityForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader as DialogHeaderComp, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';

const Cities: React.FC = () => {
  const API_ENDPOINT = "Cityes";
  const [cities, setCities] = useState<CityGetAllType[]>([]);
  const [editingCity, setEditingCity] = useState<CityEditType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchCities = async () => {
    const response = await getByPagination<{ data: CityGetAllType[] }>(API_ENDPOINT + "/pagination", { Page: 1, Limit: 100 });
    setCities(response.data);
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleAdd = () => {
    setEditingCity(null);
    setDialogOpen(true);
  };

  const handleEdit = (city: CityEditType) => {
    setEditingCity(city);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteById(API_ENDPOINT, id);
      toast({ title: 'تم الحذف بنجاح' });
      fetchCities();
    } catch {
      toast({ title: 'خطأ أثناء الحذف', variant: 'destructive' });
    }
  };

  const handleSubmit = async (data: Omit<CityGetAllType, 'id'>) => {
    try {
      if (editingCity) {
        await edit(API_ENDPOINT, editingCity.id, data);
        toast({ title: 'تم تعديل المدينة بنجاح' });
      } else {
        await create(API_ENDPOINT, data);
        toast({ title: 'تمت إضافة المدينة بنجاح' });
      }
      setDialogOpen(false);
      fetchCities();
    } catch {
      toast({ title: 'خطأ أثناء الحفظ', variant: 'destructive' });
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">إدارة المدن</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto" onClick={handleAdd}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة مدينة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeaderComp>
              <DialogTitle>{editingCity ? 'تعديل مدينة' : 'إضافة مدينة جديدة'}</DialogTitle>
              <DialogDescription>
                {editingCity ? 'عدل بيانات المدينة ثم اضغط حفظ' : 'أدخل اسم المدينة ثم اضغط حفظ'}
              </DialogDescription>
            </DialogHeaderComp>
            <CityForm city={editingCity || undefined} onSubmit={handleSubmit} onCancel={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>قائمة المدن</CardTitle>
          <CardDescription>إدارة جميع المدن المتاحة</CardDescription>
        </CardHeader>
        <CardContent>
          <CityTable cities={cities} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Cities;
