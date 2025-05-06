import React, { useEffect, useState } from "react";
import GroupForm from "./GroupForm";
import GroupsTable from "./GroupsTable";
import { getByPagination, create, edit, deleteById } from "@/utils/api/coreApi";

export default function Groups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const [groupsRes, branchesRes, roomsRes, instructorsRes, coursesRes] = await Promise.all([
        getByPagination("Groups/pagination", { Page: 1, Limit: 100 }),
        getByPagination("Branches/pagination", { Page: 1, Limit: 100 }),
        getByPagination("Rooms/pagination", { Page: 1, Limit: 100 }),
        getByPagination("Instructors/pagination", { Page: 1, Limit: 100 }),
        getByPagination("Courses/pagination", { Page: 1, Limit: 100 })
      ]);
      setGroups(groupsRes.data || []);
      setBranches(branchesRes.data || []);
      setRooms(roomsRes.data || []);
      setInstructors(instructorsRes.data || []);
      setCourses(coursesRes.data || []);
      const allLevels = (coursesRes.data || []).flatMap((course: any) =>
        (course.levels || []).map((level: any) => ({ ...level, courseId: course.id, courseName: course.name }))
      );
      setLevels(allLevels);
    })();
  }, []);

  const refreshGroups = async () => {
    const groupsRes = await getByPagination("Groups/pagination", { Page: 1, Limit: 100 });
    setGroups(groupsRes.data || []);
  };

  const handleSave = async (group: any) => {
    if (group.id) {
      await edit("Groups", group.id, group);
    } else {
      await create("Groups", group);
    }
    setFormOpen(false);
    setEditGroup(null);
    await refreshGroups();
  };

  const handleEdit = (group: any) => {
    setEditGroup(group);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteById("Groups", id);
    await refreshGroups();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">المجموعات</h1>
        <button className="btn btn-primary" onClick={() => { setEditGroup(null); setFormOpen(true); }}>إضافة مجموعة</button>
      </div>
      <GroupsTable
        groups={groups}
        courses={courses}
        levels={levels}
        branches={branches}
        rooms={rooms}
        instructors={instructors}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <GroupForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSave}
        group={editGroup}
        courses={courses}
        levels={levels}
        branches={branches}
        rooms={rooms}
        instructors={instructors}
      />
    </div>
  );
}

