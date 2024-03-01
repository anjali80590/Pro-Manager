import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../TaskModel/TaskModal.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BaseUrl from "../BaseUrl/BaseUrl";
import Delete from "../../images/Delete.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import plus from "../../images/plus.png";
const UpdateTasksModal = ({ isOpen, taskId, onClose, onSave }) => {
  const [task, setTask] = useState({
    title: "",
    priority: "High",
    checklist: [],
    dueDate: null,
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const taskData = response.data;
        setTask({
          title: taskData.title || "",
          priority: taskData.priority || "High",
          checklist: taskData.checklist || [],
          dueDate: taskData.dueDate
            ? new Date(taskData.dueDate).toISOString().substring(0, 10)
            : null,
        });
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    if (isOpen && taskId) {
      fetchTask();
    }
  }, [isOpen, taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleRadioChange = (priorityValue) => {
    setTask((prevTask) => ({ ...prevTask, priority: priorityValue }));
  };

  const handleDateChange = (date) => {
    console.log("New date selected:", date);
    setTask({ ...task, dueDate: date });
  };

  const handleSave = async () => {
    if (!task.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!task.priority.trim()) {
      toast.error("Priority is required");
      return;
    }

    // Check that every checklist item has non-empty text
    if (task.checklist.some((item) => !item.text.trim())) {
      toast.error("All checklist items must be filled out");
      return;
    }
    try {
      const dueDateISO = task.dueDate
        ? new Date(task.dueDate).toISOString()
        : null;
      const updateData = { ...task, dueDate: dueDateISO };
      const response = await axios.put(
        `${BaseUrl}/tasks/${taskId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      //  onSave(response.data);
      const updatedTask = response.data;
      onSave(updatedTask);

      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChecklistChange = (index) => {
    setTask((prevTask) => ({
      ...prevTask,
      checklist: prevTask.checklist.map((item, itemIndex) =>
        itemIndex === index ? { ...item, isCompleted: !item.isCompleted } : item
      ),
    }));
  };

  const handleChecklistTextChange = (text, index) => {
    setTask((prevTask) => ({
      ...prevTask,
      checklist: prevTask.checklist.map((item, itemIndex) =>
        itemIndex === index ? { ...item, text: text } : item
      ),
    }));
  };

  const handleDeleteChecklistItem = (index) => {
    setTask((prevTask) => ({
      ...prevTask,
      checklist: prevTask.checklist.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  const handleAddChecklistItem = () => {
    setTask((prevTask) => ({
      ...prevTask,
      checklist: [...prevTask.checklist, { text: "", isCompleted: false }],
    }));
  };

  return (
    <>
      {isOpen && (
        <div className={styles.modalOverlay} onClick={handleOutsideClick}>
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.title}>
                Title <span className={styles.required}>*</span>
              </div>
              <input
                type="text"
                name="title"
                placeholder="Enter Task Title"
                value={task.title}
                onChange={handleChange}
                className={styles.taskInput}
              />

              <div className={styles.prioritySection}>
                <div>
                  Select Priority <span className={styles.required}>*</span>
                </div>
                <div
                  className={`${styles.customRadioButton} ${
                    task.priority === "High" ? styles.selectedPriority : ""
                  }`}
                  onClick={() => handleRadioChange("High")}
                >
                  <div
                    className={`${styles.radioDot} ${styles.highPriorityDot}`}
                  ></div>
                  HIGH PRIORITY
                </div>
                <div
                  className={`${styles.customRadioButton} ${
                    task.priority === "Medium" ? styles.selectedPriority : ""
                  }`}
                  onClick={() => handleRadioChange("Medium")}
                >
                  <div
                    className={`${styles.radioDot} ${styles.mediumPriorityDot}`}
                  ></div>
                  MODERATE PRIORITY
                </div>
                <div
                  className={`${styles.customRadioButton} ${
                    task.priority === "Low" ? styles.selectedPriority : ""
                  }`}
                  onClick={() => handleRadioChange("Low")}
                >
                  <div
                    className={`${styles.radioDot} ${styles.lowPriorityDot}`}
                  ></div>
                  LOW PRIORITY
                </div>
              </div>

              <div className={styles.checklistContainer}>
                <label className={styles.checklistLength}>
                  Checklist (
                  {task.checklist.filter((item) => item.isCompleted).length}/
                  {task.checklist.length})
                  <span className={styles.required}>*</span>
                </label>
                <div className={styles.scrollableChecklistContainer}>
                  {task.checklist.map((item, index) => (
                    <div key={index} className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => handleChecklistChange(index)}
                      />
                      <input
                        type="text"
                        placeholder="Add task"
                        value={item.text}
                        onChange={(e) =>
                          handleChecklistTextChange(e.target.value, index)
                        }
                      />
                      <button
                        onClick={() => handleDeleteChecklistItem(index)}
                        className={styles.deleteButton}
                      >
                        <img className={styles.del} src={Delete} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddChecklistItem}
                  className={styles.addNewButton}
                >
                  <img className={styles.plus} src={plus} /> Add New
                </button>
              </div>

              <div className={styles.modalFooterUpdate}>
                <div
                  className={styles.datePickerSection}
                  onClick={(e) => e.stopPropagation()}
                >
                  <DatePicker
                    className={styles.datepick}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select Due Date"
                    popperClassName={styles.centeredDatepicker}
                    popperPlacement="top"
                    selected={task.dueDate}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button className={styles.saveButton} onClick={handleSave}>
                    Update
                  </button>
                  <button className={styles.cancelButton} onClick={onClose}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateTasksModal;
