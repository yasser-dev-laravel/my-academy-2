import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getByPagination } from "@/utils/api/coreApi";
import { Branch } from "@/utils/mockData";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  useEffect(() => {
    async function fetchBranches() {
      try {
        const res = await getBranchesPaginated({ Page: 1, Limit: 100 });
        // Map BranchDto to Branch type
        const mappedBranches = (res.data || []).map((b: any) => ({
          id: String(b.id),
          name: b.name || '',
          code: b.code || '',
          governorate: b.areaName || '',
        }));
        setBranches(mappedBranches);
      } catch (error) {
        setBranches([]);
      }
      const def = localStorage.getItem("latin_academy_default_branch");
      setSelectedBranch(def || "");
    }
    fetchBranches();
  }, []);

  const handleSave = () => {
    localStorage.setItem("latin_academy_default_branch", selectedBranch);
    alert("تم حفظ الفرع الافتراضي!");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>الإعدادات العامة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block mb-2 font-bold">الفرع الافتراضي للبرنامج:</label>
            <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} className="border rounded px-2 py-1 w-full">
              <option value="">اختر الفرع</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <Button onClick={handleSave} disabled={!selectedBranch}>حفظ</Button>
        </CardContent>
      </Card>
    </div>
  );
}
