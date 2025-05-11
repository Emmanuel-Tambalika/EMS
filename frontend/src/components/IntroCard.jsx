import React from 'react'

const IntroCard = (props) => {


     return (
    <div className='Intro-Card'>

      <h2 className='Welcome-heading'>{props.heading}</h2>
      <p className='role1'>{props.EMSRole1}</p>
      <p  className='role1'>{props.EMSRole2}</p>
      <p  className='role2'>{props.EMSRole3}</p>
      <p  className='role2'>{props.EMSRole4}</p>

    </div>
  )
}

export default IntroCard