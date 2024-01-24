"use client"

import { Category } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown,  Trash,  UserPlus2, UserCheck2 } from "lucide-react"


import { Button } from "@/components/ui/button";

import toast from 'react-hot-toast';
import { useState } from 'react';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { SimplifiedUser } from '../page';
import { isAdmin } from '@/lib/admin';


const ConfirmDeleteButton: React.FC<{ userId: string }> = ({ userId }) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
  
	const onDelete = async () => {
	  try {
		setIsLoading(true);
		await axios.delete(`/api/user/${userId}`);
  
		toast.success("Category deleted");
		router.refresh();
		router.push(`/admin/users`);
	  } catch (error) {
		console.error("Error deleting category:", error);
		toast.error("Something went wrong");
	  } finally {
		setIsLoading(false);
	  }
	};

  if(!isAdmin(userId)){
	return (
	  <ConfirmModal onConfirm={onDelete}>
		<Button size="sm" disabled={isLoading}>
		  <Trash className="h-4 w-4" />
		</Button>
	  </ConfirmModal>
	);
  }
  
};

const ConfirmUpdateButton: React.FC<{ userId: string }> = ({ userId }) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
  
	const onDelete = async () => {
	  try {
		setIsLoading(true);
		await axios.post(`/api/user/${userId}`);
  
		toast.success("Teacher updated");
		router.refresh();
		router.push(`/admin/users`);
	  } catch (error) {
		console.error("Error deleting category:", error);
		toast.error("Something went wrong");
	  } finally {
		setIsLoading(false);
	  }
	};

  if(!isAdmin(userId)){
	return (
	  <ConfirmModal onConfirm={onDelete}>
		<Button size="sm" disabled={isLoading}>
		  <UserPlus2 className="h-4 w-4" />
		</Button>
	  </ConfirmModal>
	);
  }
  
};

export const columns: ColumnDef<SimplifiedUser>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "emailAddress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          EmailAddress
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "teacher",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Teacher
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <span>
      {row.getValue("teacher") ? (
        <UserCheck2 className='ml-16'/> 
      ) : (
        null
      )}
    </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Create Time 
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <span>{new Date(row.getValue("createdAt")).toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Update Time 
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <span>{new Date(row.getValue("updatedAt")).toLocaleString()}</span>
    ),
  },
  {
    id: "update",
    cell: ({ row }) => {
      const { id } = row.original;
      return <ConfirmUpdateButton userId={id} />;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <ConfirmDeleteButton userId={id} />

      )
    }
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const  id  = row.id;
  //     console.log(id);
	//   return <ConfirmDeleteButton userId={id} />;
  //   }
  // },
 
]
