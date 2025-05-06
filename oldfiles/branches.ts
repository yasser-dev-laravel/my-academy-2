// ملف الفروع (Branches) بعد التعديل ليعتمد على الملفات الموحدة
import { BranchDto, BranchDtoPaginationResult, CreateBranchDto } from './types';
import { getBranchesPaginated, createBranch, updateBranch, deleteBranch } from './api';

// يمكنك الآن استيراد الدوال والأنواع مباشرة من هذا الملف أو من api.ts/types.ts حسب الحاجة
// مثال:
// import { getBranchesPaginated } from './api';
// import { BranchDto } from './types';

export type { BranchDto, BranchDtoPaginationResult, CreateBranchDto };
export { getBranchesPaginated, createBranch, updateBranch, deleteBranch };
