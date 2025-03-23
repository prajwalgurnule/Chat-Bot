import React, { useContext, useState, useEffect } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../Context/Context';

const Sidebar = ({ theme }) => {
   const [extended, setExtended] = useState(false);
   const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

   const loadPrompt = async (prompt) => {
      setRecentPrompt(prompt);
      await onSent(prompt);
   };

   return (
      <div className={`Sidebar ${theme}`}>
         <div className='top'>
            <img onClick={() => setExtended(prev => !prev)} className='menu' src={assets.menu_icon} alt='' />
            <div onClick={() => newChat()} className='new-chat'>
               <img src={assets.plus_icon} alt='' />
               {extended ? <p>New Chat</p> : null}
            </div>
            {extended ? (
               <div className='recent'>
                  <p className='recent-title'>Recent Search</p>
                  {prevPrompts.map((item, index) => {
                     return (
                        <div onClick={() => loadPrompt(item)} className='recent-entry' key={index}>
                           <img src={assets.message_icon} alt='' />
                           <p>{item.slice(0, 18)}...</p>
                        </div>
                     );
                  })}
               </div>
            ) : null}
         </div>
      </div>
   );
};

export default Sidebar;
