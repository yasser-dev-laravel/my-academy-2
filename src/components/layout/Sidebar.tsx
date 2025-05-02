import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  Users, 
  Book, 
  Landmark, 
  Laptop, 
  ShoppingBag, 
  Layers, 
  UserCheck, 
  School, 
  CalendarCheck, 
  MessagesSquare, 
  CreditCard, 
  BarChart,
  Menu,
  ChevronDown,
  Upload,
  ArrowRight,
  Settings
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

const NavItem = ({ to, icon: Icon, label, active, onClick, collapsed }: NavItemProps) => {
  // Special styling for group nav item
  const isGroupNav = to.startsWith("/groups");
  return (
    <Link 
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isGroupNav ? "sidebar-group-item" : "",
        active
          ? (isGroupNav ? "active" : "bg-sidebar-accent text-sidebar-accent-foreground")
          : (isGroupNav ? "" : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"),
        collapsed ? "justify-center px-2" : ""
      )}
    >
      <Icon className="h-5 w-5" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};

interface NavGroupProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const NavGroup = ({ title, icon: Icon, children, defaultOpen = false }: NavGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [hovered, setHovered] = useState(false);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-1">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            "w-full justify-between px-3 py-2 text-sm font-normal transition-colors duration-150",
            hovered ? "bg-sidebar-accent/70 text-sidebar-accent-foreground" : "bg-transparent text-sidebar-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-4 w-4" />
            <span>{title}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pr-0 pl-6 pt-1">{children}</CollapsibleContent>
    </Collapsible>
  );
};

const menuTranslations = {
  ar: {
    home: "الرئيسية",
    academy: "إدارة الأكاديمية",
    branches: "الفروع",
    rooms: "المعامل والقاعات",
    departments: "الأقسام",
    system: "إدارة النظام",
    employees: "الموظفين",
    roles: "الأدوار والصلاحيات",
    education: "إدارة التعليم",
    courses: "الكورسات",
    teachers: "المحاضرين",
    groups: "المجموعات",
    attendance: "الحضور والغياب",
    customers: "إدارة العملاء",
    leads: "العملاء المحتملين",
    students: "الطلاب",
    finance: "الإدارة المالية",
    receipts: "الإيصالات المالية",
    reports: "التقارير المالية",
    messaging: "إدارة الرسائل",
    campaigns: "الحملات",
    booking: "الحجوزات والمدفوعات",
    settings: "الإعدادات",
    copyright: "حقوق النشر 2025 Latin Academy"
  },
  en: {
    home: "Home",
    academy: "Academy Management",
    branches: "Branches",
    rooms: "Rooms",
    departments: "Departments",
    system: "System Management",
    employees: "Employees",
    roles: "Roles & Permissions",
    education: "Education Management",
    courses: "Courses",
    teachers: "Instructors",
    groups: "Groups",
    attendance: "Attendance",
    customers: "Customer Management",
    leads: "Potential Leads",
    students: "Students",
    finance: "Financial Management",
    receipts: "Receipts",
    reports: "Financial Reports",
    messaging: "Message Management",
    campaigns: "Campaigns",
    booking: "Booking & Payments",
    settings: "Settings",
    copyright: "Copyright 2025 Latin Academy"
  }
};

export const Sidebar = ({ isOpen, setIsOpen, onCollapseChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const t = menuTranslations[language];
  console.log(user.roleIds);

  // Helper to get roleIds as array (handles undefined/null)
//   const user.roleIds = Array.isArray(user?.roleIds)
//     ? user.roleIds
//     : user?.roleIds !== undefined && user?.roleIds !== null
//       ? [user.roleIds]
//       : [];
// console.log(user.roleIds);
  // تعريف صلاحيات كل عنصر بناءً على رقم الدور
  const canSeeAcademy = user.roleIds.includes(1); // مثال: 1 = admin
  const canSeeSystem = user.roleIds.includes(1);
  const canSeeEducation = user.roleIds.some(id => [1,2,3].includes(id));
  const canSeeInstructors = user.roleIds.some(id => [1,2,3].includes(id));
  const canSeeGroups = user.roleIds.some(id => [1,2,3,4].includes(id));
  const canSeeAttendance = user.roleIds.some(id => [1,2,3].includes(id));
  const canSeeCustomers = user.roleIds.some(id => [1,2].includes(id));
  const canSeeLeads = user.roleIds.some(id => [1,2].includes(id));
  const canSeeStudents = user.roleIds.some(id => [1,2,3,4].includes(id));
  const canSeeFinance = user.roleIds.some(id => [1,2].includes(id));
  const canSeeReceipts = user.roleIds.some(id => [1,2].includes(id));
  const canSeeReports = user.roleIds.some(id => [1,2].includes(id));
  const canSeeMessaging = user.roleIds.some(id => [1,2].includes(id));
  const canSeeCampaigns = user.roleIds.some(id => [1,2].includes(id));
  const canSeeBooking = user.roleIds.some(id => [1,2,3,4].includes(id));
  const canSeeSettings = user.roleIds.some(id => [1].includes(id));
  const canSeeBranches = user.roleIds.some(id => [1,2].includes(id)); // مثال: 1=admin, 2=موظف

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (onCollapseChange) onCollapseChange(collapsed);
  }, [collapsed, onCollapseChange]);

  if (!user) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  const handleNavItemClick = () => {
    if (isMobile) setIsOpen(false);
  };

  return (
    <div
      className={cn(
        "fixed top-0 bottom-0 left-0 z-30 flex flex-col border-r bg-sidebar transform transition-transform duration-200 ease-in-out",
        collapsed ? "w-16" : "w-64",
        isRTL ? "right-0 left-auto" : "left-0 right-auto",
        isOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"
      )}
    >
      <div className="flex h-14 items-center border-b px-4 justify-between">
        <div className="flex items-center gap-2">
          {!collapsed && <div className="font-semibold text-sidebar-foreground">Latin Academy</div>}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">{collapsed ? "Expand" : "Collapse"} Sidebar</span>
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-auto py-2">
        <div className="px-2 py-1">
          <NavItem
            to="/"
            icon={Home}
            label={t.home}
            active={isActive("/")}
            onClick={handleNavItemClick}
            collapsed={collapsed}
          />
          
          {canSeeAcademy && (
            <NavGroup title={t.academy} icon={Landmark} defaultOpen={
              isActive("/branches") || isActive("/rooms") || isActive("/departments")
            }>
              <NavItem 
                to="/branches" 
                icon={Landmark} 
                label={t.branches}
                active={isActive("/branches")} 
                onClick={handleNavItemClick} 
                collapsed={collapsed}
              />
              <NavItem 
                to="/rooms" 
                icon={Laptop} 
                label={t.rooms}
                active={isActive("/rooms")} 
                onClick={handleNavItemClick} 
                collapsed={collapsed}
              />
              <NavItem 
                to="/categories" 
                icon={Layers} 
                label={t.departments}
                active={isActive("/categories")} 
                onClick={handleNavItemClick} 
                collapsed={collapsed}
              />
            </NavGroup>
          )}
          
          {canSeeSystem && (
            <NavGroup title={t.system} icon={Users} defaultOpen={
              isActive("/employees") || isActive("/roles")
            }>
              <NavItem 
                to="/employees" 
                icon={Users} 
                label={t.employees}
                active={isActive("/employees")} 
                onClick={handleNavItemClick} 
                collapsed={collapsed}
              />
              <NavItem 
                to="/roles" 
                icon={UserCheck} 
                label={t.roles}
                active={isActive("/roles")} 
                onClick={handleNavItemClick} 
                collapsed={collapsed}
              />
            </NavGroup>
          )}
          <NavGroup title={t.education} icon={Book} defaultOpen={
            isActive("/courses") || isActive("/instructors") || isActive("/groups") || isActive("/attendance")
          }>
            <NavItem 
              to="/courses" 
              icon={Book} 
              label={t.courses}
              active={isActive("/courses")} 
              onClick={handleNavItemClick} 
              collapsed={collapsed}
            />
            {canSeeInstructors && (
              <NavItem 
                to="/instructors" 
                icon={School} 
                label={t.teachers}
                active={isActive("/instructors")} 
                onClick={handleNavItemClick} 
                collapsed={collapsed}
              />
            )}
            {canSeeGroups && (
              <NavItem 
                to="/groups" 
                icon={Users} 
                label={t.groups}
                active={isActive("/groups")} 
                onClick={handleNavItemClick} 
                collapsed={collapsed}
              />
            )}
            {canSeeAttendance && (
              <NavItem 
                to="/attendance" 
                icon={CalendarCheck} 
                label={t.attendance}
                active={isActive("/attendance")} 
                onClick={handleNavItemClick} 
                collapsed={collapsed}
              />
            )}
          </NavGroup>
          {canSeeBooking && (
            <NavItem 
              to="/booking" 
              icon={CreditCard} 
              label={t.booking}
              active={isActive("/booking")}
              onClick={handleNavItemClick} 
              collapsed={collapsed}
            />
          )}
          {canSeeCustomers && (
            <NavGroup title={t.customers} icon={ShoppingBag} defaultOpen={
              isActive("/leads") || isActive("/students")
            }>
              {canSeeLeads && (
                <NavItem 
                  to="/leads" 
                  icon={ArrowRight} 
                  label={t.leads}
                  active={isActive("/leads")} 
                  onClick={handleNavItemClick} 
                  collapsed={collapsed}
                />
              )}
              {canSeeStudents && (
                <NavItem 
                  to="/students" 
                  icon={Users} 
                  label={t.students}
                  active={isActive("/students")} 
                  onClick={handleNavItemClick} 
                  collapsed={collapsed}
                />
              )}
            </NavGroup>
          )}
          
          {canSeeFinance && (
            <NavGroup title={t.finance} icon={CreditCard} defaultOpen={
              isActive("/receipts") || isActive("/finance")
            }>
              {canSeeReceipts && (
                <NavItem 
                  to="/receipts" 
                  icon={CreditCard} 
                  label={t.receipts}
                  active={isActive("/receipts")} 
                  onClick={handleNavItemClick} 
                  collapsed={collapsed}
                />
              )}
              {canSeeReports && (
                <NavItem 
                  to="/finance" 
                  icon={BarChart} 
                  label={t.reports}
                  active={isActive("/finance")} 
                  onClick={handleNavItemClick} 
                  collapsed={collapsed}
                />
              )}
            </NavGroup>
          )}
          
          {canSeeMessaging && (
            <NavItem 
              to="/messaging" 
              icon={MessagesSquare} 
              label={t.messaging}
              active={isActive("/messaging")} 
              onClick={handleNavItemClick} 
              collapsed={collapsed}
            />
          )}
          
          {canSeeCampaigns && (
            <NavItem 
              to="/campaigns" 
              icon={Upload} 
              label={t.campaigns}
              active={isActive("/campaigns")} 
              onClick={handleNavItemClick} 
              collapsed={collapsed}
            />
          )}
          {canSeeSettings && (
            <NavItem 
              to="/settings" 
              icon={Settings} 
              label={t.settings || "الإعدادات"}
              active={isActive("/settings")} 
              onClick={handleNavItemClick} 
              collapsed={collapsed}
            />
          )}
        </div>
      </ScrollArea>
      <div className="mt-auto p-4 border-t text-xs text-center text-sidebar-foreground/70">
        <p>{t.copyright}</p>
      </div>
    </div>
  );
};
