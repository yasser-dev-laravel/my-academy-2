import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// نموذج بيانات افتراضي للخزائن
interface Cashbox {
  id: string;
  name: string;
  type: "center" | "branch" | "user" | "admin";
  balance: number;
}

// نموذج بيانات الحركة المالية
interface CashTransaction {
  id: string;
  cashboxId: string;
  type: "deposit" | "withdraw" | "transfer";
  amount: number;
  date: string;
  user: string;
  note?: string;
  toCashboxId?: string; // للتحويلات
}

// بيانات افتراضية
const defaultCashboxes: Cashbox[] = [
  { id: "center", name: "خزينة المركز الرئيسي", type: "center", balance: 10000 },
  { id: "branch1", name: "خزينة فرع 1", type: "branch", balance: 5000 },
  { id: "branch2", name: "خزينة فرع 2", type: "branch", balance: 3000 },
  { id: "user1", name: "محفظة الموظف أحمد", type: "user", balance: 1200 },
  { id: "admin", name: "خزينة الأدمن الرئيسي", type: "admin", balance: 20000 },
];

const defaultTransactions: CashTransaction[] = [
  { id: "t1", cashboxId: "center", type: "deposit", amount: 10000, date: "2025-05-01", user: "admin", note: "إيداع رأس مال" },
  { id: "t2", cashboxId: "branch1", type: "deposit", amount: 5000, date: "2025-05-02", user: "manager1", note: "تحويل من المركز" },
  { id: "t3", cashboxId: "user1", type: "deposit", amount: 1200, date: "2025-05-03", user: "manager1", note: "تسليم للموظف" },
];

export default function CashboxesPage() {
  const [cashboxes, setCashboxes] = useState<Cashbox[]>([]);
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [selectedCashbox, setSelectedCashbox] = useState<string>("");
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState("");
  const [actionType, setActionType] = useState<"deposit"|"withdraw"|"transfer">("deposit");
  const [toCashbox, setToCashbox] = useState<string>("");

  const { user } = useAuth();

  useEffect(() => {
    // تحميل بيانات افتراضية عند أول مرة
    setCashboxes(defaultCashboxes);
    setTransactions(defaultTransactions);
  }, []);

  // --- الصلاحيات ---
  // مبدئياً: نحدد role وbranchId من user (افتراضياً حتى دعم backend)
  // يمكنك تعديل القيم الافتراضية هنا حسب تجربة المستخدم
  // لاحقاً: اجلب من user.role و user.branchId
  // مثال: user?.roleIds?.includes(1) ? 'super_admin' : ...
  const role = (user && (user as any).role) || "super_admin";
  const branchId = (user && (user as any).branchId) ? (user as any).branchId.toString() : "branch1";
  const userId = user?.id ? user.id.toString() : "user1";

  // تصفية الخزائن حسب الدور
  let allowedCashboxes: Cashbox[] = [];
  if (role === "super_admin") {
    allowedCashboxes = cashboxes;
  } else if (role === "center_admin") {
    allowedCashboxes = cashboxes.filter(c => c.type === "center");
  } else if (role === "branch_manager") {
    allowedCashboxes = cashboxes.filter(c => c.id === branchId || (c.type === "user" && c.id.startsWith("user")));
  } else if (role === "employee") {
    allowedCashboxes = cashboxes.filter(c => c.id === userId);
  }

  // تصفية حسب النوع (مع الصلاحيات)
  const [typeFilter, setTypeFilter] = useState<string>("");
  const filteredCashboxes = typeFilter ? allowedCashboxes.filter(c => c.type === typeFilter) : allowedCashboxes;
  const totalBalance = filteredCashboxes.reduce((sum, c) => sum + c.balance, 0);

  // رصيد الخزينة المحددة
  const selected = cashboxes.find(c => c.id === selectedCashbox);
  const cashboxTransactions = transactions.filter(t => t.cashboxId === selectedCashbox || t.toCashboxId === selectedCashbox);

  // إضافة حركة مالية
  const handleAddTransaction = () => {
    if (!selectedCashbox || amount <= 0) return;
    const id = `t${transactions.length + 1}`;
    const date = new Date().toISOString().slice(0, 10);
    let newTx: CashTransaction = {
      id,
      cashboxId: selectedCashbox,
      type: actionType,
      amount,
      date,
      user: "admin", // لاحقًا: من المستخدم الحالي
      note,
    };
    let updatedCashboxes = [...cashboxes];
    if (actionType === "deposit") {
      updatedCashboxes = updatedCashboxes.map(c => c.id === selectedCashbox ? { ...c, balance: c.balance + amount } : c);
    } else if (actionType === "withdraw") {
      updatedCashboxes = updatedCashboxes.map(c => c.id === selectedCashbox ? { ...c, balance: c.balance - amount } : c);
    } else if (actionType === "transfer" && toCashbox) {
      newTx.toCashboxId = toCashbox;
      updatedCashboxes = updatedCashboxes.map(c => {
        if (c.id === selectedCashbox) return { ...c, balance: c.balance - amount };
        if (c.id === toCashbox) return { ...c, balance: c.balance + amount };
        return c;
      });
    }
    setTransactions([...transactions, newTx]);
    setCashboxes(updatedCashboxes);
    setAmount(0);
    setNote("");
    setShowAdd(false);
  };

  // تصفية حسب النوع
  const [typeFilter, setTypeFilter] = useState<string>("");
  const filteredCashboxes = typeFilter ? cashboxes.filter(c => c.type === typeFilter) : cashboxes;
  const totalBalance = filteredCashboxes.reduce((sum, c) => sum + c.balance, 0);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>إدارة الخزائن المالية</CardTitle>
          <div className="flex flex-wrap gap-4 mt-4">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border rounded px-2 py-1">
              <option value="">كل الأنواع</option>
              <option value="center">مركز رئيسي</option>
              <option value="branch">فرع</option>
              <option value="user">محفظة موظف</option>
              <option value="admin">أدمن</option>
            </select>
            <div className="ml-auto font-bold text-lg">إجمالي الأرصدة: <span className="text-green-700">{totalBalance} ج.م</span></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الخزينة</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الرصيد الحالي</TableHead>
                  <TableHead>عرض الحركات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCashboxes.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.type === "center" ? "مركز رئيسي" : c.type === "branch" ? "فرع" : c.type === "user" ? "محفظة موظف" : "أدمن"}</TableCell>
                    <TableCell className={c.balance < 0 ? "text-red-600 font-bold" : ""}>{c.balance} ج.م</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => setSelectedCashbox(c.id)}>عرض</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {selected && (
            <div className="mb-8 p-4 border rounded bg-muted">
              <h3 className="font-bold mb-2">{selected.name} - الرصيد: {selected.balance} ج.م</h3>
              {/* صلاحية إضافة حركة مالية: فقط super_admin, branch_manager, employee على محفظته */}
              {(
                role === "super_admin" ||
                (role === "center_admin" && selected.type === "center") ||
                (role === "branch_manager" && (selected.type === "branch" || selected.type === "user")) ||
                (role === "employee" && selected.id === userId)
              ) && (
                <Button onClick={() => setShowAdd(true)} className="mb-4">إضافة حركة مالية</Button>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>ملاحظات</TableHead>
                    <TableHead>للخزينة المحولة إليها</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cashboxTransactions.length > 0 ? cashboxTransactions.map(t => (
                    <TableRow key={t.id}>
                      <TableCell>{t.date}</TableCell>
                      <TableCell>{t.type === "deposit" ? "إيداع" : t.type === "withdraw" ? "سحب" : "تحويل"}</TableCell>
                      <TableCell>{t.amount}</TableCell>
                      <TableCell>{t.user}</TableCell>
                      <TableCell>{t.note}</TableCell>
                      <TableCell>{t.toCashboxId ? cashboxes.find(c => c.id === t.toCashboxId)?.name : "-"}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">لا توجد حركات</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {showAdd && (
            <div className="p-4 border rounded mb-4 bg-muted">
              <h4 className="mb-2">إضافة حركة مالية</h4>
              <div className="flex flex-wrap gap-4 mb-2">
                <select value={actionType} onChange={e => setActionType(e.target.value as any)} className="border rounded px-2 py-1">
                  <option value="deposit">إيداع</option>
                  <option value="withdraw">سحب</option>
                  <option value="transfer">تحويل</option>
                </select>
                <Input type="number" min={1} value={amount} onChange={e => setAmount(Number(e.target.value))} placeholder="المبلغ" />
                {actionType === "transfer" && (
                  <select value={toCashbox} onChange={e => setToCashbox(e.target.value)} className="border rounded px-2 py-1">
                    <option value="">اختر الخزينة المحولة إليها</option>
                    {cashboxes.filter(c => c.id !== selectedCashbox).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
                <Input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="ملاحظات" />
                <Button onClick={handleAddTransaction}>حفظ</Button>
                <Button variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
