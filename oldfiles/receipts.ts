// API افتراضي للإيصالات المالية (Payments)
// حتى يتم تجهيز الربط مع السيرفر الحقيقي

export interface Payment {
  id: string;
  studentId: string;
  groupId: string;
  amount: number;
  date: string;
  status: string;
  note?: string;
}

const STORAGE_KEY = 'latin_academy_receipts';

function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
}

function saveToLocalStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const getReceipts = async (): Promise<Payment[]> => {
  return getFromLocalStorage<Payment[]>(STORAGE_KEY, []);
};

export const addReceipt = async (receipt: Payment): Promise<void> => {
  const receipts = await getReceipts();
  receipts.push(receipt);
  saveToLocalStorage(STORAGE_KEY, receipts);
};

export const updateReceipt = async (receipt: Payment): Promise<void> => {
  let receipts = await getReceipts();
  receipts = receipts.map(r => r.id === receipt.id ? receipt : r);
  saveToLocalStorage(STORAGE_KEY, receipts);
};

export const deleteReceipt = async (id: string): Promise<void> => {
  let receipts = await getReceipts();
  receipts = receipts.filter(r => r.id !== id);
  saveToLocalStorage(STORAGE_KEY, receipts);
};

// تصفية حسب الطالب أو المجموعة أو الفترة
export const filterReceipts = async (filters: {
  studentId?: string;
  groupId?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<Payment[]> => {
  let receipts = await getReceipts();
  if (filters.studentId) receipts = receipts.filter(r => r.studentId === filters.studentId);
  if (filters.groupId) receipts = receipts.filter(r => r.groupId === filters.groupId);
  if (filters.fromDate) receipts = receipts.filter(r => r.date >= filters.fromDate);
  if (filters.toDate) receipts = receipts.filter(r => r.date <= filters.toDate);
  return receipts;
};
