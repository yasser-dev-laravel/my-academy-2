import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GroupForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    courseId: '',
    instructorId: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>اسم المجموعة</label>
        <Input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="اسم المجموعة"
        />
      </div>
      <div>
        <label>الكورس</label>
        <Select
          value={formData.courseId}
          onValueChange={(value) => handleChange('courseId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر الكورس" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Course A</SelectItem>
            <SelectItem value="2">Course B</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label>المحاضر</label>
        <Select
          value={formData.instructorId}
          onValueChange={(value) => handleChange('instructorId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر المحاضر" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Instructor X</SelectItem>
            <SelectItem value="2">Instructor Y</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">حفظ</Button>
    </form>
  );
};

export default GroupForm;