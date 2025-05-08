import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CourseCreateType, LevelGetByIdType } from "@/utils/api/coreTypes";

interface CoursesFormProps {
  values: CourseCreateType & { categoryName?: string; applicationId?: string };
  categories: { id: number; name: string }[];
  levels: LevelGetByIdType[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string | number | number[] | LevelGetByIdType[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  onCancel?: () => void;
}

const generateCourseCode = () => {
  // كود الكورس = c- + رقم عشوائي من 5 أرقام
  return `c-${Math.floor(10000 + Math.random() * 90000)}`;
};

const generateLevelCode = (courseCode: string, idx: number) => {
  // كود المستوى = كود الكورس-L-رقم المستوى
  return `${courseCode}-L-${idx + 1}`;
};

const CoursesForm: React.FC<CoursesFormProps> = ({
  values,
  categories,
  levels,
  onChange,
  onSelectChange,
  onSubmit,
  submitLabel = "Save",
  onCancel,
}) => {
  // عند فتح النموذج: إذا لم يوجد applicationId، خزنه مرة واحدة فقط مع أول render
  React.useEffect(() => {
    if (!values.applicationId) {
      const code = generateCourseCode();
      onSelectChange("applicationId", code);
      // تحديث القيم مباشرة في values إذا لم يكن موجودًا
      values.applicationId = code;
      setTimeout(() => {
        if (values.levels && values.levels.length > 0) {
          const updatedLevels = values.levels.map((lvl, idx) => ({
            ...lvl,
            applicationId: `${code}-L-${idx + 1}`
          }));
          onSelectChange("levels", updatedLevels);
        }
      }, 0);
    }
    // eslint-disable-next-line
  }, []);

  console.log("[CoursesForm] Values passed to the form:", values); // Log the values passed to the form

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm p-1 w-full max-w-[90vw] md:max-w-[520px] mx-auto space-y-1 text-[0.8rem]" style={{ maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden' }}>
      <h2 className="text-xl font-bold text-center mb-1 text-blue-700">{values.id ? 'تعديل الكورس' : 'إضافة كورس جديد'}</h2>
      <div className="grid gap-1">
        <div className="space-y-0.5">
          <Label htmlFor="name" className="font-semibold text-[0.85em]">اسم الكورس *</Label>
          <Input id="name" name="name" value={values.name} onChange={onChange} required className="h-8 text-[0.85em]" />
        </div>
        <div className="space-y-0.5">
          <Label htmlFor="description" className="font-semibold text-[0.85em]">الوصف</Label>
          <Input id="description" name="description" value={values.description} onChange={onChange} className="h-8 text-[0.85em]" />
        </div>
        <div className="space-y-0.5">
          <Label htmlFor="categoryId" className="font-semibold text-[0.85em]">التصنيف</Label>
          <Select
            name="categoryId"
            value={values.categoryId?.toString() || ""}
            onValueChange={(v) => onSelectChange("categoryId", Number(v))}
          >
            <SelectTrigger className="h-8 text-[0.85em]">
              <SelectValue placeholder="اختر التصنيف" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()} className="text-[0.85em]">
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-0.5">
          <Label htmlFor="applicationId" className="font-semibold text-[0.85em]">كود الكورس</Label>
          <Input id="applicationId" name="applicationId" value={values.applicationId || ""} disabled readOnly className="h-8 text-[0.85em] bg-gray-100" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="levels" className="font-semibold text-blue-800 text-[0.85em]">المستويات</Label>
          <div className="overflow-x-auto w-full">
            <div className="min-w-[440px] w-full bg-white border border-gray-300 rounded-md">
              <div className="flex flex-row gap-1 mb-1 px-1 py-1 items-center text-[0.8em] font-extrabold text-blue-900 border-b bg-blue-100">
                <div className="w-24 text-center">الاسم</div>
                <div className="w-24 text-center">الوصف</div>
                <div className="w-16 text-center">السعر</div>
                <div className="w-16 text-center">عدد المحاضرات</div>
                <div className="w-20 text-center">مدة المحاضرة</div>
                <div className="w-24 text-center">كود المستوى</div>
                <div className="w-6"></div>
              </div>
              <div>
                {(values.levels || []).map((level: any, idx: number, arr: any[]) => (
                  <div key={idx} className="flex flex-row gap-1 items-center mb-1 px-1">
                    <Input
                      name={`levels[${idx}].name`}
                      value={level?.name || ""}
                      onChange={(e) => {
                        const updatedLevels = values.levels.map((lvl, i) =>
                          i === idx ? { ...lvl, name: e.target.value } : lvl
                        );
                        onChange({
                          target: {
                            name: "levels",
                            value: updatedLevels,
                          },
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      className="w-24 text-center h-7 border-gray-400 text-[0.8em]"
                      placeholder="اسم المستوى"
                    />
                    <Input
                      name={`levels[${idx}].description`}
                      type="text"
                      value={level.description || ""}
                      onChange={(e) => {
                        const updatedLevels = values.levels.map((lvl, i) =>
                          i === idx ? { ...lvl, description: e.target.value } : lvl
                        );
                        onChange({
                          target: {
                            name: "levels",
                            value: updatedLevels,
                          },
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      className="w-24 text-center h-7 border-gray-400 text-[0.8em]"
                      placeholder="وصف المستوى"
                    />
                    <Input
                      name={`levels[${idx}].price`}
                      type="number"
                      value={level.price !== undefined ? level.price : 0}
                      onChange={(e) => {
                        const updatedLevels = values.levels.map((lvl, i) =>
                          i === idx ? { ...lvl, price: Number(e.target.value) } : lvl
                        );
                        onChange({
                          target: {
                            name: "levels",
                            value: updatedLevels,
                          },
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      className="w-16 text-center h-7 border-gray-400 text-[0.8em]"
                      placeholder="السعر"
                    />
                    <Input
                      name={`levels[${idx}].sessionsCount`}
                      type="number"
                      value={level.sessionsCount || ""}
                      onChange={(e) => {
                        const updatedLevels = values.levels.map((lvl, i) =>
                          i === idx ? { ...lvl, sessionsCount: Number(e.target.value) } : lvl
                        );
                        onChange({
                          target: {
                            name: "levels",
                            value: updatedLevels,
                          },
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      className="w-16 text-center h-7 border-gray-400 text-[0.8em]"
                      placeholder="عدد المحاضرات"
                    />
                    <Input
                      name={`levels[${idx}].sessionsDiortion`}
                      type="number"
                      value={level.sessionsDiortion || ""}
                      onChange={(e) => {
                        const updatedLevels = values.levels.map((lvl, i) =>
                          i === idx ? { ...lvl, sessionsDiortion: Number(e.target.value) } : lvl
                        );
                        onChange({
                          target: {
                            name: "levels",
                            value: updatedLevels,
                          },
                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }}
                      className="w-20 text-center h-7 border-gray-400 text-[0.8em]"
                      placeholder="مدة المحاضرة بالدقائق"
                    />
                    <Input
                      name={`levels[${idx}].applicationId`}
                      value={level.applicationId || generateLevelCode(values.applicationId, idx)}
                      disabled
                      readOnly
                      className="w-24 text-center h-7 bg-gray-100 border-gray-400 font-bold text-blue-900 text-[0.8em]"
                      placeholder="كود المستوى"
                    />
                    {idx === arr.length - 1 && arr.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="ml-1 w-6 h-6 flex items-center justify-center"
                        title="حذف المستوى الأخير"
                        onClick={() => {
                          const updatedLevels = arr.slice(0, -1);
                          onSelectChange("levels", updatedLevels);
                        }}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end p-1">
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs px-2 py-1"
                  onClick={() => {
                    const code = values.applicationId || generateCourseCode();
                    const lastLevel = values.levels[values.levels.length - 1] || {
                      name: "المستوي 1",
                      description: "",
                      sessionsDiortion: 0,
                      price: 0,
                      applicationId: "",
                      sessionsCount: 0,
                    };
                    const newLevel: LevelGetByIdType = {
                      name: `المستوي ${values.levels.length}`,
                      description: "",
                      sessionsDiortion: 0,
                      price: lastLevel.price,
                      applicationId: `${code}-L-${values.levels.length}`,
                      sessionsCount: lastLevel.sessionsCount,
                    };
                    // خزّن applicationId لكل المستويات بعد الإضافة فقط
                    const updatedLevels = [...(values.levels || []), newLevel].map((lvl, idx) => ({
                      ...lvl,
                      applicationId: `${code}-L-${idx + 1}`
                    }));
                    onSelectChange("levels", updatedLevels);
                  }}
                >
                  إضافة مستوى جديد
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-1 mt-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="h-8 px-4 text-[0.85em]">
            إلغاء
          </Button>
        )}
        <Button type="submit" className="h-8 px-6 text-[0.85em] font-bold">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default CoursesForm;
