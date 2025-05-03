import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { getHelpTableCity, getHelpTableSalaryType } from '@/utils/api/helpTables';
import { getCoursesPaginated } from '@/utils/api/courses';

interface InstructorFormProps {
  values: {
    name: string;
    email: string;
    phone: string;
    address: string;
    nationalId: string;
    cityId: number;
    salary: number;
    salaryTypeId: number;
    coursesIds: number[];
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  onCancel: () => void;
}

const InstructorForm: React.FC<InstructorFormProps> = ({
  values,
  onChange,
  onSelectChange,
  onSubmit,
  submitLabel,
  onCancel,
}) => {
  const [cities, setCities] = useState([]);
  const [salaryTypes, setSalaryTypes] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [citiesRes, salaryTypesRes, coursesRes] = await Promise.all([
          getHelpTableCity(),
          getHelpTableSalaryType(),
          getCoursesPaginated({ Page: 1, Limit: 100 }),
        ]);
        setCities(citiesRes.data || []);
        setSalaryTypes(salaryTypesRes.data || []);
        setCourses(coursesRes.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch dropdown data', error);
      }
    };

    fetchDropdownData();
  }, []);

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
      <div>
        <label className="block text-sm font-medium mb-1">الاسم</label>
        <Input name="name" value={values.name} onChange={onChange} placeholder="أدخل الاسم" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
        <Input name="email" value={values.email} onChange={onChange} placeholder="أدخل البريد الإلكتروني" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
        <Input name="phone" value={values.phone} onChange={onChange} placeholder="أدخل رقم الهاتف" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">العنوان</label>
        <Textarea name="address" value={values.address} onChange={onChange} placeholder="أدخل العنوان" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">الرقم القومي</label>
        <Input name="nationalId" value={values.nationalId} onChange={onChange} placeholder="أدخل الرقم القومي" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">المدينة</label>
        <Select
          name="cityId"
          value={values.cityId}
          onChange={(e) => onSelectChange('cityId', Number(e.target.value))}
        >
          <option value="">اختر المدينة</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">الراتب</label>
        <Input
          name="salary"
          type="number"
          value={values.salary}
          onChange={onChange}
          placeholder="أدخل الراتب"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">نوع الراتب</label>
        <Select
          name="salaryTypeId"
          value={values.salaryTypeId}
          onChange={(e) => onSelectChange('salaryTypeId', Number(e.target.value))}
        >
          <option value="">اختر نوع الراتب</option>
          {salaryTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">الدورات</label>
        <Select
          name="coursesIds"
          multiple
          value={values.coursesIds}
          onChange={(e) =>
            onSelectChange(
              'coursesIds',
              Array.from(e.target.selectedOptions, (option) => Number(option.value))
            )
          }
        >
          <option value="">اختر الدورات</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
};

export default InstructorForm;