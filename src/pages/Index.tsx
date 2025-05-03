import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

import { useState, useEffect as useEffectReact } from "react";
import { getBranchesPaginated } from "@/utils/api/branches";
import { getStudentsPaginated } from "@/utils/api/students";
import { getCategoriesPaginated } from "@/utils/api/categories";
import { getCoursesPaginated } from "@/utils/api/courses";
import { Users, BookOpen, BookText, Building, FolderOpen } from "lucide-react";

const DashboardCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  description?: string;
  icon: React.ElementType;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/20 p-1.5 text-primary">
          <Icon className="h-full w-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

const Index = () => {
  const { user } = useAuth();

  // حالة الطلاب
  const [students, setStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState<boolean>(true);
  const [studentsError, setStudentsError] = useState<string>("");

  // حالة الأقسام
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<string>("");

  // حالة الكورسات
  const [courses, setCourses] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(true);
  const [coursesError, setCoursesError] = useState<string>("");

  useEffectReact(() => {
    async function fetchCourses() {
      setCoursesLoading(true);
      setCoursesError("");
      try {
        const res = await getCoursesPaginated({ Page: 1, Limit: 1000 });
        setCourses(res.data || []);
      } catch (error) {
        setCoursesError("تعذر جلب بيانات الكورسات");
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    }
    fetchCourses();
  }, []);

  useEffectReact(() => {
    async function fetchStudents() {
      setStudentsLoading(true);
      setStudentsError("");
      try {
        const res = await getStudentsPaginated({ Page: 1, Limit: 1000 });
        setStudents(res.data || []);
      } catch (error) {
        setStudentsError("تعذر جلب بيانات الطلاب");
        setStudents([]);
      } finally {
        setStudentsLoading(false);
      }
    }
    fetchStudents();
  }, []);

  useEffectReact(() => {
    async function fetchCategories() {
      setCategoriesLoading(true);
      setCategoriesError("");
      try {
        const res = await getCategoriesPaginated({ Page: 1, Limit: 1000 });
        setCategories(res.data || []);
      } catch (error) {
        setCategoriesError("تعذر جلب بيانات الأقسام");
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);
  
  useEffect(() => {
    // Initialize mock data when dashboard loads
    
  }, []);
  
  // Get summary data from localStorage (except branches)
 

  // Branches: fetch from API
  const [branches, setBranches] = useState([]);
  useEffectReact(() => {
    async function fetchBranches() {
      try {
        const res = await getBranchesPaginated({ Page: 1, Limit: 100 });
        // Map BranchDto to Branch type
        const mappedBranches = Array.isArray(res.data)
          ? res.data.map((b: any) => ({
              id: String(b.id),
              name: b.name || '',
              code: b.code || '',
              governorate: b.areaName || '',
            }))
          : [];
        setBranches(mappedBranches);
      } catch (error) {
        setBranches([]);
      }
    }
    fetchBranches();
  }, []);
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">مرحباً {user.name}!</h2>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="analytics" >التحليلات</TabsTrigger>
          <TabsTrigger value="reports" >التقارير</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="إجمالي الطلاب"
              value={students.length.toString()}
              description="مجموع الطلاب المسجلين بالنظام"
              icon={Users}
            />
            <DashboardCard
              title="الكورسات"
              value={courses.length.toString()}
              description="عدد الكورسات المتاحة"
              icon={BookOpen}
            />
            <DashboardCard
              title="الأقسام"
              value={categories.length.toString()}
              description="عدد الأقسام الدراسية"
              icon={FolderOpen}
            />
            <DashboardCard
              title="الفروع"
              value={branches.length.toString()}
              description="عدد فروع الأكاديمية"
              icon={Building}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>الكورسات الحالية</CardTitle>
                <CardDescription>
                  نظرة عامة على الكورسات المتاحة
                </CardDescription>
              </CardHeader>
              <CardContent>
                {courses.length > 0 ? (
                  <div className="space-y-2">
                    {courses.map((course: any, index: number) => ( index < 10 && (
                      <div key={index} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <BookText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{course.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {course.code} - {course.levels?.length || 0} مستويات
                            </p>
                          </div>
                        </div>
                        <div className="text-sm">
                          {course.totalDuration} ساعة | {course.totalPrice} جنيه
                        </div>
                      </div>
                    )))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    لا توجد كورسات متاحة حالياً
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>الفروع</CardTitle>
                <CardDescription>
                  فروع الأكاديمية المتاحة
                </CardDescription>
              </CardHeader>
              <CardContent>
                {branches.length > 0 ? (
                  <div className="space-y-2">
                    {branches.map((branch: any, index: number) => (index < 10 && (
                      <div key={index} className="flex items-center gap-2 border-b pb-2">
                        <Building className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{branch.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {branch.governorate || "-"} - {branch.code || "-"}
                          </p>
                        </div>
                      </div>
                    )))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">لا توجد فروع متاحة</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
