import React, { useContext, useState } from 'react';
import { CiCircleQuestion } from 'react-icons/ci';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { NavLink } from 'react-router';
import Project_form from './Project_form';
import { AuthContext } from '../Firebase/AuthContext';

const Developer_projects = () => {
  const [modal, setmodal] = useState(false);
  const [form, setform] = useState(false);
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg) text-(--text) px-4">

      {/* Main Card */}
      <div className="bg-(--card) border border-(--border) p-8 rounded-2xl shadow-2xl text-center max-w-md w-full space-y-6">

        <p className="flex justify-center items-center gap-2 text-(--text-secondary) text-sm">
          You haven’t joined or created any team yet
          <CiCircleQuestion
            onClick={() => setmodal(true)}
            className="cursor-pointer text-xl hover:text-(--primary) transition"
          />
        </p>

        <button
          onClick={() => setform(true)}
          className="w-full bg-(--primary) hover:bg-(--primary-hover) transition py-2 rounded-lg font-semibold shadow-md text-white"
        >
          + Create Project
        </button>
      </div>

      {/* Info Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-(--card) text-(--text) p-6 rounded-2xl shadow-xl max-w-sm w-full relative border border-(--border)">

            <button
              onClick={() => setmodal(false)}
              className="absolute top-3 right-3 text-red-500 text-2xl"
            >
              <IoCloseCircleOutline />
            </button>

            <h3 className="text-lg font-bold mb-3">ℹ️ Team Info</h3>

            <p className="text-sm text-(--text-secondary) leading-relaxed">
              If you want to join a team, contact the team manager or leader to get invited.
              <br /><br />
              Or you can create your own team and start managing projects.
            </p>

            <p className="mt-4 text-sm text-(--text-secondary)">
              Read more in{" "}
              <NavLink to="/" className="text-(--primary) font-semibold hover:underline">
                documentation
              </NavLink>
            </p>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-(--card) text-(--text) p-6 rounded-2xl shadow-xl w-full max-w-md relative border border-(--border)">

            <button
              onClick={() => setform(false)}
              className="absolute top-3 right-3 text-red-500 text-2xl"
            >
              <IoCloseCircleOutline />
            </button>

            <Project_form user={user} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Developer_projects;