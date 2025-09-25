import { useState, useEffect } from "react";
import Modal from "../../components/common/Modal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileButton = ({ authUser }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        username: authUser.username,
        email: authUser.email,
        bio: authUser.bio,
        link: authUser.link,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        Edit profile
      </button>

      <Modal
        id="edit_profile_modal"
        title="Update Profile"
        footer={
          <button
            className="btn btn-primary rounded-full btn-sm text-white"
            onClick={(e) => {
              e.preventDefault();
              updateProfile(formData);
            }}
          >
            {isUpdatingProfile ? <LoadingSpinner size="sm" /> : "Update"}
          </button>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Full Name"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formData.fullName}
              name="fullName"
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Username"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formData.username}
              name="username"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formData.email}
              name="email"
              onChange={handleInputChange}
            />
            <textarea
              placeholder="Bio"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formData.bio}
              name="bio"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="password"
              placeholder="Current Password"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formData.currentPassword}
              name="currentPassword"
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="New Password"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formData.newPassword}
              name="newPassword"
              onChange={handleInputChange}
            />
          </div>
          <input
            type="text"
            placeholder="Link"
            className="flex-1 input border border-gray-700 rounded p-2 input-md"
            value={formData.link}
            name="link"
            onChange={handleInputChange}
          />
        </div>
      </Modal>
    </>
  );
};

export default EditProfileButton;
