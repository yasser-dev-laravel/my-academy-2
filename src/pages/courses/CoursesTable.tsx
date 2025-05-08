import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {CourseGetAllType} from "@/utils/api/coreTypes";

const CoursesTable = ({ courses, onEdit, onDelete }) => (
  <Table className="table-striped">
    <TableHeader>
      <TableRow>
        <TableHead>كود الكورس</TableHead>
        <TableHead>اسم الكورس</TableHead>
        <TableHead>الوصف</TableHead>
        <TableHead>القسم</TableHead>
        <TableHead>الحالة</TableHead>
        <TableHead>الإجراءات</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {courses?.length > 0 ? (
        courses.map((course) => (
          <React.Fragment key={course.id}>
            <TableRow>
              <TableCell>{course.applicationId}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.description}</TableCell>
              <TableCell>{course.categoryName}</TableCell>
              <TableCell>{course.isActive ? "نعم" : "لا"}</TableCell>
              <TableCell className="text-right flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(course)}
                  title="تعديل الكورس"
                >
                  <Edit className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(course.id)}
                  title="حذف الكورس"
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
            {course.levels && course.levels.length > 0 && (
              <TableRow>
                <TableCell colSpan={6} className="p-0">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`course-${course.id}`}>
                      <AccordionTrigger className="bg-gray-100 text-gray-800">{`${course.levels.length} مستويات`}</AccordionTrigger>
                      <AccordionContent className="bg-gray-50">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>اسم المستوى</TableHead>
                              <TableHead>الوصف</TableHead>
                              <TableHead>السعر</TableHead>
                              <TableHead>عدد المحاضرات</TableHead>
                              <TableHead>كود المستوى</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {course.levels.map((level) => (
                              <TableRow key={level.id}>
                                <TableCell>{level.name}</TableCell>
                                <TableCell>{level.description}</TableCell>
                                <TableCell>{level.price} جنيها</TableCell>
                                <TableCell>{level.sessionsCount}</TableCell>
                                <TableCell>{level.applicationId}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={6} className="text-center text-muted-foreground">
            لا توجد بيانات لعرضها
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
);

export default CoursesTable;