import '../App.css' 

const Input = ({ icon: Icon, ...props }) => {
	return (
		<div className='input-div'>
			<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
			<Icon className='ICON' />
			</div>
			<input
				{...props}
				className='input'
			/>
		</div>
	);
};
export default Input;