
import { Link } from 'react-router-dom';
import {BsArrowLeft} from 'react-icons/bs';

 
import '../eMailVerification.css';


const BackButton = ( {destination = '/'}) => {
  return (
    <div className='flex'>
           <Link
                to={'/EventsPage'}
                className='back-button'
           >
              <BsArrowLeft className='text-2xl'/>
           </Link>
        
        </div>
  )
} 

export default BackButton