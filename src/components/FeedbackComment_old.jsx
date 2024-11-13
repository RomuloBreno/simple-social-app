
// // src/components/Footer.tsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/authContext';
// import { fetchApi } from '../utils/fetch';


// const FeedbackComment = ({ index, isExpanded, displayText, owner }) => {
//   const data = useAuth().data
//   const [userOwnerComment] = useState(owner); 
//   debugger
  
//   useEffect(() => {
//   }, [data?.user,userOwnerComment]);

//   return (
//     <div>
//         <div className=''
//           key={index}
//           style={{ cursor: 'pointer', margin: '5px 0', color: '#333', padding: '16px', backgroundColor: isExpanded ? '#efefef' : '#fff' }}
//         >
//           <div className="d-flex">
//             <img className="rounded-circle" width="25" src="https://picsum.photos/50/50" alt="" />
//             <div className="h7 text-muted px-2">
//               <a style={{ textDecoration: 'none', color: 'grey' }} href={'/profile/' + userOwnerComment?.nick}> Autor:{userOwnerComment?.email}</a>
//             </div>
//           </div>
//           <br />
//           {displayText}
//         </div>
//     </div>

//   );
// };

// export default FeedbackComment;
