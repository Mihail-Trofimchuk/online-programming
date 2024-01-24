"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash } from "lucide-react"


import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import toast from 'react-hot-toast';
import { useState } from 'react';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Course } from '@prisma/client';


const ConfirmDeleteButton: React.FC<{ courseId: string }> = ({ courseId }) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
  
	const onDelete = async () => {
	  try {
		setIsLoading(true);
  
		await axios.delete(`/api/courses/${courseId}`);
  
		toast.success("Course deleted");
		router.refresh();
		router.push(`/admin/courses`);
	  } catch (error) {
		console.error("Error deleting category:", error);
		toast.error("Something went wrong");
	  } finally {
		setIsLoading(false);
	  }
	};
  
	return (
	  <ConfirmModal onConfirm={onDelete}>
		<Button size="sm" disabled={isLoading}>
		  <Trash className="h-4 w-4" />
		</Button>
	  </ConfirmModal>
	);
  };

  const ConfirmVerifyButton: React.FC<{ courseId: string }> = ({ courseId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    
    const onDelete = async () => {
      try {
      setIsLoading(true);
    
      await axios.delete(`/api/courses/${courseId}`);
    
      toast.success("Course deleted");
      router.refresh();
      router.push(`/admin/courses`);
      } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Something went wrong");
      } finally {
      setIsLoading(false);
      }
    };
    const onEdit = () => {
      router.push(`/admin/courses/${courseId}`);
    }
    
    return (
 
      <Button size="sm" onClick={onEdit} disabled={isLoading}>
        <Pencil className="h-4 w-4" />
      </Button>
    );
    };
  
export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") || "0");
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(price);

      return <div>{formatted}</div>
    }
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;

      return (
        <Badge className={cn(
          "bg-slate-500",
          isPublished && "bg-sky-700"
        )}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
      )
    }
  },
  {
    accessorKey: "isVerified",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const isVerified = row.getValue("isVerified") || false;

      return (
        <Badge className={cn(
          "bg-slate-500",
          isVerified && "bg-sky-700"
        )}>
          {isVerified ? "Verify" : "Not Verify"}
        </Badge>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

	  return <ConfirmDeleteButton courseId={id} />;
    }
  },
  {
    id: "action",
    cell: ({ row }) => {
      const { id } = row.original;

	  return <ConfirmVerifyButton courseId={id} />;
    }
  }
]
