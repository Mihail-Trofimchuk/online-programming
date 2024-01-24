import axios from 'axios';

export const isTeacher = async (userId?: string | null ) => {
 
  const response = await axios.get(`/api/user/${userId}`);
  const teacher = response.data;

   if(teacher) {
    return true;
   }
   else {
    return false;
   }
}