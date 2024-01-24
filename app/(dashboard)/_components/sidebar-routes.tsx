"use client";

import { BarChart, Compass, Layout, List, ListChecks, User, BookCopy, Heart, ListTodo, MessageSquareIcon  } from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
  {
    icon: Heart,
    label: "Favorites",
    href: "/favorites",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
  {
    icon: ListTodo,
    label: "Test results",
    href: "/teacher/tests",
  },
]

const adminRoutes = [
  {
    icon: ListChecks,
    label: "Categories",
    href: "/admin/category",
  },
  {
    icon: User,
    label: "Users",
    href: "/admin/users",
  },
  {
    icon: BookCopy,
    label: "Courses",
    href: "/admin/courses",
  },
  {
    icon: MessageSquareIcon,
    label: "Messages",
    href: "/admin/messages",
  },
]

export const  SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");
  const isAdminPage = pathname?.includes("/admin");

  const routes = isAdminPage ? adminRoutes : (isTeacherPage ? teacherRoutes : guestRoutes);

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  )
}