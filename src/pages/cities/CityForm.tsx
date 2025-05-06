import React, { useState, useEffect } from 'react';
import { City } from '@/utils/api/types';

interface CityFormProps {
  city?: City;
  onSubmit: (data: Omit<City, 'id'> | City) => void;
  onCancel: () => void;
}

const CityForm: React.FC<CityFormProps> = ({ city, onSubmit, onCancel }) => {
  const [name, setName] = useState(city?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city && city.id !== undefined) {
      onSubmit({ id: city.id, name });
    } else {
      onSubmit({ name });
    }
  };

  useEffect(() => {
    setName(city?.name || '');
  }, [city]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>اسم المدينة</label>
        <input value={name} onChange={e => setName(e.target.value)} required className="input" />
      </div>
      <div className="flex gap-2">
        <button type="submit">حفظ</button>
        <button type="button" onClick={onCancel}>إلغاء</button>
      </div>
    </form>
  );
};

export default CityForm;
