
const UserPage = async ({
	params
  }: {
	params: { userId: string }
  }) => {

	console.log(params.userId);


	return ( 
	  <div className="p-6">
		  User
		 
       
	  </div>
	 );
  }
   
  export default UserPage;