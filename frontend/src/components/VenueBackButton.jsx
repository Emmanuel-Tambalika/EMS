
import { Link } from 'react-router-dom';
import {BsArrowLeft} from 'react-icons/bs';

 
import '../eMailVerification.css';


const VenueBackButton = ( ) => {
  return (
    <div className='flex'>
           <Link
                to={'/VenueManager'}
                className='back-button'
           >
              <BsArrowLeft className='text-2xl'/>
           </Link>
        
        </div>
  )
} 

export default  VenueBackButton ;