import React from 'react';
import { AiFillProject } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { IoHome } from 'react-icons/io5';
import { MdCreateNewFolder, MdOutlineInsertInvitation } from 'react-icons/md';
import { RiTeamFill } from 'react-icons/ri';
import { Outlet } from 'react-router';
import { NavLink } from 'react-router';

const Dashboard_layout = () => {
    return (
        <div>
            <div className='flex'>
                <div className='h- bg-amber-200 w-2/12 border-r-4 scroll-auto border-black'>
                <div className='space-y-5  mt-10 w-full px-5'>
                      <NavLink to="/" className='flex items-center bg-green-500 p-2 pl-5 rounded-2xl hover:scale-95 transition cursor-pointer   gap-2'>
                        <IoHome />Home
                    </NavLink>
                    <NavLink to = "/developer_dashboard/profile" className='flex items-center bg-green-500 p-2 pl-5  rounded-2xl hover:scale-95 transition cursor-pointer  gap-2 '>
                        <CgProfile /> <p>
                            profile
                        </p>
                    </NavLink>
                    <NavLink to="/developer_dashboard/developer_projects" className='flex items-center bg-green-500 p-2 pl-5 rounded-2xl hover:scale-95 transition cursor-pointer   gap-2'>
                        <AiFillProject />projects
                    </NavLink>
                    <NavLink to="/developer_dashboard/created_project" className='flex items-center bg-green-500 p-2 pl-5 rounded-2xl hover:scale-95 transition cursor-pointer   gap-2'>
                        <MdCreateNewFolder />created_project
                    </NavLink>
                    
                        <NavLink to="/developer_dashboard/joined_team" className='flex items-center bg-green-500 p-2 pl-5 rounded-2xl hover:scale-95 transition cursor-pointer   gap-2'>
                        <RiTeamFill />Joined_Team
                    </NavLink>
                       <NavLink to="/developer_dashboard/invitations" className='flex items-center bg-green-500 p-2 pl-5 rounded-2xl hover:scale-95 transition cursor-pointer   gap-2'>
                        <MdOutlineInsertInvitation />invitations
                    </NavLink>
                   
                    
                </div>
                </div>
                <div className='min-h-screen  bg-amber-700 w-10/12  scroll-auto'>
                <Outlet/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard_layout;