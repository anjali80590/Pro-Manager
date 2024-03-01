import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { format, isPast } from "date-fns";

import { IoIosMore } from "react-icons/io";
import styles from "./TaskCard.module.css";
import arrow from "../../images/arrow.png";
import down from "../../images/down.png";
import UpdateTasksModal from "../UpdateTasksModal/UpdateTasksModal";
import BaseUrl from "../BaseUrl/BaseUrl";
const TaskCard = ({
  title,
  priority,
  checklist,
  dueDate,
  taskId,
  handleChecklistChange,
  markedChecklistCount,
  totalChecklistCount,
  currentStatus,
  onTaskDelete,
  handleStatusUpdate,
  task,
  onTaskUpdate,
  ...otherProps
}) => {
  const [showToast, setShowToast] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleUpdate = (updatedTask) => {
    onTaskUpdate(updatedTask);
  };

  const handleUpdateClick = () => {
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCloseModal = () => {
    setShowDeleteConfirmation(false);
  };
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const ConfirmationModal = ({ isOpen, onClose, onConfirm, children }) => {
    if (!isOpen) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.modalContent}>{children}</div>
          <div className={styles.modalActions}>
            <button onClick={onConfirm} className={styles.modalConfirmButton}>
              Yes, Delete
            </button>
            <button onClick={onClose} className={styles.modalCloseButton}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const statusOptions = ["Backlog", "To-Do", "Progress", "Done"];

  const toggleChecklist = () => setShowChecklist(!showChecklist);
  const toggleMenu = () => setShowMenu(!showMenu);

  const getPriorityStyle = (priorityLevel) => {
    switch (priorityLevel) {
      case "High":
        return styles.highPriority;
      case "Medium":
        return styles.mediumPriority;
      case "Low":
        return styles.lowPriority;
      default:
        return "";
    }
  };

  const formattedDueDate = dueDate ? format(new Date(dueDate), "dd MMM") : "";
  const dueDatePassed = dueDate ? isPast(new Date(dueDate)) : false;
  const getDueDateButtonStyle = () => {
    if (currentStatus === "Done") {
      return styles.dueDateDone;
    } else if (dueDatePassed) {
      return styles.dueDatePassed;
    } else {
      return styles.dueDate;
    }
  };

  const handleCheckboxChange = async (itemId, index) => {
    const isCompleted = !checklist[index].isCompleted;
    await handleChecklistChange(taskId, itemId, isCompleted);
  };

  const onStatusButtonClick = (newStatus) => {
    handleStatusUpdate(taskId, newStatus);
  };
  const token = localStorage.getItem("token");
  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`${BaseUrl}/tasks/${taskId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log(response.data.message);
        toast.success("Task successfully deleted");
        setShowDeleteConfirmation(false);

        onTaskDelete(taskId);
      } else {
        throw new Error("Failed to delete the task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task: " + error.message);
    }
  };

  const handleShareClick = () => {
    const taskUrl = `${window.location.origin}/tasks/${taskId}`;

    navigator.clipboard
      .writeText(taskUrl)
      .then(() => {
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Failed to copy link to clipboard: " + error.message);
      });
  };
  return (
    <div className={styles.wrapper}>
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      >
        Are you sure you want to Delete?
      </ConfirmationModal>

      <div className={styles.taskCard}>
        <div
          className={`${styles.priority} ${getPriorityStyle(priority)}`}
          onClick={toggleMenu}
        >
          <div className={styles.colorp}>
            {" "}
            <span className={styles.priorityDot}></span>
            {priority} Priority
          </div>
          <IoIosMore className={styles.dot} size={24} />
        </div>

        {showMenu && (
          <div ref={menuRef} className={styles.menu}>
            <button className={styles.menuButton} onClick={handleShareClick}>
              Share
            </button>
            <button
              className={styles.menuButton}
              onClick={() => setShowDeleteConfirmation(true)}
            >
              Delete
            </button>
            <button className={styles.menuButton} onClick={handleUpdateClick}>
              Update
            </button>
          </div>
        )}

        <div className={styles.title}>{title}</div>
        <div className={styles.checklistToggle} onClick={toggleChecklist}>
          <span className={styles.checklistCount}>
            Checklist ({markedChecklistCount}/{totalChecklistCount})
          </span>
          {showChecklist ? (
            <img src={arrow} className={styles.img} alt="Hide checklist" />
          ) : (
            <img src={down} className={styles.img} alt="Show checklist" />
          )}
        </div>

        {checklist && showChecklist && (
          <ul className={styles.checklist}>
            {checklist.map((item, index) => (
              <li key={item._id}>
                <input
                  type="checkbox"
                  checked={item.isCompleted}
                  className={styles.checkboxmark}
                  onChange={() => handleCheckboxChange(item._id, index)}
                />
                <span className={styles.checkitem}>{item.text}</span>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.footer}>
          {formattedDueDate ? (
            <div className={getDueDateButtonStyle()}>{formattedDueDate}</div>
          ) : (
            <div className={styles.dueDatePlaceholder} />
          )}
          <div className={styles.statusButtons}>
            {statusOptions.map((status) => {
              if (status !== currentStatus) {
                return (
                  <button
                    key={status}
                    onClick={() => onStatusButtonClick(status)}
                    className={styles.btn}
                  >
                    {status.toUpperCase()}
                  </button>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>

      <UpdateTasksModal
        isOpen={showUpdateModal}
        onClose={handleCloseUpdateModal}
        taskId={taskId}
        onSave={handleUpdate}
        {...otherProps}
      />

      {showToast && <div className={styles.customToast}>Link copied </div>}
    </div>
  );
};

export default TaskCard;
