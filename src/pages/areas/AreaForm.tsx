import React, { useState, useEffect } from 'react';
import { Area, City } from '@/utils/api/types';

interface AreaFormProps {
  area?: Area;
  cities: City[];
  onSubmit: (data: Omit<Area, 'id' | 'cityName'> & { cityId: number } | Area) => void;
  onCancel: () => void;
}

const AreaForm: React.FC<AreaFormProps> = ({ area, cities, onSubmit, onCancel }) => {
  const [name, setName] = useState(area?.name || '');
  const [cityId, setCityId] = useState(area?.cityId || (cities[0]?.id ?? ''));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (area && area.id !== undefined) {
      onSubmit({ id: area.id, name, cityId: Number(cityId) });
    } else {
      onSubmit({ name, cityId: Number(cityId) });
    }
  };

  useEffect(() => {
    setName(area?.name || '');
    setCityId(area?.cityId || (cities[0]?.id ?? ''));
  }, [area, cities]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>اسم المنطقة</label>
        <input value={name} onChange={e => setName(e.target.value)} required className="input" />
      </div>
      <div>
        <label>المدينة</label>
        <select value={cityId} onChange={e => setCityId(e.target.value)} required className="input">
          {cities.map(city => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit">حفظ</button>
        <button type="button" onClick={onCancel}>إلغاء</button>
      </div>
    </form>
  );
};

export default AreaForm;
