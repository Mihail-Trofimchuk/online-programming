"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { isAdmin } from "@/lib/admin";

import { SearchInput } from "./search-input";
import { useEffect, useState } from 'react';

import axios from 'axios';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useInput } from '@/hooks/use-input';


export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/admin");
  
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  const name = useInput('');
  const username = useInput('')
  const education = useInput('')
  const motivation = useInput('')



  const [isTeacherUser, setIsTeacherUser] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(true);
  const [hasUserMessage, setHasUserMessage] = useState(false);

  useEffect(() => {
    const checkUserMessage = async () => {
      try {

        const response = await axios.get(`/api/message`);
      
        console.log(response.data)
        setHasUserMessage(response.data);
      } catch (error) {
        console.error('Error checking user message:', error);
      }
    };

    checkUserMessage();
  }, [userId]);

  useEffect(() => {
 
    const checkIsTeacher = async () => {
      try {

        const response = await axios.get(`/api/user/${userId}`);
     
        const teacher = response.data;
  
        if(teacher){
          setIsTeacherUser(true); 
        } else {
          setIsTeacherUser(false); 
        }

      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };
   
    checkIsTeacher();
  }, [userId]);


  const handleSendLetter = async () => {
    try {
      setIsMessageSent(true);
      setDialogOpen(false); 
      console.log(name.value);
      console.log(username.value);
      console.log(education.value);
      console.log(motivation.value);

      let data = {
        name: name.value,
        username: username.value,
        education: education.value,
        motivation: motivation.value
      }
      const response = await axios.post('/api/message', data );
       
    } catch (error) {
      console.error('Error sending application:', error);
    }
  };

  const [hasUserMessageLoaded, setHasUserMessageLoaded] = useState(false);

  useEffect(() => {
    const checkUserMessage = async () => {
      try {
        const response = await axios.get(`/api/message`);
        setHasUserMessage(response.data);
        setHasUserMessageLoaded(true);
      } catch (error) {
        console.error('Error checking user message:', error);
      }
    };

    checkUserMessage();
  }, [userId]);


  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage || isAdminPage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : !isAdmin(userId) && isTeacherUser && (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher mode
            </Button>
          </Link>
        )}
        { isAdmin(userId) && !isAdminPage && (
          <Link href="/admin/category"> 
            <Button size="sm" variant="ghost">
              Admin Page
            </Button>
          </Link>
        )}
      { !isAdmin(userId) &&  !isTeacherUser && <div>
        <Dialog>
      <DialogTrigger asChild>
       { hasUserMessageLoaded  && ( <Button  onClick={() => setDialogOpen(true)}  disabled={isMessageSent || hasUserMessage} variant="outline"> {isMessageSent || hasUserMessage ? 'Application sent' : 'Become a teacher'}</Button>)}
      </DialogTrigger>
      {isDialogOpen && ( <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Become a teacher</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-12">
          <div className="flex flex-col items-start gap-4">
            <Label htmlFor="name" className="text-left">
              Name
            </Label>
            <Input
              {...name}
              id="name"
              placeholder='Pedro'
            />
          </div>
          <div className="flex flex-col items-start gap-4">
            <Label htmlFor="username" className=" text-left">
              Surname
            </Label>
            <Input
              {...username}
              id="username"
              placeholder='Duarte'
            />
          </div>
          <div className="flex flex-col items-start gap-4">
            <Label htmlFor="education" className=" text-left">
            Education, qualifications
            </Label>
            <Input
              {...education}
              id="education"
              placeholder='Bachelor, Master, Specialist...'
            />
          </div>
          <div className="flex flex-col items-start gap-4">
            <Label htmlFor="motivation" className=" text-left">
              Brief motivation letter
            </Label>
            <Input  {...motivation}  id="motivation" placeholder="Type your motivation message here." />
          </div>
        </div>

        <DialogFooter>
    
          <Button type="submit" onClick={handleSendLetter} >Send letter</Button>

        </DialogFooter>
      </DialogContent>
       )}
    </Dialog>
     
        </div>
      }
       <UserButton
          afterSignOutUrl="/"
        />
      </div>
    </>
  )
}